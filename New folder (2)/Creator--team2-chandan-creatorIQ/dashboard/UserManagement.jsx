import React from "react";

const users = [
  {
    name: "Sabarmathi",
    role: "Creator",
    status: "Active",
  },
  {
    name: "Rahul",
    role: "Agency",
    status: "Active",
  },
  {
    name: "Priya",
    role: "Marketing Team",
    status: "Inactive",
  },
];

function UserManagement() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <table className="w-full bg-white rounded-xl shadow">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user, index) => (
            <tr key={index} className="border-t">

              <td className="p-4">{user.name}</td>

              <td className="p-4">{user.role}</td>

              <td className="p-4">{user.status}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UserManagement;