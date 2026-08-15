import {
  Brain,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";

const predictions = [
  {
    title: "Current Revenue",
    value: "$18,420",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  {
    title: "Next Month Prediction",
    value: "$20,450",
    icon: Brain,
    color: "bg-purple-500",
  },
  {
    title: "Expected Growth",
    value: "+11%",
    icon: Target,
    color: "bg-green-500",
  },
  {
    title: "Confidence Score",
    value: "94%",
    icon: Sparkles,
    color: "bg-orange-500",
  },
];

const recommendations = [
  "📈 Uploading between 6 PM and 8 PM may increase revenue by 18%.",
  "🎥 Tutorial videos are generating the highest RPM this month.",
  "🤝 Sponsorship income increased by 22% compared to last month.",
  "💎 Subscription revenue is growing steadily.",
  "🌍 YouTube contributes the highest revenue among all platforms.",
];

const RevenuePrediction = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          AI Revenue Prediction
        </h2>

        <p className="text-gray-500">
          AI-powered forecast and financial recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {predictions.map((item,index)=>{

          const Icon = item.icon;

          return(

            <div
              key={index}
              className="bg-white rounded-xl shadow p-5"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                >
                  <Icon size={24}/>
                </div>

              </div>

            </div>

          );

        })}

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-xl font-bold mb-5">
          AI Financial Insights
        </h3>

        <div className="space-y-4">

          {recommendations.map((item,index)=>(

            <div
              key={index}
              className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default RevenuePrediction;