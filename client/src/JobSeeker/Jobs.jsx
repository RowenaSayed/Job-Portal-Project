import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Navbar3 from "../Components/shared/Navbar3";
import { Link } from "react-router-dom";

import JobApplicationModal from "../components/Jobs/JobApplicationModal";

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const [filters, setFilters] = useState({
    location: "",
    company: "",
    Emp_type: "",
    period: "",
    Work_experience: "",
    edu_qualifications: "",
    job_skills: "",
    salaryoffer: "",
    Deadline_of_application: "",
  });

  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/allJobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (search.trim().length >= 2) {
      const words = search.toLowerCase().split(/\s+/);
      filtered = filtered.filter((job) =>
        words.every((word) =>
          (job.position || job.positionName || "").toLowerCase().includes(word)
        )
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim().length >= 2) {
        filtered = filtered.filter((job) =>
          (job[key] || "").toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    setFilteredJobs(filtered);
  }, [search, filters, jobs]);

  const formatDeadline = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const handleApplyClick = (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setSelectedJob(job);
      setShowModal(true);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {!localStorage.getItem("token") && (
        <nav className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-md">
          <div className="text-2xl font-bold text-blue-600">YallNe4ta8all</div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              Main Page
            </Link>
            <Link
              to="/empreg"
              className="px-4 py-2 text-gray-600 hover:text-blue-600"
            >
              Register
            </Link>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 border border-gray-600 rounded hover:bg-blue-50">
              Post Job
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-600">
              Log In
            </button>
            <button
              onClick={() => navigate("/Jobs")}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Get Started
            </button>
          </div>
        </nav>
      )}
      {localStorage.getItem("token") && <Navbar3 />}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Job Listings</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg shadow"
          >
            {darkMode ? "🌙 Dark On" : "☀️ Dark Off"}
          </button>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by Position Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-full max-w-xs space-y-4 sticky top-4 h-fit bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border dark:border-gray-700">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <h2 className="text-xl font-semibold">Filters</h2>
              <span className="text-blue-500 text-sm">
                {filtersOpen ? "Hide ▲" : "Show ▼"}
              </span>
            </div>

            {filtersOpen && (
              <div className="space-y-3 mt-2 transition-all duration-300">
                {[
                  { label: "Location", name: "location" },
                  { label: "Company", name: "company" },
                  { label: "Employment Type", name: "Emp_type" },
                  { label: "Period", name: "period" },
                  { label: "Experience", name: "Work_experience" },
                  { label: "Education", name: "edu_qualifications" },
                  { label: "Skills", name: "job_skills" },
                  { label: "Salary", name: "salaryoffer" },
                  { label: "Deadline", name: "Deadline_of_application" },
                ].map(({ label, name }) => (
                  <input
                    key={name}
                    name={name}
                    type={name === "Deadline_of_application" ? "date" : "text"}
                    value={filters[name]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [name]: e.target.value,
                      }))
                    }
                    placeholder={`Filter by ${label}`}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Job Cards */}
          <div className="flex-1 space-y-6">
            {filteredJobs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No jobs found matching your criteria.
              </p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {job.position || job.positionName || "Unknown Position"}
                    </h2>
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {job.description ||
                      job.job_skills ||
                      "No description available"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Location:</strong>{" "}
                      {job.location || "Not specified"}
                    </div>
                    <div>
                      <strong>Company:</strong> {job.company || "Not specified"}
                    </div>
                    <div>
                      <strong>Type:</strong> {job.Emp_type || "Not specified"}
                    </div>
                    <div>
                      <strong>Period:</strong> {job.period || "Not specified"}
                    </div>
                    <div>
                      <strong>Experience:</strong>{" "}
                      {job.Work_experience || "Not specified"}
                    </div>
                    <div>
                      <strong>Education:</strong>{" "}
                      {job.edu_qualifications || "Not specified"}
                    </div>
                    <div>
                      <strong>Skills:</strong>{" "}
                      {job.job_skills || "Not specified"}
                    </div>
                    <div>
                      <strong>Salary:</strong>{" "}
                      {job.salaryoffer || "Not specified"}
                    </div>
                    <div>
                      <strong>Deadline:</strong>{" "}
                      {formatDeadline(job.Deadline_of_application)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          open={showModal}
          token={localStorage.getItem("token")}
          onClose={() => {
            setShowModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
