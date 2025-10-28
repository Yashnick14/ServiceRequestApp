import React, { useEffect, useState } from "react";
import axiosClient from "../services/AxiosClient";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const AnalyticsChart = () => {
  const [data, setData] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/analytics/daily", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.reverse()); // reverse to show oldest → newest
    } catch {
      console.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "New Requests (7 days)",
        data: data.map((d) => d.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-gray-700 font-semibold mb-4">📈 Daily Requests</h3>
      <Line data={chartData} options={options} height={80} />
    </div>
  );
};

export default AnalyticsChart;
