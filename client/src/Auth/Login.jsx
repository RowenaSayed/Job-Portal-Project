import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/login/";

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await axios.post(API_URL, formData);
      if (response.status === 200) {
        const { token, user_type } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user_type", user_type);
        setSuccessMessage("Login successful");

        setFormData({
          identifier: "",
          password: "",
        });

        if (user_type === "employer") {
          window.location.replace("/overview");
        } else {
          window.location.replace("/jobseeker/profile");
        }
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;
        if (status === 400 || status === 401) {
          if (data.error) {
            setErrors({ general: data.error });
          } else if (data.non_field_errors) {
            setErrors({ general: data.non_field_errors[0] });
          } else {
            setErrors(data);
          }
        } else {
          setErrors({ general: "An unexpected error occurred" });
        }
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center p-4 border-b border-gray-200">
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
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Log In to Your Account
          </h2>

          {errors.general && (
            <p className="text-red-600 text-sm mb-4 text-center">
              {errors.general}
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm mb-4 text-center">
              {successMessage}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your email or username"
              />
              {errors.identifier && (
                <p className="text-red-600 text-sm">{errors.identifier}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
              <div className="flex justify-end mt-1">
                <Link
                  to="/resetpass"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/empreg"
                className="text-blue-600 font-medium hover:underline"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
