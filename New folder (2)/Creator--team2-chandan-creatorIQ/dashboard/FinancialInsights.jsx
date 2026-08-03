import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Award,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const insights = [
  {
    title: "Highest Revenue Platform",
    description: "YouTube generated 46% of your total revenue this month.",
    icon: Award,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Fastest Growing Revenue Source",
    description: "Sponsorship revenue increased by 22% compared to last month.",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Revenue Drop Alert",
    description: "Affiliate revenue decreased by 8% this month.",
    icon: TrendingDown,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "AI Recommendation",
    description: "Posting videos between 6 PM and 8 PM can improve ad revenue.",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Healthy Subscription Growth",
    description: "Premium subscriptions increased steadily over the last 3 months.",
    icon: CheckCircle,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Pending Sponsorship",
    description: "Two sponsorship payments are pending approval.",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-600",
  },
];

const FinancialInsights = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Financial Insights
        </h2>

        <p className="text-gray-500">
          AI-powered recommendations based on your creator revenue.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {insights.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="border rounded-xl p-5 hover:shadow-lg transition-all"
            >

              <div className="flex items-start gap-4">

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={24}/>
                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default FinancialInsights;