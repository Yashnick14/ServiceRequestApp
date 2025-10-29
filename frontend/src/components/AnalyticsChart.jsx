import React, { useEffect, useState } from "react";
import axiosClient from "../services/AxiosClient";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Title
);

const AnalyticsChart = () => {
  const [data, setData] = useState([]);

  // ---------------- Fetch Analytics ----------------
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/analytics/daily", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.reverse());
    } catch {
      console.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ---------------- Prepare Chart Data ----------------
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Requests",
        data: data.map((d) => d.count),
        borderColor: "#2563eb",
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(37,99,235,0.3)");
          gradient.addColorStop(1, "rgba(37,99,235,0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563eb",
      },
    ],
  };

  // ---------------- Chart Options ----------------
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} requests`,
        },
      },
    },
    elements: { line: { borderWidth: 2 } },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
          color: "#475569",
          font: { size: 12, weight: "bold" },
        },
        grid: {
          color: "rgba(226,232,240,0.6)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748b",
          maxRotation: 45,
          minRotation: 0,
          font: { size: 11 },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Requests Count",
          color: "#475569",
          font: { size: 12, weight: "bold" },
        },
        grid: {
          color: "rgba(226,232,240,0.6)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748b",
          stepSize: 1,
          precision: 0,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-semibold">Daily Requests</h3>
        <span className="text-sm text-blue-600 font-medium">
          {data.length > 0 ? `${data[data.length - 1].count} today` : "--"}
        </span>
      </div>

      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsChart;
