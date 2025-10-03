import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AdminTable from "../components/listing/AdminTable";
import Footer from "../components/Footer";
import EditListingModal from "../components/listing/EditListingModal";
import { useListingStore } from "../store/listingStore";

const Listings = () => {
  const { listings, fetchListings, addListing, removeListing, updateListing } =
    useListingStore();

  const [selected, setSelected] = useState(null); // single edit
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false); // bulk edit modal
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch fresh data on mount
    const loadData = async () => {
      setLoading(true);
      await fetchListings();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleEdit = (listing) => {
    setSelected(listing);
    setOpen(true);
  };

  const handleSave = async (listing) => {
    if (listing._id) await updateListing(listing._id, listing);
    else await addListing(listing);
    setOpen(false);
  };

  const handleBulkEdit = async (updates) => {
    for (const id of selectedIds) {
      const original = listings.find((l) => l._id === id);
      if (original) await updateListing(id, { ...original, ...updates });
    }
    setBulkOpen(false);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (allIds) => {
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 w-full max-w-full overflow-x-hidden flex flex-col gap-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          >
            + Add New Listing
          </button>

          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                onClick={() => setBulkOpen(true)}
              >
                Bulk Edit ({selectedIds.length})
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                onClick={() => {
                  selectedIds.forEach((id) => removeListing(id));
                  setSelectedIds([]);
                }}
              >
                Bulk Delete ({selectedIds.length})
              </button>
            </div>
          )}
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Loading listings...
              </span>
            </div>
          ) : listings.length > 0 ? (
            <AdminTable
              listings={listings}
              onEdit={handleEdit}
              onDelete={removeListing}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={() => handleSelectAll(listings.map((l) => l._id))}
            />
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No listings found.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {open && (
        <EditListingModal
          listing={selected}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}

      {bulkOpen && (
        <EditListingModal
          listing={{}}
          onClose={() => setBulkOpen(false)}
          onSave={handleBulkEdit}
          isBulk
        />
      )}
    </div>
  );
};

export default Listings;
