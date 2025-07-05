import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Phone,
  MapPin,
  UserCircle,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    company_name: "",
    business_phone: "",
    city: "",
    country: "",
    vision: "",
    img: null,
  });
  const egyptGovernorates = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Qalyubia",
    "Port Said",
    "Suez",
    "Dakahlia",
    "Sharqia",
    "Gharbia",
    "Monufia",
    "Beheira",
    "Kafr El Sheikh",
    "Fayoum",
    "Beni Suef",
    "Minya",
    "Asyut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai",
    "Damietta",
    "Ismailia",
  ];

  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/emp_profile", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          company_name: res.data.company_name || "",
          business_phone: res.data.business_phone || "",
          city: res.data.city || "",
          country: res.data.country || "",
          vision: res.data.vision || "",
          img: null,
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, img: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Confirmation dialog
    const shouldSave = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!shouldSave) {
      alert("Changes were not saved.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) payload.append(key, formData[key]);
    });

    axios
      .put("http://127.0.0.1:8000/api/edit/profile", payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Profile saved successfully!"); // Success alert
        window.location.replace("/profile"); // Redirect to profile page
      })
      .catch(() => {
        alert("Save failed. Please try again."); // Error alert
      });
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md space-y-5 w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold">Update Profile</h2>

        <div>
          <label className="flex items-center gap-2 mb-1 text-gray-300">
            <Building2 size={18} /> Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 mb-1 text-gray-300">
            <Phone size={18} /> Business Phone
          </label>
          <input
            type="text"
            name="business_phone"
            value={formData.business_phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="flex items-center gap-2 mb-1 text-gray-300">
              <MapPin size={18} /> City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            />
          </div>
          <div className="w-1/2">
            <label className="flex items-center gap-2 mb-1 text-gray-300">
              <MapPin size={18} /> Governorate
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="">Select Governorate</option>
              {egyptGovernorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-1 text-gray-300">
            <UserCircle size={18} /> Profile Image
          </label>
          <input
            type="file"
            name="img"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 rounded bg-white text-black"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-24 w-24 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 mb-1 text-gray-300">
            <Eye size={18} /> Vision
          </label>
          <textarea
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded text-white font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
