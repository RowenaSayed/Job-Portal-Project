import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../Components/Jobs/Job";
import Header from "../../Components/shared/Header";

export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        setCompanyGov(profileData.country);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load company location");
      }
    };

    fetchCompanyLocation();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/jobs", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = (job.position + job.location + job.job_skills)
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSpecialization = selectedSpecialization
      ? job.job_skills
          .toLowerCase()
          .includes(selectedSpecialization.toLowerCase())
      : true;

    const matchesLocation = selectedLocation
      ? job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      : true;

    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  return (
    <>
      <Header title={"My Jobs"} />
      <div className="flex z-0 bg-[#121212] text-white">
        {/* Sidebar Filters */}
        <div className="w-64 bg-[#1f1f1f] p-6 h-[85vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          {/* Specialization Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Specialization</h3>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-[#121212] text-white border border-gray-600 p-2 rounded"
            >
              <option value="">All</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Python">Python</option>
              <option value="Django">Django</option>
              <option value="React">React</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Location</h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#121212] text-white border border-gray-600 p-2 rounded"
            >
              <option value="">All</option>
              <option value="Remote">Remote</option>
              <option value="Office">Office-{companyGov}</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 mt-5 px-7">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1f1f1f] text-white px-4 py-2 rounded-full w-1/2 outline-none border border-gray-600"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300"
              title="Post New Job"
              onClick={() => navigate("/PostJob")}
            >
              ADD New Job +
            </button>
          </div>

          <div
            className="jobGrid container p-7 overflow-y-auto"
            style={{ height: "80vh" }}
          >
            {loading && <p>Loading jobs...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading &&
              !error &&
              (filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCard key={index} job={job} fetchJobs={fetchJobs} />
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center">
                  No jobs match your filters.
                </p>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
