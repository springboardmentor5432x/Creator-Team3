import React from "react";
import { Megaphone, Users, TrendingUp, Target } from "lucide-react";

const cards = [
  { title: "Active Campaigns", value: "18", icon: <Megaphone size={26} />, color: "bg-blue-500" },
  { title: "Audience Reach", value: "2.4M", icon: <Users size={26} />, color: "bg-green-500" },
  { title: "Engagement Rate", value: "8.7%", icon: <TrendingUp size={26} />, color: "bg-purple-500" },
  { title: "Conversions", value: "4,250", icon: <Target size={26} />, color: "bg-orange-500" },
];

function MarketingOverview() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Marketing Team Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
              {card.icon}
            </div>

            <h3 className="mt-4 text-gray-500">{card.title}</h3>
            <h2 className="text-3xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketingOverview;