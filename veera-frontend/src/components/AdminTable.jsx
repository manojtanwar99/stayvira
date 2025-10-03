import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const AdminTable = ({
  listings,
  onEdit,
  onDelete,
  onSort,
  sortKey,
  sortOrder,
  selectedIds = [],
  onSelect,
  onSelectAll
}) => {
  if (!listings || listings.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No listings available.</p>;
  }

  const renderSortIcon = (key) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={selectedIds.length === listings.length && listings.length > 0}
                  onChange={onSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                onClick={() => onSort("title")}
              >
                Title {renderSortIcon("title")}
              </th>
              <th
                className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                onClick={() => onSort("location")}
              >
                Location {renderSortIcon("location")}
              </th>
              <th
                className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                onClick={() => onSort("price")}
              >
                Price {renderSortIcon("price")}
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr
                key={l._id}
                className={`border-t border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedIds.includes(l._id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <td className="p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(l._id)}
                    onChange={() => onSelect(l._id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-3 text-sm font-medium">{l.title}</td>
                <td className="p-3 text-sm">{l.location || "-"}</td>
                <td className="p-3 text-sm">{l.price || "-"}</td>
                <td className="p-3 text-sm flex space-x-2">
                  <button
                    onClick={() => onEdit(l)}
                    className="p-2 rounded hover:bg-yellow-500/20 transition-colors"
                    title="Edit Listing"
                  >
                    <PencilIcon className="w-5 h-5 text-yellow-500" />
                  </button>
                  <button
                    onClick={() => onDelete(l._id)}
                    className="p-2 rounded hover:bg-red-500/20 transition-colors"
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
      <div className="md:hidden flex flex-col gap-4">
        {listings.map((l) => (
          <div
            key={l._id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
              selectedIds.includes(l._id) ? "ring-2 ring-blue-500/50" : "hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(l._id)}
                  onChange={() => onSelect(l._id)}
                  className="cursor-pointer"
                />
                <h3 className="text-lg font-semibold">{l.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(l)}
                  className="p-2 rounded hover:bg-yellow-500/20 transition-colors"
                  title="Edit Listing"
                >
                  <PencilIcon className="w-5 h-5 text-yellow-500" />
                </button>
                <button
                  onClick={() => onDelete(l._id)}
                  className="p-2 rounded hover:bg-red-500/20 transition-colors"
                  title="Delete Listing"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
            <p><span className="font-semibold">Location:</span> {l.location || "-"}</p>
            <p><span className="font-semibold">Price:</span> {l.price || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
