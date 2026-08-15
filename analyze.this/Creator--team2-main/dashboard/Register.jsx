import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "Creator",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      alert("Accept Terms & Conditions");
      return;
    }

    localStorage.setItem(
      "creatorUser",
      JSON.stringify(formData)
    );

    alert("Registration Successful");
    navigate("/login");
  };

return (
  <div className="min-h-screen bg-[#F3F6FF] flex items-center justify-center p-5">

    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden grid md:grid-cols-2">

      {/* Left Blue Section */}
      <div className="bg-blue-800 text-white p-10 flex flex-col justify-center">

        <h1 className="text-4xl font-bold mb-5">
          Creator Dashboard
        </h1>

        <p>
          Register to access analytics, audience insights,
          reports and revenue dashboard.
        </p>

      </div>

      {/* Right Registration Form */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-8">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full border rounded-xl p-3"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full border rounded-xl p-3"
            onChange={handleChange}
          />

          <input
            name="organization"
            placeholder="Organization"
            className="w-full border rounded-xl p-3"
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full border rounded-xl p-3"
            onChange={handleChange}
          >
            <option>Creator</option>
            <option>Agency</option>
            <option>Marketing Team</option>
            <option>Administrator</option>
          </select>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border rounded-xl p-3"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>

          </div>

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border rounded-xl p-3"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-3"
            >
              {showConfirmPassword ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
            </button>

          </div>

          <label className="flex gap-2">

            <input
              type="checkbox"
              name="agree"
              onChange={handleChange}
            />

            I agree to the Terms & Conditions

          </label>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-3"
          >
            Register
          </button>

        </form>

      </div>

    </div>

  </div>
);
};
export default Register;
