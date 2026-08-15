import React from "react";
import {
  Users,
  Megaphone,
  IndianRupee,
  TrendingUp,
  Eye,
  Heart,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  CircleCheck,
  Clock3,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const creatorGrowthData = [
  { month: "Jan", creators: 12, followers: 420 },
  { month: "Feb", creators: 14, followers: 510 },
  { month: "Mar", creators: 16, followers: 620 },
  { month: "Apr", creators: 18, followers: 730 },
  { month: "May", creators: 21, followers: 860 },
  { month: "Jun", creators: 24, followers: 980 },
];

const campaignData = [
  { name: "Beauty", reach: 820, engagement: 68 },
  { name: "Tech", reach: 760, engagement: 61 },
  { name: "Fashion", reach: 920, engagement: 76 },
  { name: "Food", reach: 650, engagement: 52 },
  { name: "Travel", reach: 840, engagement: 70 },
];

const campaignStatusData = [
  { name: "Active", value: 12, color: "#2563EB" },
  { name: "Completed", value: 18, color: "#10B981" },
  { name: "Pending", value: 5, color: "#F59E0B" },
];

const topCreators = [
  {
    name: "Priya Sharma",
    category: "Fashion",
    followers: "1.2M",
    engagement: "9.2%",
    revenue: "₹1.24L",
    growth: "+18%",
  },
  {
    name: "Arun Kumar",
    category: "Technology",
    followers: "845K",
    engagement: "8.6%",
    revenue: "₹98K",
    growth: "+14%",
  },
  {
    name: "Kaviya Raj",
    category: "Beauty",
    followers: "620K",
    engagement: "7.9%",
    revenue: "₹76K",
    growth: "+11%",
  },
  {
    name: "Rahul Dev",
    category: "Travel",
    followers: "540K",
    engagement: "7.4%",
    revenue: "₹64K",
    growth: "+9%",
  },
];

const upcomingCampaigns = [
  {
    brand: "Glow Beauty",
    campaign: "Summer Glow Launch",
    date: "Aug 08",
    status: "Starting Soon",
  },
  {
    brand: "TechNova",
    campaign: "Smart Watch Promotion",
    date: "Aug 12",
    status: "Active",
  },
  {
    brand: "Urban Style",
    campaign: "Monsoon Collection",
    date: "Aug 18",
    status: "Pending",
  },
];

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #DCE3F0",
  borderRadius: "12px",
  color: "#172033",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  valueColor = "text-slate-900",
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <h2 className={`mt-2 text-3xl font-bold ${valueColor}`}>
          {value}
        </h2>

        <p className="mt-2 text-xs font-medium text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className={`rounded-xl p-3 ${iconBg}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const AgencyDashboard = () => {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold text-blue-600">
              AGENCY PERFORMANCE
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Agency Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor creators, campaigns, revenue and agency growth from one dashboard.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Megaphone size={18} />
            Create Campaign
          </button>

        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Creators"
          value="24"
          subtitle="+4 creators this month"
          icon={Users}
          iconBg="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active Campaigns"
          value="12"
          subtitle="3 campaigns ending soon"
          icon={Megaphone}
          iconBg="bg-violet-100 text-violet-600"
        />

        <StatCard
          title="Agency Revenue"
          value="₹4.82L"
          subtitle="+18.5% from last month"
          icon={IndianRupee}
          iconBg="bg-emerald-100 text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Average Engagement"
          value="8.4%"
          subtitle="+1.2% performance growth"
          icon={Heart}
          iconBg="bg-pink-100 text-pink-600"
        />

        <StatCard
          title="Campaign Reach"
          value="8.6M"
          subtitle="+22% monthly reach"
          icon={Eye}
          iconBg="bg-cyan-100 text-cyan-600"
        />

        <StatCard
          title="Agency Growth"
          value="+28%"
          subtitle="Compared with previous month"
          icon={TrendingUp}
          iconBg="bg-amber-100 text-amber-600"
          valueColor="text-blue-600"
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* CREATOR GROWTH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Creator Growth Trend
            </h2>

            <p className="text-sm text-slate-500">
              Creator network growth over the last six months
            </p>
          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creatorGrowthData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                />

                <YAxis
                  stroke="#64748B"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#172033",
                    fontWeight: 700,
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="creators"
                  name="Creators"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="followers"
                  name="Followers (K)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* CAMPAIGN PERFORMANCE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Campaign Performance
            </h2>

            <p className="text-sm text-slate-500">
              Reach and engagement by campaign category
            </p>
          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                />

                <YAxis
                  stroke="#64748B"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: "#172033",
                    fontWeight: 700,
                  }}
                />

                <Legend />

                <Bar
                  dataKey="reach"
                  name="Reach (K)"
                  fill="#2563EB"
                  radius={[7, 7, 0, 0]}
                />

                <Bar
                  dataKey="engagement"
                  name="Engagement (K)"
                  fill="#10B981"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>

      {/* STATUS + AI INSIGHTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* CAMPAIGN STATUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Campaign Status
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Current campaign distribution
          </p>

          <div className="h-[260px]">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={campaignStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {campaignStatusData.map((item, index) => (
                    <Cell
                      key={index}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{
                    color: "#172033",
                    fontWeight: 600,
                  }}
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* AI INSIGHTS */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Agency Insights
              </h2>

              <p className="text-sm text-slate-600">
                Recommendations generated from creator and campaign performance
              </p>
            </div>

          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-blue-100 bg-white p-4">

              <p className="font-semibold text-slate-900">
                Best Performing Category
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Fashion campaigns generated the highest reach and engagement this month.
              </p>

            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4">

              <p className="font-semibold text-slate-900">
                Creator Opportunity
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Technology creators show strong growth and are suitable for new brand campaigns.
              </p>

            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4">

              <p className="font-semibold text-slate-900">
                Revenue Forecast
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Agency revenue is projected to reach ₹5.6L next month.
              </p>

            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4">

              <p className="font-semibold text-slate-900">
                Recommended Action
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Allocate more budget to high-engagement fashion and travel campaigns.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* TOP CREATORS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Top Performing Creators
            </h2>

            <p className="text-sm text-slate-500">
              Creator performance based on followers, engagement and revenue
            </p>
          </div>

          <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">
            View All
            <ArrowUpRight size={16} />
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Creator
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Category
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Followers
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Engagement
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Revenue
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Growth
                </th>

              </tr>

            </thead>

            <tbody>

              {topCreators.map((creator) => (

                <tr
                  key={creator.name}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  <td className="p-4 font-semibold text-slate-900">
                    {creator.name}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {creator.category}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {creator.followers}
                  </td>

                  <td className="p-4 text-sm font-medium text-slate-700">
                    {creator.engagement}
                  </td>

                  <td className="p-4 text-sm font-semibold text-emerald-600">
                    {creator.revenue}
                  </td>

                  <td className="p-4">

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      {creator.growth}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* UPCOMING CAMPAIGNS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-bold text-slate-900">
            Upcoming Campaigns
          </h2>

          <p className="text-sm text-slate-500">
            Track upcoming launches and campaign deadlines
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {upcomingCampaigns.map((campaign) => (

            <div
              key={campaign.campaign}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="font-bold text-slate-900">
                    {campaign.brand}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {campaign.campaign}
                  </p>

                </div>

                <CalendarDays
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div className="mt-5 flex items-center justify-between">

                <span className="flex items-center gap-2 text-sm text-slate-500">

                  <Clock3 size={15} />

                  {campaign.date}

                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                  {campaign.status}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <button className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50">

            <Users className="text-blue-600" />

            <p className="mt-3 font-semibold">
              Add Creator
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Add a creator to the agency network
            </p>

          </button>

          <button className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-violet-400 hover:bg-violet-50">

            <Megaphone className="text-violet-600" />

            <p className="mt-3 font-semibold">
              Create Campaign
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Start a new brand campaign
            </p>

          </button>

          <button className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50">

            <IndianRupee className="text-emerald-600" />

            <p className="mt-3 font-semibold">
              View Revenue
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Review agency earnings
            </p>

          </button>

          <button className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-amber-400 hover:bg-amber-50">

            <CircleCheck className="text-amber-600" />

            <p className="mt-3 font-semibold">
              Generate Report
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Export agency performance data
            </p>

          </button>

        </div>

      </div>

    </div>
  );
};

export default AgencyDashboard;