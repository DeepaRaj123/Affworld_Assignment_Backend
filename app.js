// Import modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "25mb" }));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Enable CORS for frontend requests during development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000", // Frontend URL during development
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Allow cookies if needed
    })
  );
} else {
  app.use(cors());
}

// Register API routes BEFORE serving the frontend
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/posts", postRoutes);

// Serve static files for frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Catch-all route for React frontend
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// Export the app for Vercel
module.exports = app;
