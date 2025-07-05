import {
  BarChart2,
  Menu,
  Settings2Icon,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/overview" },
  { name: "My Jobs", icon: ShoppingBag, color: "#8B5CF6", href: "/Jobs" },
  { name: "Applicants", icon: Users, color: "#EC4899", href: "/Applicants" },
  {
    name: "Settings",
    icon: Settings2Icon,
    color: "#6EE7B7",
    href: "/settings",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ حماية بسيطة لو مفيش توكن
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // ✅ دالة تسجيل الخروج
  const logOut = () => {
    const confirmLogout = window.confirm("Do shure to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <motion.div
      className={`bg-gray-800 border-gray-700 top-0 left-0 z-40 min-h-screen transition-transform -translate-x-full sm:translate-x-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 backdrop-blur-md p-4 text-gray-50 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;

            if (item.name === "Settings") {
              return (
                <div key={item.href}>
                  <motion.div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center justify-between cursor-pointer p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        size={20}
                        style={{ color: item.color, minWidth: "20px" }}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="ml-4 whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {isSidebarOpen && (
                      <motion.span
                        className="text-white"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: showDropdown ? 90 : 0 }}
                      >
                        ▸
                      </motion.span>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {showDropdown && isSidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="ml-8 text-sm text-gray-300 space-y-2"
                      >
                        <button
                          onClick={() => navigate("/Profile")}
                          className="block hover:text-white"
                        >
                          Profile Center
                        </button>
                        <button
                          onClick={logOut}
                          className="block hover:text-white"
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
                  className={`flex items-center p-4 text-sm text-gray-50 font-medium rounded-lg transition-colors mb-2 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
