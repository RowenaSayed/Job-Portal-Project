import React, { useState } from "react";

export default function Try() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "الاسم الأول مطلوب";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "الاسم الأخير مطلوب";
    }
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور لازم تكون 8 أحرف على الأقل";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerErrors(null);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerErrors(data);
      } else {
        setServerErrors(null);
        alert("تم التسجيل بنجاح!");
        setFormData({ first_name: "", last_name: "", email: "", password: "" });
      }
    } catch (error) {
      setServerErrors({ general: "حدث خطأ في الاتصال بالسيرفر" });
    }
  };

  return (
    <div className="flex justify-center bg-gray-500 h-[100vh] items-center">
      <div className="text-xl text-gray-900 bg-slate-400 p-10 w-1/2 ">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="first-name"
            name="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="h-10 rounded focus:outline-none text-gray-800 text-lg m-4 w-1/2"
          />
          {errors.first_name && (
            <p className="text-red-600 text-sm">{errors.first_name}</p>
          )}

          <input
            type="text"
            placeholder="last-name"
            name="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="h-10 rounded focus:outline-none text-gray-800 text-lg m-4 w-1/2"
          />
          {errors.last_name && (
            <p className="text-red-600 text-sm">{errors.last_name}</p>
          )}

          <input
            type="email"
            placeholder="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="h-10 rounded focus:outline-none text-gray-800 text-lg m-4 w-1/2"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="h-10 rounded focus:outline-none text-gray-800 text-lg m-4 w-1/2"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded m-4 w-1/2"
          >
            Submit
          </button>
          <form onSubmit={handleSubmit}>
            {/* ... الحقول هنا ... */}

            {serverErrors && (
              <div className="text-red-600 text-sm mb-4 ">
                {typeof serverErrors === "string" ? (
                  <p>{serverErrors}</p>
                ) : (
                  Object.entries(serverErrors).map(([field, message]) => (
                    <p key={field}>{message}</p>
                  ))
                )}
              </div>
            )}
          </form>
        </form>
      </div>
    </div>
  );
}
