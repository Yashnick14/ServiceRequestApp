import React, { useState } from "react";
import axiosClient from "../../services/AxiosClient";
import toast from "react-hot-toast";

const TripRequestForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
    passengers: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const {
      customer_name,
      phone,
      pickup_location,
      dropoff_location,
      pickup_time,
      passengers,
    } = formData;

    if (
      !customer_name ||
      !phone ||
      !pickup_location ||
      !dropoff_location ||
      !pickup_time ||
      !passengers
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/requests", formData);
      toast.success("Trip request submitted successfully!");
      setSubmitted(true);
      setFormData({
        customer_name: "",
        phone: "",
        pickup_location: "",
        dropoff_location: "",
        pickup_time: "",
        passengers: "",
        notes: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit your request."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
        <h2 className="text-3xl font-semibold text-green-700 mb-4">
          ✅ Request Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Our coordinator will review your trip and contact you soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          🚌 Trip Request Form
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Please fill in your details below to request a coach service.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Customer Name */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="07XXXXXXXX"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Pickup */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pickup Location *
            </label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Enter pickup location"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Dropoff */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Dropoff Location *
            </label>
            <input
              type="text"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="Enter dropoff location"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Pickup Time */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pickup Time *
            </label>
            <input
              type="datetime-local"
              name="pickup_time"
              value={formData.pickup_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Passengers */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Number of Passengers *
            </label>
            <input
              type="number"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              min="1"
              placeholder="Enter number of passengers"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Notes (Full width) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Additional Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Submit button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white text-lg font-medium rounded-md transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripRequestForm;
