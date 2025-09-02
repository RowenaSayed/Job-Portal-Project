import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initialJob = {
  positionName: "",
  positionInfo: "",
  education: "",
  experience: "",
  deadline: "",
  employmentType: "Full-time",
  salary: "",
  location: "",
  skills: "",
  period: "",
};

function EditJobs() {
  const [form, setForm] = useState(initialJob);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [companyCity, setCompanyCity] = useState("");
  const [companyGov, setCompanyGov] = useState("");

  useEffect(() => {
    const fetchCompanyLocation = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/emp_profile", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const profileData = await response.json();
        setCompanyCity(profileData.city);
        setCompanyGov(profileData.country);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrors({
          ...errors,
          nonFieldError: "Failed to load company location",
        });
      }
    };

    fetchCompanyLocation();
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/job-details/${jobId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch job details");

        const data = await res.json();
        const job = data["Job deatails"] || {};
        setForm({
          positionName: job.position || "",
          positionInfo: job.description || "",
          education: job.edu_qualifications || "",
          experience: job.Work_experince || "",
          deadline: job.Deadline_of_application?.split("T")[0] || "",
          employmentType: job.Emp_type || "Full-time",
          salary: job.salaryoffer || "",
          location: job.location || "",
          skills: job.job_skills || "",
          period: job.period || "",
        });
      } catch (err) {
        console.error("Error fetching job:", err);
        setErrors({ ...errors, global: "Error fetching job details" });
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!form.positionName)
      newErrors.positionName = "Position name is required";
    if (!form.deadline) newErrors.deadline = "Deadline is required";
    if (!form.location) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to update the job?"
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/update-job/${jobId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            position: form.positionName,
            description: form.positionInfo,
            edu_qualifications: form.education,
            Work_experince: form.experience,
            Deadline_of_application: form.deadline,
            Emp_type: form.employmentType,
            salaryoffer: form.salary,
            location: form.location,
            job_skills: form.skills,
            period: form.period,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update job");
      }

      navigate("/Jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      setErrors({
        ...errors,
        global: err.message || "Network or server error",
      });
    }
  };

  const getError = (field) => errors[field] || "";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 overflow-hidden">
      <div
        className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 overflow-y-auto"
        style={{ height: "90vh" }}
      >
        <h2 className="text-2xl font-bold text-center">Edit Job</h2>
        {errors.global && (
          <p className="text-red-500 text-center">{errors.global}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="positionName"
              placeholder="Name of the Position"
              value={form.positionName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.positionName ? "border-2 border-red-500" : ""
              }`}
              required
            />
            {errors.positionName && (
              <p className="text-red-500 text-sm">{errors.positionName}</p>
            )}
          </div>

          <div>
            <textarea
              name="positionInfo"
              placeholder="Position Info (Details & Requirements)"
              rows="3"
              value={form.positionInfo}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.positionInfo ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.positionInfo && (
              <p className="text-red-500 text-sm">{errors.positionInfo}</p>
            )}
          </div>

          <div>
            <input
              name="education"
              placeholder="Education Qualifications / Required Skills"
              value={form.education}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.education ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.education && (
              <p className="text-red-500 text-sm">{errors.education}</p>
            )}
          </div>

          <div>
            <input
              name="experience"
              placeholder="Work Experience Needed"
              value={form.experience}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.experience ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>

          <div>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.deadline ? "border-2 border-red-500" : ""
              }`}
              required
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm">{errors.deadline}</p>
            )}
          </div>

          <div>
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.employmentType ? "border-2 border-red-500" : ""
              }`}
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="paid_internship">Paid Internship</option>
              <option value="unpaid_internship">Unpaid Internship</option>
            </select>
            {errors.employmentType && (
              <p className="text-red-500 text-sm">{errors.employmentType}</p>
            )}
          </div>

          <div>
            <input
              name="salary"
              placeholder="Salary Offer"
              value={form.salary}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.salary ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm">{errors.salary}</p>
            )}
          </div>

          <div>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.location ? "border-2 border-red-500" : ""
              }`}
            >
              <option value="">Select Job Location</option>
              {companyCity && companyGov && (
                <option value={`Office (${companyCity}, ${companyGov})`}>
                  Office ({companyCity}, {companyGov})
                </option>
              )}
              <option value="Remote">Remote</option>
            </select>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          <div>
            <input
              name="skills"
              placeholder="Job Skills Needed"
              value={form.skills}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.skills ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills}</p>
            )}
          </div>

          <div>
            <input
              name="period"
              placeholder="Employment Period (for internships/part-time)"
              value={form.period}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                errors.period ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.period && (
              <p className="text-red-500 text-sm">{errors.period}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJobs;
