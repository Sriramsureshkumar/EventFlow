const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cron = require("node-cron");  // Import cron
const User = require('../models/user'); // Import models (adjust paths as needed)
const { Event } = require('../models/event'); // Ensure this points to your Event model
const axios = require('axios');

dotenv.config();

// Nodemailer transporter configuration
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

function sendSMS(Email, otp) {
    let mailOptions = {
        from: process.env.NODE_MAILER_USER,
        to: Email,
        subject: "One Time Password - EventFlow",
        html: `Please keep your OTP confidential and do not share it with anyone. The OTP will be valid for five minutes only. <br><strong>OTP: ${otp}</strong><br><br>Thank you for choosing EventFlow!<br><br>If you have any questions, please contact at:<br>Sriram: sriram.se21@bitsathy.ac.in`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

function sendTicket(Details) {
    let mailOptions = {
        from: process.env.NODE_MAILER_USER,
        to: Details.email,
        subject: `Your Online Event Pass for ${Details.event_name} - EventFlow✨`,
        html: `Dear <i>${Details.name}</i>,<br><br>Thank you for registering for ${Details.event_name}! We are excited to have you join us and want to make sure that you have all the information you need to have a great time.<br><br>Your online pass has been generated and is ready for you to use. Please remember to keep this pass with you at all times during the event and do not share it with anyone else.<br><br><strong>Pass Number: ${Details.pass}</strong><br><br>Here are the details of your registration:<br>Name: ${Details.name}<br>Amount Paid: ${Details.price}<br>Address: ${Details.address1} <br> City: ${Details.city} <br> PinCode: ${Details.zip}<br><br>If you have any questions or concerns, please don't hesitate to reach out to us. We're here to help, please contact us at:<br>Sriram: sriram.se21@bitsathy.ac.in.<br><br>Best regards,<br>The EventFlow Team`,
    };

    transporter.sendMail(mailOptions, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

// Function to send random event recommendations
async function sendRandomRecommendation() {
    try {
        // Fetch all users
        const users = await User.find({});
        if (!users || users.length === 0) return console.log("No users found");

        // Pick a random user
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Fetch all events
        const events = await Event.find({});
        if (!events || events.length === 0) return console.log("No events found");

        // Make a POST request to Flask API to get recommendations for this user
        const userEventData = {
            user_id: randomUser._id,
            registeredEvents: randomUser.registeredEvents || [],
            preferences: {
                categories: randomUser.preferences?.categories || [],
                locations: randomUser.preferences?.locations || [],
                interests: randomUser.preferences?.interests || [],
            }
        };

        const eventDetails = events.map((event) => ({
            name: event.name,
            description: event.description,
            category: event.category,
            venue: event.venue,
            profileImage: event.profileImage, // Assuming there's a field for the image
            url: event.url // Assuming there's a field for the event URL
        }));

        const flaskResponse = await axios.post('http://127.0.0.1:5001/recommend', {
            users: [userEventData],
            events: eventDetails
        });

        // Get recommendations for the random user
        const recommendations = flaskResponse.data[randomUser._id];

        if (!recommendations || recommendations.length === 0) {
            return console.log(`No recommendations found for user: ${randomUser.email}`);
        }

        // Find recommended events in MongoDB
        const recommendedEvents = await Event.find({ name: { $in: recommendations } });

        // Prepare email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Hello ${randomUser.username},</h2>
            <p>We are excited to bring you some personalized event recommendations based on your preferences:</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            ${recommendedEvents.map(event => `
            <div style="margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #ddd; display: flex; align-items: center;">
                <img src="${event.profile}" alt="${event.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 10px; margin-right: 20px;"/>
                <div>
                <h3 style="margin: 0; color: #333;">${event.name}</h3>
                <p style="margin: 5px 0; color: #777;">${event.venue}</p>
                <a href="http://localhost:3000/event/${event.event_id}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Event</a>
                </div>
            </div>
            `).join('')}
            </div>
            <p>We hope you find these events interesting and have a great time!</p>
            <p>Best regards,<br>The EventFlow Team</p>
            </div>
        `;

        // Configure nodemailer to send the email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.NODE_MAILER_USER,
            to: randomUser.email,
            subject: randomUser.username+",🎉 Exciting Event Recommendations Just for You! 🎉",
            html: emailContent,
        };

        // Send the email
        transporter.sendMail(mailOptions, function (err, success) {
            if (err) {
                console.log("Error sending email:", err);
            } else {
                console.log(`Email sent successfully to ${randomUser.email}`);
            }
        });
    } catch (error) {
        console.error("Error in sending recommendations:", error);
    }
}


// Schedule the task to run at a specific interval (e.g., every hour)
// You can also randomize the schedule timing by generating a random interval
cron.schedule("0 * * * *", sendRandomRecommendation); // Every hour

module.exports = {
    sendSMS,
    sendTicket,
    sendRandomRecommendation,
};
