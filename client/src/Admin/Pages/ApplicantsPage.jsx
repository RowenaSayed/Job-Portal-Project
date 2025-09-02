import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaSearch,
  FaFilter,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa";

const STATUS_DATA = {
  applied: { label: "Applied", color: "bg-blue-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  accepted: { label: "Accepted", color: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
};

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const JobApplicationsDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "applied_at",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}app_for_jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Update application status via API
  const updateApplicationStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}application/${id}/update-status/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE APP
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}delete-app/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Download resume with authentication
  const downloadResume = async (resumeUrl, fileName) => {
    try {
      // Normalize the resume URL
      const url = resumeUrl.startsWith("http")
        ? resumeUrl
        : `http://127.0.0.1:8000${
            resumeUrl.startsWith("/") ? "" : "/"
          }${resumeUrl}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || "resume.pdf"; // Fallback to 'resume.pdf' if no filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sorting functionality
  const sortedApplications = [...applications].sort((a, b) => {
    const sortKey = sortConfig.key;
    let aValue, bValue;

    if (sortKey === "position") aValue = a.job.position;
    else if (sortKey === "department") aValue = a.job.department;
    else if (sortKey === "status") aValue = STATUS_DATA[a.status].label;
    else aValue = a[sortKey];

    if (sortKey === "applied_at") {
      aValue = new Date(aValue);
      bValue = new Date(b[sortKey]);
    } else {
      bValue =
        sortKey === "position"
          ? b.job.position
          : sortKey === "department"
          ? b.job.department
          : sortKey === "status"
          ? STATUS_DATA[b.status].label
          : b[sortKey];
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filtered applications
  const filteredApplications = sortedApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Job Applications Dashboard</h1>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            className="pl-10 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_DATA).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key, direction });
            }}
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="position-asc">Sort by Position (A-Z)</option>
            <option value="position-desc">Sort by Position (Z-A)</option>
            <option value="applied_at-asc">Sort by Date (Oldest)</option>
            <option value="applied_at-desc">Sort by Date (Newest)</option>
            <option value="status-asc">Sort by Status (A-Z)</option>
            <option value="status-desc">Sort by Status (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="border-b border-gray-700 pb-4 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-600 p-2 rounded-full">
                        <FaUser className="text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {app.applicant.username}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {app.job.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(app.id);
                        }}
                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-900/20"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(app);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-900/20"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        STATUS_DATA[app.status].color
                      }`}
                    >
                      {STATUS_DATA[app.status].label}
                    </span>
                    <span className="text-gray-400">
                      <FaCalendarAlt className="inline mr-1" />
                      {app.applied_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Details */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
          {selectedApplication ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Application Details</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedApplication.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-700 p-3 rounded-full">
                    <FaUser className="text-2xl text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedApplication.applicant.username}
                    </h3>
                    <h4 className="text-sm text-gray-400">
                      {selectedApplication.applicant.email}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Applied on {selectedApplication.applied_at}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Position:</label>
                  <p className="flex items-center gap-2 mt-1">
                    <FaBriefcase className="text-gray-500" />
                    {selectedApplication.job.position}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Status:</label>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => {
                      const status = e.target.value;
                      updateApplicationStatus(selectedApplication.id, status);
                      setSelectedApplication({
                        ...selectedApplication,
                        status,
                      });
                    }}
                    className={`${
                      STATUS_DATA[selectedApplication.status].color
                    } bg-opacity-20 text-white rounded-md py-1 px-2 mt-1`}
                  >
                    {Object.entries(STATUS_DATA).map(([key, { label }]) => (
                      <option key={key} value={key} className="bg-gray-800">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Portfolio:</label>
                  <p className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                    {selectedApplication.Portfolio_link}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Resume:</label>
                  <button
                    onClick={() =>
                      downloadResume(
                        selectedApplication.resume_url,
                        `${selectedApplication.applicant.username}_resume.pdf`
                      )
                    }
                    className="text-gray-400 hover:text-green-300 p-2 rounded-full hover:bg-green-900/20"
                  >
                    <FaDownload /> Download resume
                  </button>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Cover Letter:</label>
                  <div className="mt-1 bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-300">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FaEye className="text-4xl mx-auto mb-2" />
              <p>Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsDashboard;
