import React, { useState, useEffect } from "react";

const EditListingModal = ({ listing, onClose, onSave, isBulk = false }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  // State to hold the selected File object
  const [imageFile, setImageFile] = useState(null); 

  useEffect(() => {
    // Only pre-fill state for single edit mode
    if (!isBulk && listing) {
      setTitle(listing.title || "");
      setLocation(listing.location || "");
      setPrice(listing.price || "");
    } else {
      // Clear fields if switching to bulk or no listing is passed
      setTitle("");
      setLocation("");
      setPrice("");
    }
    // Always clear the file input when the modal opens/changes context
    setImageFile(null); 
  }, [listing, isBulk]);

  // Handler for the file input change: stores the selected file
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use FormData for submission as it is required to send files
    const formData = new FormData();
    let idToPass = null; // We will pass the ID separately

    // --- 1. Append Text Fields ---
    // Only append fields that have a value (meaning the user entered something)
    // This is safer for partial updates.
    if (title) formData.append("title", title);
    if (location) formData.append("location", location);
    if (price) formData.append("price", price);
    
    // --- 2. Append Image File ---
    // IMPORTANT: 'image' must match the field name defined in your Multer setup
    if (imageFile) {
        formData.append("image", imageFile);
    }

    // --- 3. Determine ID to Pass ---
    if (!isBulk && listing) {
      // Single Edit: Pass the ID of the specific listing being edited
      idToPass = listing._id; 
    } 
    // Bulk Edit: idToPass remains null, as the parent component manages the list of IDs

    // Pass the FormData object and the ID to the parent handler
    onSave(formData, idToPass); 
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{isBulk ? "Bulk Edit Listings" : "Edit Listing"}</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          
          {/* Text Inputs */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          {/* File Input */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">New Image (Optional)</label>
            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="p-1 border rounded dark:bg-gray-700 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageFile && (
                <p className="text-xs mt-1 dark:text-gray-400">Selected: {imageFile.name}</p>
            )}
          </div>


          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;