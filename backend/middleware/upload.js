// backend/middleware/upload.js

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; // <-- New Import

// 1. Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path to the 'uploads' folder (one level up from middleware)
const uploadDir = path.join(__dirname, '..', 'uploads'); 

// 2. Define where to store the file and how to name it
const storage = multer.diskStorage({
  // Specify the destination directory for the uploaded files
  destination: (req, file, cb) => {
    // IMPORTANT: Use the absolute path
    cb(null, uploadDir); 
  },
  // Define the file name (e.g., listing-1234567890.jpg)
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Use path.extname to safely get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 3. Configure Multer
// 'image' is the field name that will hold the file in the frontend form
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit (5 megabytes)
}).single('image'); // .single() means we expect one file named 'image'

export default upload;