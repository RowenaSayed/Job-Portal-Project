import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialJob = {
  positionName: "",
  positionInfo: "",
  education: "",
  experience: "",
  deadline: "",
  employmentType: "full_time",
  salary: "",
  location: "",
  skills: "",
  period: "",
};

function PostJobs() {
  const [form, setForm] = useState(initialJob);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [companyCity, setCompanyCity] = useState("");
  const [companyGov, setCompanyGov] = useState("");
  const [companyName, setCompanyName] = useState("");
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
        setCompanyName(profileData.company_name);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrors({ nonFieldError: "Failed to load company location" });
      }
    };

    fetchCompanyLocation();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName) {
      setErrors({ nonFieldError: "Company name not found. Please complete your profile before posting a job." });
      return;
    }  
    setIsSubmitting(true);
    setErrors({});
    
    const dataToSend = {
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
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        navigate("/Jobs", {
          state: { successMessage: "Job posted successfully" },
        });
        return;
      }

      if (response.status === 400) {
        if (responseData.errors) {
          setErrors({ ...responseData.errors });
        } else if (responseData.details) {
          setErrors({ nonFieldError: responseData.details });
        } else {
          const formattedErrors = {};
          Object.keys(responseData).forEach((key) => {
            formattedErrors[key] = responseData[key].join(" ");
          });
          setErrors(formattedErrors);
        }
        return;
      }

      if (response.status === 401) {
        setErrors({ nonFieldError: "Unauthorized. Please login" });
        return;
      }

      if (response.status === 403) {
        setErrors({ nonFieldError: "You don't have permission to post" });
        return;
      }

      if (response.status === 500) {
        setErrors({ nonFieldError: "Server error. Try again later" });
        return;
      }

      setErrors({ nonFieldError: `Unexpected error (${response.status})` });
    } catch (error) {
      setErrors({ nonFieldError: "Network error. Please try again" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (fieldName) => {
    const fieldMap = {
      positionName: "position",
      positionInfo: "description",
      education: "edu_qualifications",
      experience: "Work_experince",
      deadline: "Deadline_of_application",
      employmentType: "Emp_type",
      salary: "salaryoffer",
      location: "location",
      skills: "job_skills",
      period: "period",
    };
    const backendField = fieldMap[fieldName];
    return errors[backendField] || errors[fieldName];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6"
        style={{ height: "90vh", overflowY: "auto" }}
      >
        <h2 className="text-2xl font-bold text-center">Post a Job</h2>

        {errors.nonFieldError && (
          <div className="p-3 bg-red-500/20 text-red-300 rounded-lg">
            {errors.nonFieldError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="positionName"
              placeholder="Name of the Position"
              value={form.positionName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("positionName") ? "border border-red-500" : ""
              }`}
            />
            {getError("positionName") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("positionName")}
              </p>
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
                getError("positionInfo") ? "border border-red-500" : ""
              }`}
            />
            {getError("positionInfo") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("positionInfo")}
              </p>
            )}
          </div>

          <div>
            <input
              name="education"
              placeholder="Education Qualifications"
              value={form.education}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("education") ? "border border-red-500" : ""
              }`}
            />
            {getError("education") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("education")}
              </p>
            )}
          </div>

          <div>
            <input
              name="experience"
              placeholder="Work Experience Needed"
              value={form.experience}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("experience") ? "border border-red-500" : ""
              }`}
            />
            {getError("experience") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("experience")}
              </p>
            )}
          </div>

          <div>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("deadline") ? "border border-red-500" : ""
              }`}
            />
            {getError("deadline") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("deadline")}
              </p>
            )}
          </div>

          <div>
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("employmentType") ? "border border-red-500" : ""
              }`}
            >
              <option>full_time</option>
              <option>part_time</option>
              <option>paid_internship</option>
              <option>unpaid_internship</option>
            </select>
            {getError("employmentType") && (
              <p className="text-red-400 text-sm mt-1">
                {getError("employmentType")}
              </p>
            )}
          </div>

          <div>
            <input
              name="salary"
              placeholder="Salary Offer"
              value={form.salary}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("salary") ? "border border-red-500" : ""
              }`}
            />
            {getError("salary") && (
              <p className="text-red-400 text-sm mt-1">{getError("salary")}</p>
            )}
          </div>

          <div>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("location") ? "border border-red-500" : ""
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
          </div>

          <div>
            <input
              name="skills"
              placeholder="Job Skills Needed"
              value={form.skills}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("skills") ? "border border-red-500" : ""
              }`}
            />
            {getError("skills") && (
              <p className="text-red-400 text-sm mt-1">{getError("skills")}</p>
            )}
          </div>

          <div>
            <input
              name="period"
              placeholder="Employment Period"
              value={form.period}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 rounded-lg ${
                getError("period") ? "border border-red-500" : ""
              }`}
            />
            {getError("period") && (
              <p className="text-red-400 text-sm mt-1">{getError("period")}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJobs;
