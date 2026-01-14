require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRoute = require("./routes/UploadRoutes");
const authRoutes = require("./routes/Auth");
const reportRoutes = require("./routes/report");
const connectDB = require("./config/db");

const app = express();

// Connect DB FIRST
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api", uploadRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
