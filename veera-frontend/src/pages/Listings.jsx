import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AdminTable from "../components/listing/AdminTable";
import Footer from "../components/Footer";
import EditListingModal from "../components/listing/EditListingModal";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import StatsCard from "../components/StatsCard";
// import { useStore } from "../store/zustandStore";
import { useListingStore } from '../store/listingStore';





const Listings = () => {
    const { listings, fetchListings, addListing, removeListing, updateListing } = useListingStore();

    const [selected, setSelected] = useState(null); // single edit
    const [open, setOpen] = useState(false);
    const [bulkOpen, setBulkOpen] = useState(false); // bulk edit modal
    const [selectedIds, setSelectedIds] = useState([]);
    const bookings = [
        { _id: "b1", date: "2025-10-01", amount: 1200 },
        { _id: "b2", date: "2025-10-05", amount: 800 },
        { _id: "b3", date: "2025-09-12", amount: 500 },
    ];

    useEffect(() => {
        fetchListings();
    }, []);

    const handleEdit = (listing) => {
        setSelected(listing);
        setOpen(true);
    };

    const handleSave = (listing) => {
        if (listing._id) updateListing(listing._id, listing);
        else addListing(listing);
        setOpen(false);
    };

    const handleBulkEdit = (updates) => {
        selectedIds.forEach((id) => {
            const original = listings.find((l) => l._id === id);
            if (original) {
                updateListing(id, { ...original, ...updates });
            }
        });
        setBulkOpen(false);
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((sid) => sid !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const handleSelectAll = (allIds) => {
        if (selectedIds.length === allIds.length) setSelectedIds([]);
        else setSelectedIds(allIds);
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
                            setSelected(null); // clear selected listing
                            setOpen(true);     // open modal
                        }}
                    >
                        + Add New Listing
                    </button>
                    {selectedIds.length > 0 && (
                        <div className="flex gap-2">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition" onClick={() => setBulkOpen(true)}>
                                Bulk Edit ({selectedIds.length})
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition" onClick={() => { selectedIds.forEach((id) => removeListing(id)); setSelectedIds([]); }}>
                                Bulk Delete ({selectedIds.length})
                            </button>
                        </div>
                    )}
                </div>
                {/* Listings Table */}
                <div className="overflow-x-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <AdminTable
                        listings={listings}
                        onEdit={handleEdit}
                        onDelete={removeListing}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={() => handleSelectAll(listings.map((l) => l._id))}
                    />
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
                    listing={{}} // empty object for bulk
                    onClose={() => setBulkOpen(false)}
                    onSave={handleBulkEdit}
                    isBulk
                />
            )}
        </div>
    );
};

export default Listings;


