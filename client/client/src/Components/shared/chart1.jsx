import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion";

function MyActivityChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Generate random dummy data for 6 months
    const months = ["January", "February", "March", "April", "May", "June"];

    const jobsPosted = months.map(
      () => Math.floor(Math.random() * 15) + 5 // Random between 5-20
    );

    if (chartRef.current) {
      // Destroy previous chart if exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Jobs Posted",
              data: jobsPosted,
              borderColor: "#8B5CF6", // Purple color to match stats
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              tension: 0.4,
              fill: true,
              borderWidth: 2,
              pointBackgroundColor: "#8B5CF6",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "My Activity - Posted Jobs (Dummy Data)",
              font: { size: 16 },
              color: "#F3F4F6", // Light text color
            },
            legend: {
              position: "top",
              labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
                color: "#E5E7EB", // Light text color
              },
            },
            tooltip: {
              backgroundColor: "rgba(31, 41, 55, 0.9)", // Dark tooltip
              titleColor: "#F3F4F6",
              bodyColor: "#E5E7EB",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 1,
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(75, 85, 99, 0.5)", // Lighter grid lines
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                color: "#9CA3AF", // Gray text color
              },
            },
            y: {
              grid: {
                color: "rgba(75, 85, 99, 0.5)", // Lighter grid lines
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#9CA3AF", // Gray text color
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-72 md:h-80 lg:h-96">
        <canvas ref={chartRef} />
      </div>
    </motion.div>
  );
}
//-----------------------============================================
// import React, { useEffect, useRef, useState } from "react";
// import { Chart } from "chart.js/auto";
// import { parseISO, format } from "date-fns";
// import { motion } from "framer-motion";

// function MyActivityChart() {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/api/jobs", {
//           method: "GET",
//           headers: {
//             Authorization: `Token ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const jobs = await response.json();

//         const monthCounts = {};

//         jobs.forEach((job) => {
//           const date = parseISO(job.posted_at);
//           const monthYear = format(date, "MMMM yyyy");

//           if (!monthCounts[monthYear]) {
//             monthCounts[monthYear] = 0;
//           }
//           monthCounts[monthYear]++;
//         });

//         const sortedMonths = Object.keys(monthCounts).sort((a, b) => {
//           return parseISO(a) - parseISO(b);
//         });

//         const months = sortedMonths;
//         const counts = sortedMonths.map((month) => monthCounts[month]);

//         if (chartRef.current) {
//           if (chartInstance.current) {
//             chartInstance.current.destroy();
//           }

//           const ctx = chartRef.current.getContext("2d");

//           chartInstance.current = new Chart(ctx, {
//             type: "line",
//             data: {
//               labels: months,
//               datasets: [
//                 {
//                   label: "Jobs Posted",
//                   data: counts,
//                   borderColor: "#8B5CF6",
//                   backgroundColor: "rgba(139, 92, 246, 0.2)",
//                   tension: 0.4,
//                   fill: true,
//                   borderWidth: 2,
//                   pointBackgroundColor: "#8B5CF6",
//                   pointRadius: 5,
//                   pointHoverRadius: 7,
//                 },
//               ],
//             },
//             options: {
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 title: {
//                   display: true,
//                   text: "My Activity - Posted Jobs",
//                   font: { size: 16 },
//                   color: "#F3F4F6",
//                 },
//                 legend: {
//                   position: "top",
//                   labels: {
//                     padding: 20,
//                     usePointStyle: true,
//                     pointStyle: "circle",
//                     color: "#E5E7EB",
//                   },
//                 },
//                 tooltip: {
//                   backgroundColor: "rgba(31, 41, 55, 0.9)",
//                   titleColor: "#F3F4F6",
//                   bodyColor: "#E5E7EB",
//                   borderColor: "rgba(255, 255, 255, 0.1)",
//                   borderWidth: 1,
//                   callbacks: {
//                     label: (context) =>
//                       `${context.dataset.label}: ${context.raw}`,
//                   },
//                 },
//               },
//               scales: {
//                 x: {
//                   grid: {
//                     color: "rgba(75, 85, 99, 0.5)",
//                   },
//                   ticks: {
//                     maxRotation: 45,
//                     minRotation: 45,
//                     color: "#9CA3AF",
//                   },
//                 },
//                 y: {
//                   grid: {
//                     color: "rgba(75, 85, 99, 0.5)",
//                   },
//                   beginAtZero: true,
//                   ticks: {
//                     stepSize: 1,
//                     color: "#9CA3AF",
//                   },
//                 },
//               },
//             },
//           });
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, []);

//   if (loading)
//     return <div className="text-center py-8 text-gray-300">Loading...</div>;

//   if (error)
//     return <div className="text-center py-8 text-red-500">Error: {error}</div>;

//   return (
//     <motion.div
//       className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-lg border border-gray-700"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="w-full h-72 md:h-80 lg:h-96">
//         <canvas ref={chartRef} />
//       </div>
//     </motion.div>
//   );
// }

 export default MyActivityChart;
