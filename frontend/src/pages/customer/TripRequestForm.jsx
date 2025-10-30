import React, { useState } from "react";
import axiosClient from "../../services/AxiosClient";
import toast from "react-hot-toast";

const TripRequestForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_date: "",
    pickup_time: "",
    passengers: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const rules = {
      customer_name: "Full name is required",
      phone: "Valid 10-digit phone number required",
      pickup_location: "Pickup location required",
      dropoff_location: "Dropoff location required",
      pickup_date: "Pickup date required",
      pickup_time: "Pickup time required",
      passengers: "Number of passengers required",
    };

    const newErrors = {};
    Object.entries(rules).forEach(([key, msg]) => {
      const val = formData[key]?.trim?.() || formData[key];
      if (!val) newErrors[key] = msg;
      if (key === "phone" && !/^[0-9]{10}$/.test(formData.phone))
        newErrors.phone = msg;
    });

    // Prevent past dates
    if (formData.pickup_date) {
      const today = new Date().setHours(0, 0, 0, 0);
      const selected = new Date(formData.pickup_date).setHours(0, 0, 0, 0);
      if (selected < today)
        newErrors.pickup_date = "Please select a future date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please enter valid details");
      return;
    }

    const pickup_time = `${formData.pickup_date} ${formData.pickup_time}`;

    try {
      setLoading(true);
      await axiosClient.post("/requests", { ...formData, pickup_time });
      toast.success("Trip request submitted!");
      setSubmitted(true);
      setFormData({
        customer_name: "",
        phone: "",
        pickup_location: "",
        dropoff_location: "",
        pickup_date: "",
        pickup_time: "",
        passengers: "",
        notes: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div
        className="h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/bus-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-3xl font-semibold mb-4">Request Submitted!</h2>
          <p className="text-gray-200 mb-6 max-w-md">
            Our coordinator will contact you soon.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center py-10 px-4"
      style={{
        backgroundImage: "url('/images/customerbg.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Form container */}
      <div className="relative bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Trip Request Form
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Fill in your details to request a coach service.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { label: "Full Name", name: "customer_name", type: "text" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Pickup Location", name: "pickup_location", type: "text" },
            {
              label: "Dropoff Location",
              name: "dropoff_location",
              type: "text",
            },
            { label: "Pickup Date", name: "pickup_date", type: "date" },
            { label: "Pickup Time", name: "pickup_time", type: "time" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {field.label} *
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 focus:ring-1 outline-none ${
                  errors[field.name]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-500 focus:ring-gray-400"
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Passengers + Notes side-by-side */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Passengers *
            </label>
            <input
              type="number"
              name="passengers"
              min="1"
              value={formData.passengers}
              onChange={handleChange}
              placeholder="Number of passengers"
              className={`w-full border rounded-md p-2 focus:ring-1 outline-none ${
                errors.passengers
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-500 focus:ring-gray-400"
              }`}
            />
            {errors.passengers && (
              <p className="text-red-500 text-sm mt-1">{errors.passengers}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Optional..."
              className="w-full border border-gray-500 rounded-md p-2 focus:ring-1 focus:ring-gray-400 outline-none resize-none"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white text-lg rounded-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-700"
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
