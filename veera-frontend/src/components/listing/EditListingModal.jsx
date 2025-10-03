import React, { useState, useEffect } from "react";

const EditListingModal = ({ listing, onClose, onSave, isBulk = false }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!isBulk && listing) {
      setTitle(listing.title || "");
      setLocation(listing.location || "");
      setPrice(listing.price || "");
    }
  }, [listing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = {};
    if (title) updates.title = title;
    if (location) updates.location = location;
    if (price) updates.price = price;

    onSave(isBulk ? updates : { ...listing, ...updates });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{isBulk ? "Bulk Edit Listings" : "Edit Listing"}</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
