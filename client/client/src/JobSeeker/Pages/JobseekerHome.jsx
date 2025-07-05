import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGithub, FaWhatsapp } from "react-icons/fa";
import Navbar2 from "../../Components/shared/Navbar_js";
import Navbar3 from "../../Components/shared/Navbar3";

// Background images
const backgroundImages = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/bg3.jpg"
];

function JobseekerNavbar() {
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage);
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
      setFade(true);
      setTimeout(() => setFade(false), 1000); // match with CSS transition
    }, 6000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
        style={{
          backgroundImage: `url(${backgroundImages[prevImage]})`,
          opacity: fade ? 0 : 1,
        }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
        style={{
          backgroundImage: `url(${backgroundImages[currentImage]})`,
          opacity: fade ? 1 : 0,
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-sm bg-white/60">
        {/* Navigation */}
        {!localStorage.getItem("token") && (
          <nav className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              YallNe4ta8all
            </div>
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
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/empreg")}
                className="px-4 py-2 text-gray-600 border border-gray-600 rounded hover:bg-blue-50"
              >
                Post Job
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-gray-600 hover:text-gray-600"
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
          </nav>
        )}
        {localStorage.getItem("token") && <Navbar3 />}
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Find Your Dream Job in Egypt
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Searching for vacancies & career opportunities? We help you in
              your job search in Egypt.
            </p>
            <div className="w-1/2 mx-auto flex justify-center">
              <button
                onClick={() => navigate("/Jobs-js")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2025 YallNe4ta8all. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-2xl hover:scale-110 transition-transform"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://github.com/yourgithub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 text-2xl hover:scale-110 transition-transform"
              >
                <FaGithub />
              </a>
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-2xl hover:scale-110 transition-transform"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default JobseekerNavbar;
