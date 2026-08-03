import React from "react";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

const AgencyOverview = () => {
  const cards = [
    { title: "Total Creators", value: "128", icon: <Users size={28} />, color: "bg-blue-500" },
    { title: "Active Campaigns", value: "24", icon: <Briefcase size={28} />, color: "bg-green-500" },
    { title: "Monthly Revenue", value: "₹12.5L", icon: <DollarSign size={28} />, color: "bg-yellow-500" },
    { title: "Growth Rate", value: "+18%", icon: <TrendingUp size={28} />, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Agency Dashboard</h1>
        <p className="text-gray-500">
          Manage creators, campaigns and agency performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <div className={`${card.color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
            <h3 className="mt-4 text-gray-500">{card.title}</h3>
            <h2 className="text-3xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyOverview;