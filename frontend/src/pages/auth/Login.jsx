import React, { useState } from "react";
import axiosClient from "../../services/axiosClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", formData);
      localStorage.setItem("token", res.data.data.token);
      toast.success("Login successful!");

      // Redirect to Admin Dashboard after successful login
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/customerbg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg text-center">
          Coach Service App
        </h1>

        {/* Step 1: Role Selection */}
        {!role && (
          <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-8 w-full max-w-md text-center backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Choose your role
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setRole("admin")}
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Admin / Coordinator
              </button>
              <button
                onClick={() => navigate("/customer")}
                className="bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition font-medium"
              >
                Customer
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Admin Login Form */}
        {role === "admin" && (
          <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md mt-6 animate-fade-in">
            <button
              onClick={() => setRole("")}
              className="text-sm text-blue-600 mb-4 hover:underline"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Coordinator Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 text-white font-medium rounded-md transition ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
