const User = require("../models/user");

// Fetch user details by user_token
const userDetails = async (req, res) => {
    const user_id = req.body.user_token;
    console.log(user_id);   
    try {
        const user = await User.findOne({ user_token: user_id });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        res.status(200).send(user);
        console.log("user",user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Error fetching user details", error: err });
    }
};

// Update user preferences
const updatePreferences = async (req, res) => {
    const userToken = req.body.user_token;
    const preferences = req.body.preferences;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { user_token: userToken },
            { preferences: preferences },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ msg: "User not found" });
        }
        res.status(200).send({ msg: "Preferences updated successfully", updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Error updating preferences", error: err });
    }
};

module.exports = {
    userDetails,
    updatePreferences,  // Include the updatedPreferences function here
};
