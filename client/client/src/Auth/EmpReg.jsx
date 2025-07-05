import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployerRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  // ============================
  const navigate = useNavigate();
  const handleGoToLogin = () => {
    setSuccessMessage("Redirecting to Account page...");
    setTimeout(() => {
      navigate("/Profile");
    }, 1500);
  };
//  =============================
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/Employer";

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    // check for empty fields
    for (let key in formData) {
      if (!formData[key]) {
        setErrors({
          general: `Please fill in the ${key.replace("_", " ")} field`,
        });
        setIsSubmitting(false);
        return;
      }
    }

    // password format check
    if (!validatePassword(formData.password)) {
      setErrors({
        password:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
        });
       localStorage.setItem("token", response.data.token);
       handleGoToLogin();
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 400) {
          if (data.details && typeof data.details === "object") {
            const fieldErrors = {};
            for (const key in data.details) {
              fieldErrors[key] = data.details[key][0];
            }
            setErrors({
              ...fieldErrors,
              general: "Please fix the highlighted fields",
            });
          } else if (data.error) {
            setErrors({ general: data.error });
          } else {
            setErrors({ general: "Unknown error. Please try again" });
          }
        } else {
          setErrors({
            general: `Unexpected server response (${status}). Please try again later`,
          });
        }
      } else {
        setErrors({
          general: "Unable to connect. Please check your internet connection",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center p-4 mb-2 border-b border-gray-200">
        <div className="text-2xl font-bold text-blue-600">YallNe4ta8all</div>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Main Page
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            login
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Employer Registration
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600 mt-2">
          Do you want a Jobseeker account?{" "}
          <Link
            to="/jsreg"
            className="text-blue-600 hover:underline font-medium"
          >
            Go here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmployerRegistration;
