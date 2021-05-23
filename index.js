const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect DB
connectDB();

const corsOptions = {
  origin: "https://easynote-2bd49.web.app/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use cors
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false })); // to access req.body

app.get("/", (req, res) => {
  res.send("API Running");
});

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/topic", require("./routes/api/topic"));
app.use("/api/card", require("./routes/api/card"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
