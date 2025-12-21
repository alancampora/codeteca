import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/Auth";
import loginRoutes from "./routes/Login";
import userRoutes from "./routes/User";
import movieRoutes from "./routes/Movie";
import reviewRoutes from "./routes/Review";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FE_URI, // Allow your frontend origin
    credentials: true, // Allow cookies and credentials
  }),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(PORT, () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    console.error("❌ ERROR: MONGODB_URI environment variable is not set!");
    console.error("Please configure your MongoDB Atlas connection string in the .env file");
    console.error("See README.md for instructions on setting up MongoDB Atlas");
  } else {
    mongoose
      .connect(connectionString, {})
      .then(() => console.log("✅ MongoDB connected successfully"))
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("Check your MONGODB_URI in .env file");
      });
  }

  console.log(`Server running on port ${PORT}`);
});
