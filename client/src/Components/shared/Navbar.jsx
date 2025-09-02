import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Check authentication status when component mounts and whenever it updates
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("role");

      setIsAuthenticated(!!token); // Convert to boolean
      setUserRole(role || "");
    };

    checkAuth();

    // Create an event listener for localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    // Update state to trigger re-render
    setIsAuthenticated(false);
    setUserRole("");

    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/80 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm shadow-md">
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        <Link to="/">YallNe4ta8all</Link>
      </div>

      {!isAuthenticated ? (
        // Guest Navbar
        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            Main Page
          </Link>
          <Link
            to="/empreg"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Register
          </Link>
          <button
            onClick={() => navigate("/empreg")}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-600 dark:border-gray-300 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            Post Job
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/Jobs-js")}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Get Started
          </button>
        </div>
      ) : (
        // Logged-in Navbar
        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Home
          </Link>
          <Link
            to="/Jobs"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Browse Jobs
          </Link>
          {userRole === "employer" && (
            <button
              onClick={() => navigate("/post-job")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Post Job
            </button>
          )}
          <button
            onClick={() =>
              navigate(
                userRole === "employer"
                  ? "/employer/profile"
                  : "/jobseeker/profile"
              )
            }
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-red-500 rounded hover:bg-red-50 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
