import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Required for file path operations
import { fileURLToPath } from 'url'; // Required for __dirname equivalent in ES modules

import listingRoutes from "./routes/listingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ------------------------------------------
// 1. ES MODULE PATH SETUP (MUST BE AT THE TOP)
// ------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your frontend build folder (e.g., 'client/dist' or 'client/build')
// ADJUST 'client/dist' if your build folder is named differently
const buildPath = path.join(__dirname, 'client', 'dist'); 
// ------------------------------------------


// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend URL (for development)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));


// ------------------------------------------
// 2. API ROUTES (MUST COME BEFORE STATIC FILES)
// ------------------------------------------
app.use("/api/listings", listingRoutes);
app.use("/api/user", userRoutes);
app.use("/api", authRoutes);


// ------------------------------------------
// 3. STATIC FILE SERVING & CATCH-ALL (FOR PRODUCTION)
// ------------------------------------------

// Serve static files from the frontend build directory
app.use(express.static(buildPath));


// Base route for testing (ONLY if you want a JSON response for the root, 
// otherwise the static handler above will serve index.html)
// Since we are setting up for SPA, we can skip the JSON response for '/' 
// and let the static middleware handle it.


// Catch-all route: For any other GET request that hasn't been matched
// (i.e., client-side routes like /listings on refresh), serve index.html.
app.get('/', (req, res) => { 
  // IMPORTANT: Only send index.html if the request is not for an API route 
  // that was somehow missed (though express.static should handle assets)
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        // Fallback for file not found
        res.status(500).send('Could not serve application. Build not found.');
      }
    });
  } else {
    // If it's an API route that reached here, return 404
    res.status(404).json({ message: "API endpoint not found." });
  }
});


// Optional: A final 404 handler for non-GET API requests
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ message: "Route not found or unhandled method." });
    }
    next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));