import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },         // Keep title required
  description: { type: String },                  // Optional
  price: { type: Number },                        // Optional
  location: { type: String }                      // Optional
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);
