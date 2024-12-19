const mongoose = require("mongoose");
const { eventSchema } = require("./event");
const preferencesSchema = new mongoose.Schema({
    categories: [String],          // Preferred event categories
    locations: [String],           // Preferred event locations (renamed from venues)
    ageRange: String,              // User's age range
    interests: [String],          // User's interests
    activityLevel: String    
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
        user_token: {
            type: String,
            required: true,
            unique: true,
        },
        reg_number: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        registeredEvents: [eventSchema],
        preferences: preferencesSchema,
        recommendations: [eventSchema] 

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
