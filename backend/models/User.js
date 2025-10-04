import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    image: {
        type: String,
        required: false, // Image is optional during creation, change if needed
    },
    // Keep title required
    firstName: { type: String },                  // Optional
    lastName: { type: Number },                        // Optional
    email: { type: String }                      // Optional
}, { timestamps: true });

export default mongoose.model("User", userSchema);
