import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const platformRevenue = [
  {
    platform: "YouTube",
    revenue: 9200,
  },
  {
    platform: "Instagram",
    revenue: 6100,
  },
  {
    platform: "TikTok",
    revenue: 4200,
  },
  {
    platform: "Facebook",
    revenue: 2600,
  },
  {
    platform: "LinkedIn",
    revenue: 1800,
  },
  {
    platform: "X",
    revenue: 1400,
  },
];

const COLORS = [
  "#FF0000",
  "#E1306C",
  "#000000",
  "#1877F2",
  "#0A66C2",
  "#1DA1F2",
];

const PlatformRevenueChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-bold">
            Revenue by Platform
          </h2>

          <p className="text-gray-500 text-sm">
            Earnings comparison across social platforms
          </p>

        </div>

        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          Top Platform
        </div>

      </div>

      <ResponsiveContainer width="100%" height={340}>

        <BarChart data={platformRevenue}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="platform" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="revenue" radius={[10,10,0,0]}>

            {platformRevenue.map((entry,index)=>(
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

        {platformRevenue.map((item,index)=>(

          <div
            key={index}
            className="bg-gray-50 rounded-xl p-4"
          >

            <h3 className="font-semibold">
              {item.platform}
            </h3>

            <p className="text-2xl font-bold mt-2">
              ${item.revenue.toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default PlatformRevenueChart;