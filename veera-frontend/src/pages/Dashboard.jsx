import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import StatsCard from "../components/StatsCard";
// import { useStore } from "../store/zustandStore";
import { useListingStore } from '../store/listingStore';





const Dashboard = () => {
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


    return (
        <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

            {/* Navbar */}
            <Navbar />
            {/* Main Content */}
            <main className="flex-1 px-6 py-6 w-full max-w-full overflow-x-hidden flex flex-col gap-6">


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <StatsCard label="Total Listings" value={listings.length} />
                    <StatsCard label="Total Bookings" value={bookings.length} />
                    <StatsCard label="Total Revenue" value={`$${bookings.reduce((sum, b) => sum + b.amount, 0)}`} />
                </div>

                {/* Charts */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <DashboardCharts listings={listings} bookings={bookings || []} />
                </div>
            </main>


            {/* Footer */}
            <Footer />

        </div>
    );
};

export default Dashboard;


