// ResetPasswordRequest.jsx
import React, { useState } from "react";

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/password/reset-request/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          //  Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
          required
        />
        <button
          type="submit"
          className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </form>
    </div>
  );
}
