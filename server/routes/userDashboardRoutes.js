const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const User = require('../models/user'); // Make sure this points to your User model
const { Event } = require('../models/event'); 
const { userDetails } = require("../controllers/userDashboard");
const { updatePreferences } = require("../controllers/userDashboard");
const jwt = require("jsonwebtoken");
// Define the recommendations function
const recommendations = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        const decoded = jwt.verify(token, "secret"); // Replace with your actual secret key
        const userEmail = decoded.email; // Extract email from the decoded token

        // Find the current user by email
        const currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch all users from MongoDB
        const users = await User.find({}); // This fetches all users
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        // Fetch all events from MongoDB
        const events = await Event.find({}); // Correct usage of Event model
        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found" });
        }

        // Map user data to send to Flask API
        const userEventData = users.map((user) => ({
            user_id: user._id,
            registeredEvents: user.registeredEvents || [],
            preferences: {
                categories: user.preferences?.categories || [],
                locations: user.preferences?.locations || [],
                interests: user.preferences?.interests || []
            }
        }));

        // Map event details to send to Flask API
        const eventDetails = events.map((event) => ({
            name: event.name,
            description: event.description,
            category: event.category,
            venue: event.venue,
        }));

        // Call Flask API with all users and event data
        const response = await axios.post('http://127.0.0.1:5001/recommend', {
            users: userEventData,
            events: eventDetails
        });

        // Get recommendations for the current user only
        const recommendations = response.data[currentUser._id];
        const recommendedEvents = await Event.find({ name: { $in: recommendations } });

        res.json(recommendedEvents); // Return recommendations for the current user
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
};

// Define the routes
router.route("/recommendations").post(recommendations);
router.route("/details").post(userDetails);
router.route("/updatePreferences").post(updatePreferences);

module.exports = router;
