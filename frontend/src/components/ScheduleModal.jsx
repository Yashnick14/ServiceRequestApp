import React, { useEffect, useState } from "react";
import axiosClient from "../services/AxiosClient";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  FaUser,
  FaCarSide,
  FaPhoneAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const ScheduleModal = ({ request, onClose, refresh }) => {
  const [driver_id, setDriver] = useState("");
  const [vehicle_id, setVehicle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // ---------------- Pre-fill Schedule Date/Time from pickup_time ----------------
  useEffect(() => {
    if (request?.pickup_time) {
      const pickup = new Date(request.pickup_time);

      const formattedDate = pickup.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = pickup
        .toTimeString()
        .split(":")
        .slice(0, 2)
        .join(":"); // HH:mm

      setScheduleDate(formattedDate);
      setScheduleTime(formattedTime);
    }
  }, [request]);

  // ---------------- Fetch Drivers & Vehicles ----------------
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

  // ---------------- React Select Options ----------------
  const driverOptions = drivers.map((driver) => ({
    value: driver.id,
    label: (
      <div className="flex flex-col text-sm">
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-500" />
          <span className="font-medium text-gray-800">{driver.name}</span>
        </div>
        <div className="ml-6 text-gray-600 text-xs flex items-center gap-2">
          <span>Age: {driver.age || "N/A"}</span>
          <span className="flex items-center gap-1">
            <FaPhoneAlt className="text-gray-500 text-xs" />{" "}
            {driver.phone || "No number"}
          </span>
        </div>
      </div>
    ),
  }));

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: (
      <div className="flex flex-col text-sm">
        <div className="flex items-center gap-2">
          <FaCarSide className="text-gray-500" />
          <span className="font-medium text-gray-800">{vehicle.type}</span>
        </div>
        <div className="ml-6 text-gray-600 text-xs">
          Plate: {vehicle.plate || "N/A"} | Capacity:{" "}
          {vehicle.capacity ? `${vehicle.capacity} seats` : "N/A"}
        </div>
      </div>
    ),
  }));

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driver_id || !vehicle_id) {
      toast.error("Driver and vehicle selection are required");
      return;
    }

    const scheduled_time = `${scheduleDate}T${scheduleTime}`;

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

  // ---------------- Loading Overlay ----------------
  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center shadow-md">
          <p className="text-gray-600 text-base sm:text-lg">
            Loading available drivers and vehicles...
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Render Modal ----------------
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 sm:px-0 z-50">
      <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-5 sm:mb-6 text-center">
          <FaClock className="text-3xl text-blue-600 mb-2" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Schedule Request #{request.id}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Prefilled Schedule Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-600 mb-1">
                Schedule Date
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-sm sm:text-base font-medium">
                  {scheduleDate || "N/A"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-600 mb-1">
                Schedule Time
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700">
                <FaClock className="text-gray-500" />
                <span className="text-sm sm:text-base font-medium">
                  {scheduleTime || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Driver Dropdown */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600 mb-1">
              Select Driver
            </label>
            <Select
              options={driverOptions}
              placeholder="-- Choose Driver --"
              onChange={(option) => setDriver(option?.value || "")}
              className="react-select-container text-sm sm:text-base"
              classNamePrefix="react-select"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#D1D5DB",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#3B82F6" },
                }),
              }}
            />
          </div>

          {/* Vehicle Dropdown */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600 mb-1">
              Select Vehicle
            </label>
            <Select
              options={vehicleOptions}
              placeholder="-- Choose Vehicle --"
              onChange={(option) => setVehicle(option?.value || "")}
              className="react-select-container text-sm sm:text-base"
              classNamePrefix="react-select"
              isClearable
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-white text-sm sm:text-base font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-700"
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
