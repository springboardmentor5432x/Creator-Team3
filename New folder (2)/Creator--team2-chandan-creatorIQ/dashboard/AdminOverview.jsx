import React from "react";
import { Users, DollarSign, Activity, ShieldCheck } from "lucide-react";

const cards = [
  {
    title: "Total Users",
    value: "1,250",
    icon: <Users size={26} />,
    color: "bg-blue-500",
  },
  {
    title: "Platform Revenue",
    value: "₹24.8L",
    icon: <DollarSign size={26} />,
    color: "bg-green-500",
  },
  {
    title: "System Health",
    value: "99.9%",
    icon: <Activity size={26} />,
    color: "bg-purple-500",
  },
  {
    title: "Security Status",
    value: "Protected",
    icon: <ShieldCheck size={26} />,
    color: "bg-red-500",
  },
];

function AdminOverview() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Administrator Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage users, monitor platform health and configure system settings.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}
            >
              {card.icon}
            </div>

            <h3 className="mt-4 text-gray-500">
              {card.title}
            </h3>

            <h2 className="text-3xl font-bold">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminOverview;