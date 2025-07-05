import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function JobApplicationModal({ job, open, onClose, token }) {
  const [portfolioLink, setPortfolioLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!portfolioLink.trim() || !coverLetter.trim()) {
      setError("Both fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/Jobs/${job.id}/apply/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Portfolio_link: portfolioLink,
            cover_letter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply");
      }

      setSuccess("Application submitted successfully!");
      setPortfolioLink("");
      setCoverLetter("");
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      if (err.message.includes("Authentication")) {
        localStorage.removeItem("authToken");
        navigate("/login", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative"
          initial={{ scale: 0.95, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 50 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            disabled={isLoading}
          >
            <X />
          </button>

          <h2 className="text-2xl font-semibold mb-4">
            Apply to {job.position}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Portfolio Link
              </label>
              <input
                type="url"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                required
                disabled={isLoading || !!success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cover Letter
              </label>
              <textarea
                rows={5}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                disabled={isLoading || !!success}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !!success}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
