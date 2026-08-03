import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 4800 },
  { month: "Mar", revenue: 5300 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 6900 },
  { month: "Jun", revenue: 7600 },
  { month: "Jul", revenue: 8200 },
  { month: "Aug", revenue: 9100 },
  { month: "Sep", revenue: 9800 },
  { month: "Oct", revenue: 10500 },
  { month: "Nov", revenue: 11600 },
  { month: "Dec", revenue: 12800 },
];

const RevenueTrendChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold">Revenue Trend</h2>
          <p className="text-gray-500 text-sm">
            Monthly revenue performance
          </p>
        </div>

        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          +18%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendChart;