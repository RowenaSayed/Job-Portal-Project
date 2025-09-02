import React from "react";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/app_for_jobs", {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const jobApplicantsCount = {};

        data.forEach((application) => {
          const jobId = application.job.id;
          const jobPosition = application.job.position;

          if (!jobApplicantsCount[jobId]) {
            jobApplicantsCount[jobId] = {
              position: jobPosition,
              count: 0,
            };
          }

          jobApplicantsCount[jobId].count++;
        });

        // Convert to array and sort by count (descending)
        let result = Object.values(jobApplicantsCount).sort(
          (a, b) => b.count - a.count
        );

        // Get top 4 and group the rest as "Others"
        const topJobs = result.slice(0, 4);
        const othersCount = result
          .slice(4)
          .reduce((sum, job) => sum + job.count, 0);

        if (othersCount > 0) {
          topJobs.push({
            position: "Others",
            count: othersCount,
          });
        }

        setJobData(topJobs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white w-full h-96 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-gray-600 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white w-full h-96 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p>Error loading data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );

  // Prepare data for the pie chart
  const chartData = {
    labels: jobData.map((job) => job.position),
    datasets: [
      {
        data: jobData.map((job) => job.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.9)",
          "rgba(54, 162, 235, 0.9)",
          "rgba(255, 206, 86, 0.9)",
          "rgba(75, 192, 192, 0.9)",
          "rgba(153, 102, 255, 0.9)",
          "rgba(255, 159, 64, 0.9)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#E5E7EB",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#F3F4F6",
        bodyColor: "#E5E7EB",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-2xl p-3 shadow-lg text-white w-full border border-gray-700"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-center text-xl font-semibold mb-2 text-gray-100">
        Top Jobs by Applicants
      </h3>
      <div className="w-full h-72 md:h-80 lg:h-96 flex justify-center items-center">
        <Pie data={chartData} options={options} />
      </div>
    </motion.div>
  );
}

export default PieChart;
