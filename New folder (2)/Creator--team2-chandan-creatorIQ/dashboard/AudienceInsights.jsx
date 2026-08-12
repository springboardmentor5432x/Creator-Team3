import React from "react";

const audience = [
  {
    group: "18-24",
    users: "45%",
  },
  {
    group: "25-34",
    users: "32%",
  },
  {
    group: "35-44",
    users: "15%",
  },
  {
    group: "45+",
    users: "8%",
  },
];

function AudienceInsights() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Audience Insights
      </h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Age Group</th>
            <th className="p-4 text-left">Audience</th>
          </tr>
        </thead>

        <tbody>
          {audience.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{item.group}</td>
              <td className="p-4">{item.users}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AudienceInsights;