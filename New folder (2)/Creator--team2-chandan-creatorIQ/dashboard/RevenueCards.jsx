import {
  DollarSign,
  TrendingUp,
  Video,
  BadgeDollarSign,
  Target,
  BarChart3,
} from "lucide-react";

const cards = [
  {
    title: "Total Revenue",
    value: "$18,420",
    change: "+15.2%",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    title: "This Month",
    value: "$5,820",
    change: "+8.4%",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  {
    title: "AI Prediction",
    value: "$6,450",
    change: "Next Month",
    icon: Target,
    color: "bg-purple-500",
  },
  {
    title: "Revenue / Video",
    value: "$245",
    change: "Average",
    icon: Video,
    color: "bg-orange-500",
  },
  {
    title: "Average RPM",
    value: "$5.82",
    change: "Per 1000 Views",
    icon: BadgeDollarSign,
    color: "bg-pink-500",
  },
  {
    title: "Revenue Growth",
    value: "+18%",
    change: "Last 30 Days",
    icon: BarChart3,
    color: "bg-indigo-500",
  },
];

const RevenueCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>

                <h2 className="text-3xl font-bold mt-2">{card.value}</h2>

                <p className="text-green-600 font-medium mt-3">
                  {card.change}
                </p>
              </div>

              <div
                className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueCards;