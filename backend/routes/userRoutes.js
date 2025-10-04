import express from "express";
import User from "../models/User.js";
import upload from '../middleware/upload.js';
import multer from 'multer';
import jwt from 'jsonwebtoken'; // Add this import

const router = express.Router();

// Middleware to authenticate and get current user
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🚨 CRITICAL FIX: Store the entire decoded payload on req.user 🚨
    req.user = decoded; 
    
    req.userId = decoded.id || decoded.userId; // Store user ID in request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- GET CURRENT USER PROFILE ---
router.get("/profile", authenticateUser, async (req, res) => {
  try {

  
    
    // 🚨 USE OPTIONAL CHAINING FOR SAFETY 🚨
    const userEmail = req.user?.email;
    
    console.log(userEmail);

    if (userEmail) {
      // If the ID is the problematic "1", search by email instead
      const user = await User.findOne({ email: userEmail }).select('-password');
    } else {
      // For all other users (who should have proper ObjectIds), use findById
      const user = await User.findById(req.userId).select('-password');
    }


     console.log(user);
     if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GET ALL USERS (Admin only - optional) ---
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Fixed variable name
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- POST/CREATE USER ---
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ msg: `Upload Error: ${err.message}` });
    }
    
    try {
      const { userName, firstName, lastName, email } = req.body; // Fixed typo: fisrtName -> firstName
      
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Added leading slash

      const newUser = new User({
        userName, 
        firstName,  // Fixed
        lastName, 
        email,
        profileImage: imagePath // Changed 'image' to 'profileImage' for clarity
      });

      const savedUser = await newUser.save(); // Fixed variable name
      res.status(201).json(savedUser);

    } catch (dbError) {
      res.status(500).json({ msg: 'Database error creating user.', error: dbError.message });
    }
  });
});

// --- UPLOAD/UPDATE PROFILE IMAGE FOR CURRENT USER ---
router.post("/upload-image", authenticateUser, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ msg: `Upload Error: ${err.message}` });
    }
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
      const imagePath = `/uploads/${req.file.filename}`;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { profileImage: imagePath },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        imageUrl: imagePath, 
        message: 'Image uploaded successfully',
        user: updatedUser 
      });

    } catch (dbError) {
      res.status(500).json({ msg: 'Database error updating image.', error: dbError.message });
    }
  });
});

// --- PUT/UPDATE CURRENT USER PROFILE ---
router.put("/profile", authenticateUser, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ msg: `Upload Error: ${err.message}` });
    }
    
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated this way
    delete updateData.password;
    delete updateData._id;

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    try {
      const updated = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updated);
    } catch (dbError) {
      res.status(500).json({ msg: 'Database error updating user.', error: dbError.message });
    }
  });
});

// --- PUT/UPDATE ANY USER BY ID (Admin) ---
router.put("/:id", authenticateUser, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ msg: `Upload Error: ${err.message}` });
    }
    
    const userId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    try {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updated);
    } catch (dbError) {
      res.status(500).json({ msg: 'Database error updating user.', error: dbError.message });
    }
  });
});

// --- DELETE USER ---
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;