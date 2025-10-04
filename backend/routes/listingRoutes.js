import express from "express";
import Listing from "../models/Listing.js";
import upload from '../middleware/upload.js'
import multer from 'multer'; 

const router = express.Router();

// --- GET ALL LISTINGS ---
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- POST/CREATE LISTING (Correctly uses Multer and saves relative path) ---
router.post('/', (req, res) => {
    // Multer middleware runs first
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ msg: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ msg: `Upload Error: ${err.message}` });
        }
        
        try {
            const { title, description, price } = req.body;
            
            // CORRECT: Saves the publicly accessible relative path
            const imagePath = req.file ? `uploads/${req.file.filename}` : null; 

            const newListing = new Listing({
                title,
                description,
                price,
                image: imagePath 
            });

            const savedListing = await newListing.save();
            res.status(201).json(savedListing);

        } catch (dbError) {
            res.status(500).json({ msg: 'Database error creating listing.', error: dbError.message });
        }
    });
});


// --- PUT/UPDATE LISTING (MODIFIED TO USE MULTER AND HANDLE IMAGE UPDATE) ---
router.put("/:id", (req, res) => {
    // 🚨 1. Wrap the logic in the Multer middleware to process FormData/file 🚨
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ msg: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ msg: `Upload Error: ${err.message}` });
        }
        
        const listingId = req.params.id;
        
        // 🚨 2. Collect all text fields from req.body 🚨
        const updateData = { ...req.body };

        // 🚨 3. If a new file was uploaded, add the new path 🚨
        if (req.file) {
            // Saves the publicly accessible relative path
            updateData.image = `uploads/${req.file.filename}`;
            // OPTIONAL: Add logic here to delete the old image file from disk
        }

        try {
            const updated = await Listing.findByIdAndUpdate(
                listingId, 
                { $set: updateData }, // Use $set to only update fields provided
                { new: true, runValidators: true }
            );
            
            if (!updated) {
                return res.status(404).json({ error: "Listing not found" });
            }
            
            res.json(updated);
        } catch (dbError) {
            // Handle database errors
            res.status(500).json({ msg: 'Database error updating listing.', error: dbError.message });
        }
    });
});

// --- DELETE LISTING ---
router.delete("/:id", async (req, res) => {
  try {
    // OPTIONAL: Get listing path first and delete file from disk
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;