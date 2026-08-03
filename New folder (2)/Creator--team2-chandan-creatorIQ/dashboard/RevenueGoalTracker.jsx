import { Target, Trophy, TrendingUp } from "lucide-react";

const targetRevenue = 50000;
const currentRevenue = 36200;

const percentage = Math.round((currentRevenue / targetRevenue) * 100);

const RevenueGoalTracker = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Revenue Goal Tracker
          </h2>

          <p className="text-gray-500">
            Track your progress towards this month's target.
          </p>

        </div>

        <Target className="text-indigo-600" size={34} />

      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-blue-50 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <Target className="text-blue-600"/>

            <h3 className="font-semibold">
              Target Revenue
            </h3>

          </div>

          <h2 className="text-3xl font-bold mt-4">
            $50,000
          </h2>

        </div>

        <div className="bg-green-50 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <Trophy className="text-green-600"/>

            <h3 className="font-semibold">
              Current Revenue
            </h3>

          </div>

          <h2 className="text-3xl font-bold mt-4">
            $36,200
          </h2>

        </div>

        <div className="bg-orange-50 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <TrendingUp className="text-orange-600"/>

            <h3 className="font-semibold">
              Remaining
            </h3>

          </div>

          <h2 className="text-3xl font-bold mt-4">
            ${targetRevenue-currentRevenue}
          </h2>

        </div>

      </div>

      <div className="mb-4 flex justify-between">

        <span className="font-medium">
          Goal Completion
        </span>

        <span className="font-bold text-indigo-600">
          {percentage}%
        </span>

      </div>

      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

        <div
          className="bg-indigo-600 h-5 rounded-full transition-all duration-700"
          style={{
            width:`${percentage}%`
          }}
        />

      </div>

      <div className="mt-8 bg-indigo-50 rounded-xl p-5">

        <h3 className="font-bold text-lg mb-2">
          AI Suggestion
        </h3>

        <p className="text-gray-700">
          Increase your weekly uploads by 2 videos and prioritize
          high-performing content categories. Based on current trends,
          you have a strong chance of achieving your monthly revenue target.
        </p>

      </div>

    </div>
  );
};

export default RevenueGoalTracker;