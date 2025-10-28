import React, { useEffect, useState } from "react";
import axiosClient from "../../services/AxiosClient";
import toast from "react-hot-toast";
import RequestsTable from "../../components/RequestsTable";
import AnalyticsChart from "../../components/AnalyticsChart";
import ScheduleModal from "../../components/ScheduleModal";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || res.data.data || []);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.put(
        `/requests/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${newStatus}!`);
      fetchRequests();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSchedule = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Analytics Section */}
      <div className="mb-8">
        <AnalyticsChart />
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">
          Service Requests
        </h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Requests Table */}
      <RequestsTable
        requests={requests}
        filter={statusFilter}
        onStatusChange={handleStatusChange}
        onSchedule={handleSchedule}
        loading={loading}
      />

      {/* Schedule Modal */}
      {showModal && (
        <ScheduleModal
          request={selectedRequest}
          onClose={() => setShowModal(false)}
          refresh={fetchRequests}
        />
      )}
    </div>
  );
};

export default Dashboard;
