import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function JobCard({ job, fetchJobs }) {
  const navigate = useNavigate();

  const removeJob = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete-job/${job.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }
       await fetchJobs();
      //  navigate("/jobs");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mb-6 bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer text-white">
      {/* Top actions */}
      <div className="flex justify-between mb-4">
        <h3 className="text-2xl font-semibold text-green-400">
          {job.position || job.positionName}
        </h3>
        <div className="flex gap-2">
          <button
            className="hover:bg-gray-700 h-fit p-2 rounded-full"
            title="Edit Job"
            onClick={() => navigate(`/Edit-Job/${job.id}`)}
          >
            <Settings size={16} />
          </button>
          <button
            className="hover:bg-gray-700 h-fit p-2 rounded-full"
            title="Delete Job"
            onClick={removeJob}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description or Skills */}
      <p className="text-gray-400 mb-4">
        {job.description || job.job_skills || "No description available"}
      </p>

      {/* Job Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
        <div>
          <strong className="text-gray-400">Location:</strong>{" "}
          {job.location || "Remote"}
        </div>
        <div>
          <strong className="text-gray-400">Company:</strong>{" "}
          {job.company || "Unknown"}
        </div>
        <div>
          <strong className="text-gray-400">Type:</strong>{" "}
          {job.Emp_type || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Period:</strong>{" "}
          {job.period || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Experience:</strong>{" "}
          {job.Work_experince || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Education:</strong>{" "}
          {job.edu_qualifications || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Skills:</strong>{" "}
          {job.job_skills || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Salary:</strong>{" "}
          {job.salaryoffer || "Not specified"}
        </div>
        <div>
          <strong className="text-gray-400">Deadline:</strong>{" "}
          {formatDeadline(job.Deadline_of_application)}
        </div>
      </div>
    </div>
  );
}
