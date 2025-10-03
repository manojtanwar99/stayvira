import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import listingRoutes from "./routes/listingRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/listings", listingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
