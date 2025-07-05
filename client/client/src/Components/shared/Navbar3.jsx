import {
  BarChart2,
  HomeIcon,
  Menu,
  Settings2Icon,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { name: "HomePage", icon: HomeIcon, color: "#3B82F6", href: "/" },
  {
    name: "Browse Jobs",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/Jobs-js",
  },
  {
    name: "Settings",
    icon: Settings2Icon,
    color: "#10B981",
    href: "/settings",
  },
];

const Navbar3 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const logOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      className="bg-white border-b border-gray-200 w-full z-40  top-0 left-0 sticky shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-800">
              YallaNe4ta8all
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;

              if (item.name === "Settings") {
                return (
                  <div key={item.href} className="relative">
                    <motion.div
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={`flex items-center cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon
                        size={20}
                        style={{ color: item.color }}
                        className="mr-2"
                      />
                      <span className="text-gray-800">{item.name}</span>
                      <motion.span
                        className="ml-2 text-gray-600"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: showDropdown ? 180 : 0 }}
                      >
                        ▼
                      </motion.span>
                    </motion.div>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 text-sm text-gray-700 z-50"
                        >
                          <button
                            onClick={() => navigate("/jobseeker/profile")}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Profile Center
                          </button>
                          <button
                            onClick={() => navigate("/resetpass")}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Reset password
                          </button>
                          <button
                            onClick={logOut}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link key={item.href} to={item.href}>
                  <motion.div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon
                      size={20}
                      style={{ color: item.color }}
                      className="mr-2"
                    />
                    <span className="text-gray-800">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} className="text-gray-800" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-gray-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.href;

                  if (item.name === "Settings") {
                    return (
                      <div key={item.href}>
                        <motion.div
                          onClick={() => setShowDropdown(!showDropdown)}
                          className={`flex items-center justify-between cursor-pointer px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive ? "bg-gray-100" : "hover:bg-gray-100"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center">
                            <item.icon
                              size={20}
                              style={{ color: item.color }}
                              className="mr-2"
                            />
                            <span className="text-gray-800">{item.name}</span>
                          </div>
                          <motion.span
                            className="text-gray-600"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: showDropdown ? 180 : 0 }}
                          >
                            ▼
                          </motion.span>
                        </motion.div>

                        <AnimatePresence>
                          {showDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="ml-8 px-3 py-2 text-sm text-gray-700 space-y-2"
                            >
                              <button
                                onClick={() => navigate("/Profile")}
                                className="block w-full text-left hover:text-black"
                              >
                                Profile Center
                              </button>
                              <button
                                onClick={logOut}
                                className="block w-full text-left hover:text-black"
                              >
                                Logout
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link key={item.href} to={item.href}>
                      <motion.div
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive ? "bg-gray-100" : "hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon
                          size={20}
                          style={{ color: item.color }}
                          className="mr-2"
                        />
                        <span className="text-gray-800">{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar3;
