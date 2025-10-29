import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RequestsTable = ({
  requests,
  filter,
  loading,
  selectedIds,
  setSelectedIds,
  page,
  setPage,
  totalPages,
}) => {
  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (filtered.length === selectedIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-200 whitespace-nowrap">
          <tr>
            <th className="px-4 py-4 text-left">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 && selectedIds.length === filtered.length
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Pickup
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Dropoff
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
          {loading ? (
            <tr>
              <td
                colSpan="6"
                className="py-8 text-center text-gray-500 text-sm"
              >
                Loading requests...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-8 text-center text-gray-500 text-sm"
              >
                No requests found.
              </td>
            </tr>
          ) : (
            filtered.map((r) => (
              <tr
                key={r.id}
                className={`hover:bg-gray-50 transition duration-150 ease-in-out ${
                  selectedIds.includes(r.id) ? "bg-blue-50" : ""
                }`}
              >
                {/* Checkbox */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleSelect(r.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>

                {/* Data Columns */}
                <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                  {r.customer_name}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                  {r.phone}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                  {r.pickup_location}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                  {r.dropoff_location}
                </td>
                <td className="px-4 py-4 text-sm capitalize font-medium">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      r.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : r.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : r.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : r.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <FaChevronLeft /> Prev
          </button>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition ${
              page === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;
