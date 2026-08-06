import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Building2, Shield } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("creatorUser"));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    localStorage.setItem("creatorUser", JSON.stringify(user));
    alert("Profile Updated Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-10">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <div className="flex justify-center mb-8">

          <img
            src="https://ui-avatars.com/api/?name=Creator"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-600"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">Full Name</label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 p-3"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-400" />

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 p-3"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Phone</label>

            <div className="relative mt-2">
              <Phone className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 p-3"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Organization</label>

            <div className="relative mt-2">
              <Building2 className="absolute left-3 top-3 text-gray-400" />

              <input
                type="text"
                name="organization"
                value={user.organization}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 p-3"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold">Role</label>

            <div className="relative mt-2">
              <Shield className="absolute left-3 top-3 text-gray-400" />

              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full border rounded-xl pl-10 p-3"
              >
                <option>Creator</option>
                <option>Agency</option>
                <option>Marketing Team</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>

        </div>

        <button
          onClick={saveProfile}
          className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-xl"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
};

export default Profile;