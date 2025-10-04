// backend/middleware/upload.js (New File)
import multer from 'multer';
import path from 'path'; // Need path for file extension/directory handling

// 1. Define where to store the file and how to name it
const storage = multer.diskStorage({
  // Specify the destination directory for the uploaded files
  destination: (req, file, cb) => {
    // __dirname in ESM is tricky, assume a 'uploads' folder in your project root
    cb(null, 'uploads/'); // Make sure this 'uploads' directory exists!
  },
  // Define the file name (e.g., listing-1234567890.jpg)
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Configure Multer
// 'image' is the field name that will hold the file in the frontend form
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit 
}).single('image'); // .single() means we expect one file named 'image'

export default upload;