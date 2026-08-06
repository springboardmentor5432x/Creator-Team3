import React from "react";

const campaigns = [
  {
    campaign: "Summer Sale",
    reach: "1.2M",
    engagement: "9.1%",
    status: "Running",
  },
  {
    campaign: "Festival Offer",
    reach: "820K",
    engagement: "8.3%",
    status: "Completed",
  },
  {
    campaign: "Product Launch",
    reach: "650K",
    engagement: "10.2%",
    status: "Running",
  },
];

function CampaignAnalytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Campaign Analytics
      </h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Campaign</th>
            <th className="p-4 text-left">Reach</th>
            <th className="p-4 text-left">Engagement</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{item.campaign}</td>
              <td className="p-4">{item.reach}</td>
              <td className="p-4">{item.engagement}</td>
              <td className="p-4">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignAnalytics;