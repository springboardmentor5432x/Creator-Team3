import React from "react";

const campaigns = [
  { campaign: "Summer Sale", client: "Nike", budget: "₹2.5L", status: "Running" },
  { campaign: "Festive Offer", client: "Amazon", budget: "₹4L", status: "Completed" },
  { campaign: "New Launch", client: "Samsung", budget: "₹3.2L", status: "Running" },
];

const CampaignDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campaign Management</h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Campaign</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Budget</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{campaign.campaign}</td>
              <td className="p-4">{campaign.client}</td>
              <td className="p-4">{campaign.budget}</td>
              <td className="p-4">{campaign.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignDashboard;