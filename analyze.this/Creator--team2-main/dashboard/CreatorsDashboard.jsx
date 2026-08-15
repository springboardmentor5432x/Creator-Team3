import React from "react";

const creators = [
  { name: "Sabarmathi", platform: "YouTube", followers: "120K", status: "Active" },
  { name: "Rahul", platform: "Instagram", followers: "90K", status: "Active" },
  { name: "Priya", platform: "Facebook", followers: "60K", status: "Inactive" },
];

const CreatorsDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Creators Management</h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Creator</th>
            <th className="p-4 text-left">Platform</th>
            <th className="p-4 text-left">Followers</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {creators.map((creator, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{creator.name}</td>
              <td className="p-4">{creator.platform}</td>
              <td className="p-4">{creator.followers}</td>
              <td className="p-4">{creator.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreatorsDashboard;