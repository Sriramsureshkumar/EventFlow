const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userRouter = require("./routes/authRoutes");
const dashboardRouter = require("./routes/userDashboardRoutes");
const paymentRouter = require("./routes/paymentRoute");
const adminRouter = require("./routes/adminRoutes");
const eventRouter = require("./routes/eventRoutes");
const { sendRandomRecommendation } = require("./controllers/smsController");
// const checkInRouter = require("./routes/checkInRoutes")

dotenv.config();
console.log("in index - ", process.env.MONGO_ATLAS_URI);
//database url
mongoose
    .connect(process.env.MONGO_ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => { })
    .catch((err) => {
        console.log(err);
    });

const scheduleRandomTask = () => {
    // Generate random delay between 30 minutes and 3 hours
    const randomDelay = Math.floor(Math.random() * (180 - 30 + 1) + 30) * 60000;

    setTimeout(() => {
        sendRandomRecommendation(); 
        scheduleRandomTask();
    }, randomDelay);
};

// Start the random schedule
scheduleRandomTask();
sendRandomRecommendation();

require("./models/otpAuth");
require("./models/user");
require("./models/admin");
require("./models/event");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());

app.use("/", paymentRouter);
app.use("/user", userRouter);
app.use("/user", dashboardRouter);

app.use("/", adminRouter);
app.use("/", eventRouter);
app.get("/", (req, res) => {
    res.send("EventFlow API");
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server Running on🚀: ${process.env.PORT}`);
});
