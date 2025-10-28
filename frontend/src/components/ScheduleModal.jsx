import React, { useEffect, useState } from "react";
import axiosClient from "../services/AxiosClient";
import toast from "react-hot-toast";

const ScheduleModal = ({ request, onClose, refresh }) => {
  const [driver_id, setDriver] = useState("");
  const [vehicle_id, setVehicle] = useState("");
  const [scheduled_time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // ✅ Fetch available drivers and vehicles
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [driversRes, vehiclesRes] = await Promise.all([
          axiosClient.get("/drivers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosClient.get("/vehicles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDrivers(driversRes.data.drivers || driversRes.data.data || []);
        setVehicles(vehiclesRes.data.vehicles || vehiclesRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load drivers or vehicles");
        console.error("Error fetching dropdown data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDropdownData();
  }, []);

  // ✅ Submit schedule form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driver_id || !vehicle_id || !scheduled_time) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axiosClient.post(
        `/assignments/${request.id}/schedule`,
        { driver_id, vehicle_id, scheduled_time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request scheduled successfully!");
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule request");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loading overlay while fetching data
  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
          <p className="text-gray-600 text-lg">
            Loading available drivers and vehicles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Schedule Request #{request.id}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ Driver Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Driver
            </label>
            <select
              value={driver_id}
              onChange={(e) => setDriver(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Driver --</option>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.license_no || "No License"})
                  </option>
                ))
              ) : (
                <option disabled>No drivers available</option>
              )}
            </select>
          </div>

          {/* ✅ Vehicle Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Vehicle
            </label>
            <select
              value={vehicle_id}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate_number} — {vehicle.type}
                  </option>
                ))
              ) : (
                <option disabled>No vehicles available</option>
              )}
            </select>
          </div>

          {/* ✅ Schedule Time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduled_time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Scheduling..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
