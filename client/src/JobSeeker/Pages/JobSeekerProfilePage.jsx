import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar2 from "../../Components/shared/Navbar_js";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, Mail, Phone, MapPin, FileText, BookOpen, Save, 
  PlusCircle, X, Briefcase, ChevronDown, ChevronUp, Clock, 
  Calendar, CheckCircle, XCircle, AlertCircle 
} from "lucide-react";

// Default guest avatar using a Data URI for a simple silhouette (no external file needed)
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='20' fill='%23778899'/%3E%3Cpath d='M25,90 Q25,60 50,60 Q75,60 75,90' fill='%23778899'/%3E%3C/svg%3E";

const JobSeekerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    job_title: "",
    city: "",
    country: "",
    education: []
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      });

      // Log the response to see the photo URL structure
      console.log("Profile data:", res.data);
      
      setProfile(res.data);
      // Initialize form data with current profile values
      setFormData({
        first_name: res.data.user?.first_name || "",
        last_name: res.data.user?.last_name || "",
        email: res.data.user?.email || "",
        phone_number: res.data.phone_number || "",
        job_title: res.data.job_title || "",
        city: res.data.city || "",
        country: res.data.country || "",
        education: res.data.education || []
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!showApplications) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    setLoadingApplications(true);
    setApplicationError(null);

    try {
      // Using the correct endpoint from your Django URL patterns
      const res = await axios.get("http://127.0.0.1:8000/api/my-applications/", {
        headers: { Authorization: `Token ${token}` },
      });

      console.log("Applications data:", res.data);
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApplicationError("Failed to load your job applications.");
    } finally {
      setLoadingApplications(false);
    }
  };

  // Helper function to get the appropriate profile image
  const getProfileImage = () => {
    if (photoPreview) {
      return photoPreview; // Show preview when a new photo is selected
    } else if (profile?.photo) {
      // Check if photo URL is already absolute or needs the backend base URL
      if (profile.photo.startsWith('http')) {
        return profile.photo; // Already a complete URL
      } else {
        // Add backend base URL if it's a relative path
        return `http://127.0.0.1:8000${profile.photo}`;
      }
    } else {
      return DEFAULT_AVATAR; // Show default guest avatar
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    
    // Create preview for the selected photo
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleResumeChange = (e) => setResumeFile(e.target.files[0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { university: "", degree: "", field_of_study: "", graduation_year: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      alert("Please select a photo to upload");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const token = localStorage.getItem("token");
      // Use the existing endpoint structure
      const res = await axios.put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Photo upload response:", res.data);
      
      // Update profile with the response data
      setProfile({...profile, photo: res.data.photo});
      setPhotoFile(null);
      setPhotoPreview(null);
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Photo upload failed:", err);
      alert("Failed to upload profile photo. Please check your connection and try again.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Create profile data object
      const profileData = { ...formData };
      
      // If there's a resume file, we need to use FormData instead of JSON
      if (resumeFile) {
        const formDataObj = new FormData();
        // Add all profile fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'education') {
            formDataObj.append('education', JSON.stringify(formData.education));
          } else {
            formDataObj.append(key, formData[key]);
          }
        });
        formDataObj.append("resume", resumeFile);
        
        const token = localStorage.getItem("token");
        const res = await axios.put("http://127.0.0.1:8000/api/profile/", formDataObj, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        
        setProfile(res.data);
        setResumeFile(null);
      } else {
        // No file, just update regular profile data as JSON
        const token = localStorage.getItem("token");
        const res = await axios.put("http://127.0.0.1:8000/api/profile/", profileData, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        
        setProfile(res.data);
      }
      
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile. Please check your connection and try again.");
    }
  };

  const toggleApplicationsView = () => {
    const newState = !showApplications;
    setShowApplications(newState);
    if (newState && applications.length === 0) {
      fetchApplications();
    }
  };

  // Function to render status badge with appropriate color
  const getStatusBadge = (status) => {
    let color = "";
    let icon = null;
    
    switch (status) {
      case "pending":
        color = "bg-yellow-500";
        icon = <Clock className="w-4 h-4" />;
        break;
      case "accepted":
        color = "bg-green-500";
        icon = <CheckCircle className="w-4 h-4" />;
        break;
      case "rejected":
        color = "bg-red-500";
        icon = <XCircle className="w-4 h-4" />;
        break;
      case "interview":
        color = "bg-blue-500";
        icon = <Calendar className="w-4 h-4" />;
        break;
      default:
        color = "bg-gray-500";
        icon = <AlertCircle className="w-4 h-4" />;
    }
    
    return (
      <span className={`flex items-center gap-1 ${color} text-white px-2 py-1 rounded-full text-xs`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (showApplications) {
      fetchApplications();
    }
  }, [showApplications]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar2 />
        <div className="p-6">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="p-6 text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar2 />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-gray-400" />
            {profile?.user?.username || "Job Seeker"}'s Profile
          </h1>
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Photo & Uploads */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="w-40 h-40 object-cover rounded-full border border-gray-700"
                  onError={(e) => {
                    // Log the error for debugging
                    console.error("Image failed to load:", e.target.src);
                    // Fallback if the image fails to load
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                {!profile?.photo && !photoPreview && (
                  <div className="absolute bottom-0 right-0 bg-gray-900 text-xs p-1 rounded">
                    Guest Photo
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-400">
                  Upload a professional profile picture to make your profile
                  stand out to employers.
                </p>
                <div className="bg-gray-700 p-3 rounded">
                  <label className="block mb-2 text-sm text-gray-300">
                    Select Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="text-sm text-gray-300 w-full"
                  />
                  {photoFile && (
                    <Button
                      onClick={handleUploadPhoto}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Upload Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              {editMode ? (
                <>
                  <EditField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                  <EditField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />

                  <EditField
                    label="Phone"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                  <EditField
                    label="Job Title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                  />
                  <EditField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <EditField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />

                  {/* Resume upload in edit mode */}
                  <div className="mt-4 bg-gray-700 p-3 rounded">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Resume / CV
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      Upload your latest resume (PDF, DOC, or DOCX format)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="text-sm text-gray-300"
                    />
                    {resumeFile && (
                      <p className="text-xs text-green-400 mt-1">
                        New resume selected: {resumeFile.name} (will be saved
                        with your profile)
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <ProfileField
                    icon={<UserCircle />}
                    label="Name"
                    value={`${profile?.user?.first_name || "Not provided"} ${
                      profile?.user?.last_name || ""
                    }`}
                  />
                  <ProfileField
                    icon={<Mail />}
                    label="Email"
                    value={profile?.user?.email || "Not provided"}
                  />
                  <ProfileField
                    icon={<Phone />}
                    label="Phone"
                    value={profile?.phone_number || "Not provided"}
                  />
                  <ProfileField
                    icon={<FileText />}
                    label="Job Title"
                    value={profile?.job_title || "Not provided"}
                  />
                  <ProfileField
                    icon={<MapPin />}
                    label="Location"
                    value={`${profile?.city || "Not provided"}${
                      profile?.city && profile?.country ? ", " : ""
                    }${profile?.country || ""}`}
                  />

                  {profile?.resume && (
                    <div className="flex items-center gap-3 bg-gray-700 px-4 py-2 rounded text-white">
                      <FileText />
                      <span className="font-semibold w-32">Resume:</span>
                      <a
                        href={`http://localhost:8000${profile.resume}`}
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Education Section */}
          {/* <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-gray-400" />
                Education
              </h2>
              {editMode && (
                <Button
                  onClick={addEducation}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Education
                </Button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded relative">
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <EditField
                        label="University"
                        value={edu.university}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "university",
                            e.target.value
                          )
                        }
                      />
                      <EditField
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(index, "degree", e.target.value)
                        }
                      />
                      <EditField
                        label="Field of Study"
                        value={edu.field_of_study}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "field_of_study",
                            e.target.value
                          )
                        }
                      />
                      <EditField
                        label="Graduation Year"
                        value={edu.graduation_year}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "graduation_year",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                {formData.education.length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No education added yet. Click "Add Education" to begin.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {profile?.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded">
                      <h3 className="font-semibold text-lg">
                        {edu.university}
                      </h3>
                      <p>
                        {edu.degree}
                        {edu.field_of_study ? ` in ${edu.field_of_study}` : ""}
                      </p>
                      <p className="text-gray-400">{edu.graduation_year}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No education information provided
                  </div>
                )}                                                           
              </div>
            )}
          </div> */}
          {/* Job Applications Section - Only visible when not in edit mode */}
          {!editMode && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                  Job Applications
                </h2>
                <Button
                  onClick={toggleApplicationsView}
                  className="flex items-center gap-1"
                >
                  {showApplications ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Applications
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Applications
                    </>
                  )}
                </Button>
              </div>

              {showApplications && (
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  {loadingApplications ? (
                    <div className="text-center py-6">
                      Loading your applications...
                    </div>
                  ) : applicationError ? (
                    <div className="text-center py-6 text-red-400">
                      {applicationError}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        You haven't applied to any jobs yet.
                      </p>
                      <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => (window.location.href = "/jobs-js")}
                      >
                        Browse Available Jobs
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-800">
                            <th className="py-3 px-4 text-left">Position</th>
                            <th className="py-3 px-4 text-left">Company</th>
                            <th className="py-3 px-4 text-left">Location</th>
                            <th className="py-3 px-4 text-left">
                              Employment Type
                            </th>
                            <th className="py-3 px-4 text-left">
                              Applied Date
                            </th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => (
                            <tr
                              key={app.id}
                              className="border-t border-gray-600 hover:bg-gray-800"
                            >
                              <td className="py-3 px-4">{app.job.position}</td>
                              <td className="py-3 px-4">{app.job.company}</td>
                              <td className="py-3 px-4">{app.job.location}</td>
                              <td className="py-3 px-4">
                                {app.job.Emp_type &&
                                  app.job.Emp_type.split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(app.applied_at)}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(app.status)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex gap-2 justify-center">
                                  {app.resume_url && (
                                    <a
                                      href={`http://localhost:8000${app.resume_url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:underline text-sm"
                                    >
                                      View Resume
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Save button when in edit mode */}
          {editMode && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveProfile}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-700 px-4 py-2 rounded text-white">
    {icon}
    <span className="font-semibold w-32">{label}:</span>
    <span>{value}</span>
  </div>
);

const EditField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default JobSeekerProfilePage;