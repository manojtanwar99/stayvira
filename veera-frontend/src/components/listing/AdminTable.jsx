import React, { useState, useMemo } from "react";
import {
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { getImageUrl } from "../../utility/utility";

// Define the base URL for the images. 
// NOTE: Adjust this if your frontend runs on a different port/domain than your backend.
// Example: If backend is on http://localhost:5000
//const IMAGE_BASE_URL = "http://localhost:5000"; // Assuming the image path is relative to the root/proxy is set up

const AdminTable = ({
  listings = [],
  onEdit,
  onDelete,
  onSort,
  sortKey,
  sortOrder,
  selectedIds = [],
  onSelect,
  onSelectAll,
  pageSize = 5,
}) => {
  // ... (STATE, FILTER, PAGINATION logic remains the same) ...
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  // ---------------- FILTER ----------------
  const filteredListings = useMemo(() => {
    return listings.filter(
      (l) =>
        l.title?.toLowerCase().includes(filter.toLowerCase()) ||
        l.location?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [listings, filter]);

  // ---------------- PAGINATION ----------------
  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + paginatedListings.length - 1, totalItems);

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const renderSortIcon = (key) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? (
        <span className="ml-1 text-blue-400">↑</span>
      ) : (
        <span className="ml-1 text-blue-400">↓</span>
      );
    }
    return null;
  };

  // ---------------- EMPTY STATE ----------------
  if (listings.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-4 p-4">
        No listings available.
      </p>
    );
  }

  // --- HELPER FUNCTION TO GET IMAGE URL ---
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     return `${IMAGE_BASE_URL}/${imagePath}`; 
// };


  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Filter/Search */}
      <div className="p-4 bg-gray-900 border-b border-gray-700 flex items-center">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // reset to page 1 when filtering
          }}
          className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-300 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === paginatedListings.length &&
                    paginatedListings.length > 0
                  }
                  onChange={onSelectAll}
                  className="cursor-pointer bg-gray-600 border-gray-500 rounded text-blue-500 focus:ring-blue-500"
                />
              </th>
              {/* 🚨 ADDED IMAGE COLUMN HEADER 🚨 */}
              <th className="p-4 text-left text-xs font-medium text-gray-300 w-24">
                Image
              </th>
              <th
                className="p-4 text-left text-xs font-medium text-gray-300 cursor-pointer select-none whitespace-nowrap"
                onClick={() => onSort("title")}
              >
                Title {renderSortIcon("title")}
              </th>
              <th
                className="p-4 text-left text-xs font-medium text-gray-300 cursor-pointer select-none whitespace-nowrap"
                onClick={() => onSort("location")}
              >
                Location {renderSortIcon("location")}
              </th>
              <th
                className="p-4 text-left text-xs font-medium text-gray-300 cursor-pointer select-none w-24"
                onClick={() => onSort("price")}
              >
                Price {renderSortIcon("price")}
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-300 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedListings.map((l) => (
              <tr
                key={l._id}
                className={`border-t border-gray-700 transition-colors duration-200 ${
                  selectedIds.includes(l._id)
                    ? "bg-blue-900/30"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <td className="p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(l._id)}
                    onChange={() => onSelect(l._id)}
                    className="cursor-pointer bg-gray-600 border-gray-500 rounded text-blue-500 focus:ring-blue-500"
                  />
                </td>
                
                {/* 🚨 ADDED IMAGE COLUMN DATA 🚨 */}
                <td className="p-4">
                  {l.image ? (
                    <img
                      src={getImageUrl(l.image)}
                      alt={l.title}
                      className="w-16 h-10 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs">No Img</span>
                  )}
                </td>

                <td className="p-4 text-sm font-medium text-gray-100">
                  {l.title}
                </td>
                <td className="p-4 text-sm text-gray-300">
                  {l.location || "-"}
                </td>
                <td className="p-4 text-sm text-green-400 font-semibold">
                  {l.price || "-"}
                </td>
                <td className="p-4 text-sm flex space-x-2">
                  <button
                    onClick={() => onEdit(l)}
                    className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors"
                    title="Edit Listing"
                  >
                    <PencilIcon className="w-5 h-5 text-yellow-500" />
                  </button>
                  <button
                    onClick={() => onDelete(l._id)}
                    className="p-2 rounded-full hover:bg-red-500/20 transition-colors"
                    title="Delete Listing"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4 p-4">
        {paginatedListings.map((l) => (
          <div
            key={l._id}
            className={`bg-gray-700 rounded-lg shadow border transition-all duration-200 ${
              selectedIds.includes(l._id)
                ? "ring-2 ring-blue-500 border-blue-600"
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            {/* 🚨 ADDED IMAGE TO MOBILE CARD VIEW 🚨 */}
            {l.image && (
              <img
                src={getImageUrl(l.image)}
                alt={l.title}
                className="w-full h-40 object-cover rounded-t-lg mb-3"
              />
            )}
            
            <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    checked={selectedIds.includes(l._id)}
                    onChange={() => onSelect(l._id)}
                    className="cursor-pointer bg-gray-800 border-gray-500 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <h3 className="text-lg font-semibold text-gray-50">{l.title}</h3>
                </div>
                <div className="flex space-x-2">
                    <button
                    onClick={() => onEdit(l)}
                    className="p-1 rounded-full hover:bg-yellow-500/20 transition-colors"
                    title="Edit Listing"
                    >
                    <PencilIcon className="w-5 h-5 text-yellow-500" />
                    </button>
                    <button
                    onClick={() => onDelete(l._id)}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                    title="Delete Listing"
                    >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                </div>
                </div>
                <p className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">Location:</span>{" "}
                {l.location || "-"}
                </p>
                <p className="text-sm text-green-400">
                <span className="font-medium text-gray-200">Price:</span>{" "}
                {l.price || "-"}
                </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- PAGINATION CONTROLS (remains the same) --- */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-t border-gray-700 sm:px-6 rounded-b-lg">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-300">
            Showing{" "}
            <span className="font-medium text-white">
              {totalItems === 0 ? 0 : startItem}
            </span>{" "}
            –{" "}
            <span className="font-medium text-white">
              {totalItems === 0 ? 0 : endItem}
            </span>{" "}
            of <span className="font-medium text-white">{totalItems}</span> results
          </p>

          <nav className="relative z-0 inline-flex rounded-lg shadow-md">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={isPrevDisabled}
              className={`px-3 py-2 rounded-l-lg border border-gray-600 ${
                isPrevDisabled
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-2 border-t border-b border-gray-600 ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={isNextDisabled}
              className={`px-3 py-2 rounded-r-lg border border-gray-600 ${
                isNextDisabled
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;