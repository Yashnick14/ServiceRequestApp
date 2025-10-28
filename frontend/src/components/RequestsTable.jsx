import React from "react";

const RequestsTable = ({
  requests,
  filter,
  onStatusChange,
  onSchedule,
  loading,
}) => {
  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading requests...</p>
    );

  if (!filtered.length)
    return (
      <p className="text-center text-gray-500 mt-10">No requests found.</p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Pickup</th>
            <th className="p-3 text-left">Dropoff</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{r.customer_name}</td>
              <td className="p-3">{r.phone}</td>
              <td className="p-3">{r.pickup_location}</td>
              <td className="p-3">{r.dropoff_location}</td>
              <td className="p-3 capitalize">{r.status}</td>
              <td className="p-3 space-x-2">
                {r.status === "pending" && (
                  <>
                    <button
                      onClick={() => onStatusChange(r.id, "approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusChange(r.id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status === "approved" && (
                  <button
                    onClick={() => onSchedule(r)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Schedule
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
