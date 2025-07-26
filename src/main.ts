import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";


import { PrismaClient } from "@prisma/client";
import authRouter from "./auth/routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body
app.use(morgan("dev"));  // Log requests

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
app.use("/api/auth", authRouter);
// app.use("/api/kyc", kycRoutes);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port: ${PORT}`);
});
