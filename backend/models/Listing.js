import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    type: String,
    required: false, // Image is optional during creation
  },
  description: { type: String },                  // Optional
  price: { type: Number },                        // Optional
  location: { type: String },                     // Optional
  bedrooms: { type: Number },                     // Optional
  bathrooms: { type: Number },                    // Optional
  area: { type: String },                         // Optional - stored as string to allow "1200 sq ft" format
  propertyType: { 
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', ''],
  },                                              // Optional
  status: { 
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented', 'pending', ''],
  },                                              // Optional
  yearBuilt: { type: String },                    // Optional - string to handle various formats
  parking: { type: String },                      // Optional - string to allow "2 spaces" or just "2"
  furnished: { 
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished', ''],
  },                                              // Optional
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);