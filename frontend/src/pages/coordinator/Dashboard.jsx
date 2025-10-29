import React, { useEffect, useState } from "react";
import axiosClient from "../../services/AxiosClient";
import toast from "react-hot-toast";
import RequestsTable from "../../components/RequestsTable";
import AnalyticsChart from "../../components/AnalyticsChart";
import ScheduleModal from "../../components/ScheduleModal";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaClipboardList,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- Fetch Requests ----------------
  const fetchRequests = async (query = "", pageNum = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosClient.get(
        `/requests?search=${query}&page=${pageNum}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = res.data;
      setRequests(result.data || []);
      setTotalPages(result.pages || 1);
      setPage(result.page || 1);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(searchTerm, page);
  }, [searchTerm, page]);

  // ---------------- Bulk Action ----------------
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one request");
      return;
    }

    if (action === "schedule") {
      const first = requests.find((r) => r.id === selectedIds[0]);
      setSelectedRequest(first);
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((id) =>
          axiosClient.put(
            `/requests/${id}`,
            { status: action },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      toast.success(
        `Successfully ${action === "approved" ? "approved" : "rejected"} ${
          selectedIds.length
        } request${selectedIds.length > 1 ? "s" : ""}`
      );
      setSelectedIds([]);
      fetchRequests(searchTerm);
    } catch {
      toast.error("Failed to update selected requests");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Search ----------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchRequests(value);
    }, 500);
  };

  // ---------------- Conditions ----------------
  const hasSelection = selectedIds.length > 0;
  const selectedRequests = requests.filter((r) => selectedIds.includes(r.id));
  const allApproved =
    selectedRequests.length > 0 &&
    selectedRequests.every((r) => r.status === "approved");

  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-full lg:w-64 bg-linear-to-b from-blue-900 via-blue-800 to-blue-700 text-white flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold px-6 py-4 border-b border-blue-600 tracking-wide text-center lg:text-left">
            Admin Panel
          </h2>

          <nav className="mt-4 lg:mt-6 space-y-1">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center justify-center lg:justify-start gap-3 w-full text-left px-6 py-3 rounded-md font-medium bg-blue-700 border-l-4 border-white shadow-inner"
            >
              <FaHome className="text-lg" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-md font-medium transition"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <FaClipboardList className="text-gray-700 text-lg" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Customer Requests
          </h2>
        </div>

        {/* ---------------- Requests Section ---------------- */}
        <div className="mb-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4 w-full">
            {/* LEFT: Search + Filter */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto items-center">
              {/* Search Bar */}
              <div className="flex items-center px-4 py-2 rounded-md bg-white border border-gray-300 overflow-hidden w-full sm:w-72 shadow-sm">
                <FaSearch className="text-gray-500 mr-2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  disabled={loading}
                  className="w-full outline-none bg-transparent text-slate-600 text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white text-slate-700 text-sm shadow-sm w-full sm:w-auto">
                <FaFilter className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  disabled={loading}
                  className="bg-transparent outline-none text-sm w-full"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {/* RIGHT: Bulk Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end w-full xl:w-auto">
              <button
                onClick={() => handleBulkAction("approved")}
                disabled={!hasSelection || loading}
                className={`px-3 py-2 rounded-md text-sm font-medium text-white transition w-full sm:w-auto ${
                  hasSelection && !loading
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Approve
              </button>

              <button
                onClick={() => handleBulkAction("rejected")}
                disabled={!hasSelection || loading}
                className={`px-3 py-2 rounded-md text-sm font-medium text-white transition w-full sm:w-auto ${
                  hasSelection && !loading
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Reject
              </button>

              {allApproved && (
                <button
                  onClick={() => handleBulkAction("schedule")}
                  disabled={!hasSelection || loading}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-white transition w-full sm:w-auto ${
                    hasSelection && !loading
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Schedule
                </button>
              )}
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto">
            <RequestsTable
              requests={requests}
              filter={statusFilter}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>

        {/* ---------------- Analytics Section ---------------- */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-gray-700 text-lg" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Analytics Overview
            </h2>
          </div>

          <div className="overflow-x-auto">
            <AnalyticsChart />
          </div>
        </div>

        {/* ---------------- Schedule Modal ---------------- */}
        {showModal && (
          <ScheduleModal
            request={selectedRequest}
            onClose={() => setShowModal(false)}
            refresh={() => fetchRequests(searchTerm)}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
