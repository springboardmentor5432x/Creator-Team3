import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const revenueSources = [
  { name: "Ad Revenue", value: 42 },
  { name: "Sponsorship", value: 22 },
  { name: "Affiliate", value: 12 },
  { name: "Subscription", value: 10 },
  { name: "Brand Deals", value: 8 },
  { name: "Merchandise", value: 6 },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

const RevenueSourceChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-xl font-bold">
            Revenue Sources
          </h2>

          <p className="text-gray-500 text-sm">
            Income distribution by source
          </p>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <PieChart>

          <Pie
            data={revenueSources}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            label
          >

            {revenueSources.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-6">

        {revenueSources.map((item, index) => (

          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
          >

            <div className="flex items-center gap-2">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span className="text-sm">
                {item.name}
              </span>

            </div>

            <span className="font-semibold">
              {item.value}%
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default RevenueSourceChart;