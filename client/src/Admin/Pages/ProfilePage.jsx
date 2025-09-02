import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Settings,
  UserCircle,
  Building2,
  Mail,
  Phone,
  FileText,
  Menu,
  MapPin,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/emp_profile",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            No Profile Found
          </h2>
          <p className="text-gray-300">
            Please create a profile to view your information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex">
      {/* Sidebar */}
      <div
        className={`w-1/4 border-r border-gray-700 pr-6 transition-transform duration-600 ${
          isSidebarOpen ? "w-1/4" : "w-16"
        }`}
      >
        <div className="flex items-center mb-8">
          <button
            className="p-2 rounded-full hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          {isSidebarOpen && (
            <>
              {/* 
              <img
                  src={`http://127.0.0.1:8000${profile.img}`}
                  alt="Current Profile"
                  className="mt-2 h-24 w-24 rounded object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/48/48";
                    e.target.alt = "Image load error";
                  }}
              */}
              {profile.img ? (
                <img
                  src={`http://127.0.0.1:8000${profile.img}`}
                  alt="img"
                  className="w-12 h-12 mr-3 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-12 h-12 mr-3 text-gray-400" />
              )}
              <div className="text-xl font-bold">
                {profile.company_name || "Profile"}
              </div>
            </>
          )}
        </div>
        {isSidebarOpen && (
          <div className="flex flex-col gap-2">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              Account
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => navigate("/resetpass")}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>

      {/* Main Info Display */}
      <div className="w-3/4 pl-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Account Overview</h2>
          <button
            className="bg-white hover:bg-gray-200 text-gray-900 p-2 rounded-full shadow transition"
            title="Edit Profile"
            onClick={() => navigate("/ProfileSettings")}
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
          <InfoItem
            icon={<UserCircle className="w-5 h-5 text-gray-400" />}
            label="User"
            value={`${profile.user?.first_name || ""} ${
              profile.user?.last_name || ""
            }`}
          />
          <InfoItem
            icon={<UserCircle className="w-5 h-5 text-gray-400" />}
            label="Username"
            value={`${profile.user?.username || ""}`}
          />

          <InfoItem
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            label="Email"
            value={profile.user?.email}
          />
          <InfoItem
            icon={<Building2 className="w-5 h-5 text-gray-400" />}
            label="Company Name"
            value={profile.company_name || "Not specified"}
          />
          <InfoItem
            icon={<Phone className="w-5 h-5 text-gray-400" />}
            label="Business Phone"
            value={profile.business_phone || "Not specified"}
          />
          <InfoItem
            icon={<MapPin className="w-5 h-5 text-gray-400" />}
            label="Location"
            value={`${profile.city || ""}${
              profile.city && profile.country ? ", " : ""
            }${profile.country || ""}`}
          />
          <InfoItem
            icon={<Eye className="w-5 h-5 text-gray-400" />}
            label="User Type"
            value={profile.user_type || "Not specified"}
          />
          <InfoItem
            icon={<FileText className="w-5 h-5 mt-1 text-gray-400" />}
            label="Vision"
            value={profile.vision || "No vision statement provided"}
            multiline
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, multiline }) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className={`text-lg ${multiline ? "leading-relaxed" : ""}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
