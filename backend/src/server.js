const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter");

// Load env vars
dotenv.config();

// Connect to database (skip in test environment since tests use their own db connection)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Route files
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

// Body parser
app.use(express.json());

// Security middleware
app.use(helmet());
app.use(cors());
app.use(rateLimiter);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
