import React from "react";
import Header from "../../Components/shared/Header";
import StatCard from "../../Components/shared/StatCard";
import Sidebar from "../../Components/shared/Sidebar";
import PieChart from "../../Components/shared/PieChart";
import MyActivityChart from "../../Components/shared/chart1";

import {
  BarChart2,
  ShoppingBag,
  ShoppingBagIcon,
  User,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
const OverViewPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* <Sidebar /> */}
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Overview" />
        <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8 space-y-10">
          {/* STATS */}
          {/* <motion.div
            className="flex justify-around"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <StatCard
              name="Total Applicants"
              icon={User}
              value="1,234"
              color="#8B5CF6"
              description="Total applicants across all jobs"
            />
            <StatCard
              name="Published Jobs"
              icon={ShoppingBagIcon}
              value="567"
              color="#EC4899"
              description="Currently active job postings"
            />
          </motion.div> */}

          {/* CHARTS */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <MyActivityChart />
            <PieChart />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default OverViewPage;
