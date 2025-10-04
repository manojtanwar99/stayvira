import React, { useState, useEffect } from "react";

const EditListingModal = ({ listing, onClose, onSave, isBulk = false }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [parking, setParking] = useState("");
  const [furnished, setFurnished] = useState("");
  // State to hold the selected File object
  const [imageFile, setImageFile] = useState(null); 

  useEffect(() => {
    // Only pre-fill state for single edit mode
    if (!isBulk && listing) {
      setTitle(listing.title || "");
      setLocation(listing.location || "");
      setPrice(listing.price || "");
      setBedrooms(listing.bedrooms || "");
      setBathrooms(listing.bathrooms || "");
      setArea(listing.area || "");
      setPropertyType(listing.propertyType || "");
      setStatus(listing.status || "");
      setDescription(listing.description || "");
      setYearBuilt(listing.yearBuilt || "");
      setParking(listing.parking || "");
      setFurnished(listing.furnished || "");
    } else {
      // Clear fields if switching to bulk or no listing is passed
      setTitle("");
      setLocation("");
      setPrice("");
      setBedrooms("");
      setBathrooms("");
      setArea("");
      setPropertyType("");
      setStatus("");
      setDescription("");
      setYearBuilt("");
      setParking("");
      setFurnished("");
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
    if (bedrooms) formData.append("bedrooms", bedrooms);
    if (bathrooms) formData.append("bathrooms", bathrooms);
    if (area) formData.append("area", area);
    if (propertyType) formData.append("propertyType", propertyType);
    if (status) formData.append("status", status);
    if (description) formData.append("description", description);
    if (yearBuilt) formData.append("yearBuilt", yearBuilt);
    if (parking) formData.append("parking", parking);
    if (furnished) formData.append("furnished", furnished);
    
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl my-8 mx-4">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {isBulk ? "Bulk Edit Listings" : "Edit Listing"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Location *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Area (sq ft)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Property Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">Select Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">Select Status</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Price and Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Price *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Year Built"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Parking Spaces"
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Furnished Status */}
          <div>
            <select
              value={furnished}
              onChange={(e) => setFurnished(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">Furnished Status</option>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none"
            />
          </div>

          {/* File Input */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300 font-medium">
              Property Image (Optional)
            </label>
            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="p-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
            />
            {imageFile && (
                <p className="text-xs mt-1 dark:text-gray-400">
                  Selected: {imageFile.name}
                </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;