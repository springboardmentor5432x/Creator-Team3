import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Users,
  UserPlus,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Smartphone,
  Monitor,
  Tablet,
  Tv,
  MapPin,
  Clock,
  CalendarDays,
  Globe2,
  Activity,
} from "lucide-react";


const audienceOverview = [
  {
    title: "Total Followers",
    value: "128.5K",
    change: "+12.4%",
    icon: Users,
    color: "#6C4CFF",
    bg: "#EEE9FF",
  },
  {
    title: "New Followers",
    value: "8,420",
    change: "+18.2%",
    icon: UserPlus,
    color: "#00A896",
    bg: "#E2F8F4",
  },
  {
    title: "Audience Reach",
    value: "1.82M",
    change: "+15.6%",
    icon: Eye,
    color: "#FF7A59",
    bg: "#FFF0EB",
  },
  {
    title: "Impressions",
    value: "3.46M",
    change: "+21.8%",
    icon: Activity,
    color: "#E63973",
    bg: "#FFE8F0",
  },
  {
    title: "Monthly Growth",
    value: "8.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "#0077B6",
    bg: "#E4F4FF",
  },
  {
    title: "Avg. Engagement",
    value: "7.8%",
    change: "+0.9%",
    icon: Heart,
    color: "#F4A261",
    bg: "#FFF3E6",
  },
];


const followerGrowth = [
  { date: "Jul 1", followers: 116200, newFollowers: 420 },
  { date: "Jul 4", followers: 117400, newFollowers: 610 },
  { date: "Jul 7", followers: 118900, newFollowers: 720 },
  { date: "Jul 10", followers: 120100, newFollowers: 540 },
  { date: "Jul 13", followers: 121800, newFollowers: 820 },
  { date: "Jul 16", followers: 123000, newFollowers: 610 },
  { date: "Jul 19", followers: 124600, newFollowers: 770 },
  { date: "Jul 22", followers: 126100, newFollowers: 850 },
  { date: "Jul 25", followers: 127200, newFollowers: 690 },
  { date: "Jul 28", followers: 128500, newFollowers: 810 },
];


const reachImpressionData = [
  { date: "Week 1", reach: 285000, impressions: 510000 },
  { date: "Week 2", reach: 340000, impressions: 650000 },
  { date: "Week 3", reach: 410000, impressions: 790000 },
  { date: "Week 4", reach: 465000, impressions: 920000 },
];


const ageData = [
  { name: "18–24", value: 34, color: "#6C4CFF" },
  { name: "25–34", value: 38, color: "#00A896" },
  { name: "35–44", value: 17, color: "#FF7A59" },
  { name: "45–54", value: 7, color: "#E63973" },
  { name: "55+", value: 4, color: "#94A3B8" },
];


const genderData = [
  { name: "Female", value: 53, color: "#6C4CFF" },
  { name: "Male", value: 44, color: "#00A896" },
  { name: "Other", value: 3, color: "#FFB703" },
];


const activityHours = [
  { hour: "6 AM", activity: 24 },
  { hour: "9 AM", activity: 48 },
  { hour: "12 PM", activity: 66 },
  { hour: "3 PM", activity: 58 },
  { hour: "6 PM", activity: 88 },
  { hour: "8 PM", activity: 100 },
  { hour: "10 PM", activity: 76 },
];


const activeDays = [
  { day: "Mon", value: 64 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 68 },
  { day: "Thu", value: 82 },
  { day: "Fri", value: 96 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 90 },
];


const deviceData = [
  {
    name: "Mobile",
    value: 76,
    icon: Smartphone,
    color: "#6C4CFF",
  },
  {
    name: "Desktop",
    value: 14,
    icon: Monitor,
    color: "#00A896",
  },
  {
    name: "Tablet",
    value: 6,
    icon: Tablet,
    color: "#FF7A59",
  },
  {
    name: "Smart TV",
    value: 4,
    icon: Tv,
    color: "#E63973",
  },
];


const locationData = [
  {
    country: "India",
    region: "Tamil Nadu",
    percentage: 31,
    audience: "39.8K",
  },
  {
    country: "United States",
    region: "California",
    percentage: 24,
    audience: "30.8K",
  },
  {
    country: "United Kingdom",
    region: "London",
    percentage: 13,
    audience: "16.7K",
  },
  {
    country: "Canada",
    region: "Ontario",
    percentage: 10,
    audience: "12.8K",
  },
  {
    country: "Australia",
    region: "New South Wales",
    percentage: 8,
    audience: "10.2K",
  },
];


const engagementData = [
  { date: "Week 1", likes: 24000, comments: 4800, shares: 3100, saves: 2700 },
  { date: "Week 2", likes: 28000, comments: 5600, shares: 3900, saves: 3200 },
  { date: "Week 3", likes: 33000, comments: 6400, shares: 4700, saves: 4100 },
  { date: "Week 4", likes: 39000, comments: 7800, shares: 5900, saves: 5100 },
];


const tooltipStyle = {
  backgroundColor: "#172033",
  color: "#FFFFFF",
  border: "1px solid #334155",
  borderRadius: 12,
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  padding: "10px 14px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)",
};


const AudienceAnalytics = () => {
  const [range, setRange] = useState("28 Days");

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div
            className="text-xs font-bold uppercase tracking-[3px]"
            style={{ color: "#6C4CFF" }}
          >
            Audience Intelligence
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            Audience Analytics
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Understand audience growth, demographics, behavior,
            activity and engagement.
          </p>

        </div>


        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white"
        >

          <option>7 Days</option>

          <option>28 Days</option>

          <option>90 Days</option>

          <option>1 Year</option>

        </select>

      </div>


      {/* AUDIENCE OVERVIEW */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {audienceOverview.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="ad-card p-5 hover:-translate-y-1 transition"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-gray-500">

                    {item.title}

                  </p>


                  <h2 className="text-3xl font-bold mt-2">

                    {item.value}

                  </h2>


                  <p
                    className="text-xs font-semibold mt-2"
                    style={{ color: "#00A896" }}
                  >

                    {item.change} from previous period

                  </p>

                </div>


                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: item.bg,
                    color: item.color,
                  }}
                >

                  <Icon size={22} />

                </div>

              </div>

            </div>

          );

        })}

      </div>


      {/* FOLLOWER GROWTH */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="ad-card p-6 xl:col-span-2">

          <h2 className="font-bold text-lg">

            Follower Growth Analysis

          </h2>

          <p className="text-sm text-gray-500 mb-5">

            Daily follower growth and total audience growth

          </p>


          <div className="h-[320px]">

            <ResponsiveContainer>

              <AreaChart data={followerGrowth}>

                <defs>

                  <linearGradient
                    id="followerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#6C4CFF"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="100%"
                      stopColor="#6C4CFF"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />


                <XAxis dataKey="date" />


                <YAxis />


                <Tooltip contentStyle={tooltipStyle} />


                <Area
                  dataKey="followers"
                  stroke="#6C4CFF"
                  strokeWidth={3}
                  fill="url(#followerGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* GROWTH SUMMARY */}

        <div className="ad-card p-6">

          <h2 className="font-bold text-lg">

            Growth Summary

          </h2>


          <div className="space-y-6 mt-6">

            <div>

              <p className="text-gray-500 text-sm">

                Daily Growth

              </p>

              <h3 className="text-2xl font-bold">

                +810

              </h3>

            </div>


            <div>

              <p className="text-gray-500 text-sm">

                Weekly Growth

              </p>

              <h3 className="text-2xl font-bold">

                +4,620

              </h3>

            </div>


            <div>

              <p className="text-gray-500 text-sm">

                Monthly Growth

              </p>

              <h3 className="text-2xl font-bold">

                +8.2%

              </h3>

            </div>


            <div>

              <p className="text-gray-500 text-sm">

                Total Followers

              </p>

              <h3 className="text-2xl font-bold">

                128.5K

              </h3>

            </div>

          </div>

        </div>

      </div>


      {/* DEMOGRAPHICS */}

      <div>

        <h2 className="text-xl font-bold mb-4">

          Audience Demographics

        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          {/* AGE */}

          <div className="ad-card p-6">

            <h3 className="font-bold">

              Age Distribution

            </h3>


            <div className="h-[300px]">

              <ResponsiveContainer>

                <PieChart>

                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                  >

                    {ageData.map((item, index) => (

                      <Cell
                        key={index}
                        fill={item.color}
                      />

                    ))}

                  </Pie>


                  <Tooltip
                    contentStyle={tooltipStyle}
                  />


                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* GENDER */}

          <div className="ad-card p-6">

            <h3 className="font-bold">

              Gender Distribution

            </h3>


            <div className="h-[300px]">

              <ResponsiveContainer>

                <PieChart>

                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                  >

                    {genderData.map((item, index) => (

                      <Cell
                        key={index}
                        fill={item.color}
                      />

                    ))}

                  </Pie>


                  <Tooltip
                    contentStyle={tooltipStyle}
                  />


                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>


      {/* ACTIVITY */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">


        {/* ACTIVE HOURS */}

        <div className="ad-card p-6">

          <div className="flex gap-2">

            <Clock
              style={{ color: "#6C4CFF" }}
            />

            <div>

              <h2 className="font-bold">

                Audience Active Hours

              </h2>

              <p className="text-sm text-gray-500">

                Best time to publish content

              </p>

            </div>

          </div>


          <div className="h-[300px] mt-5">

            <ResponsiveContainer>

              <BarChart data={activityHours}>

                <XAxis dataKey="hour" />

                <YAxis />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="activity"
                  fill="#6C4CFF"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background: "#EEE9FF",
            }}
          >

            <b>

              Peak Engagement:

            </b>

            {" "}8 PM – 10 PM

          </div>

        </div>


        {/* ACTIVE DAYS */}

        <div className="ad-card p-6">

          <div className="flex gap-2">

            <CalendarDays
              style={{ color: "#00A896" }}
            />

            <div>

              <h2 className="font-bold">

                Most Active Days

              </h2>

              <p className="text-sm text-gray-500">

                Weekly audience activity

              </p>

            </div>

          </div>


          <div className="h-[300px] mt-5">

            <ResponsiveContainer>

              <BarChart data={activeDays}>

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="value"
                  fill="#00A896"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background: "#E2F8F4",
            }}
          >

            <b>

              Most Active Day:

            </b>

            {" "}Saturday

          </div>

        </div>

      </div>


      {/* DEVICE USAGE */}

      <div className="ad-card p-6">

        <div className="flex items-center gap-2">

          <Smartphone
            style={{ color: "#6C4CFF" }}
          />

          <div>

            <h2 className="font-bold text-lg">

              Device Usage Analysis

            </h2>

            <p className="text-sm text-gray-500">

              Devices used by your audience

            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

          {deviceData.map((device) => {

            const Icon = device.icon;

            return (

              <div
                key={device.name}
                className="border rounded-2xl p-5"
              >

                <Icon
                  size={24}
                  style={{
                    color: device.color,
                  }}
                />


                <h3 className="text-lg font-bold mt-4">

                  {device.value}%

                </h3>


                <p className="text-gray-500 text-sm">

                  {device.name}

                </p>


                <div className="h-2 bg-gray-100 rounded-full mt-3">

                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${device.value}%`,
                      background: device.color,
                    }}
                  />

                </div>

              </div>

            );

          })}

        </div>

      </div>


      {/* GEOGRAPHIC */}

      <div className="ad-card p-6">

        <div className="flex gap-2">

          <Globe2
            style={{ color: "#FF7A59" }}
          />

          <div>

            <h2 className="font-bold text-lg">

              Geographic Audience Analysis

            </h2>

            <p className="text-sm text-gray-500">

              Top countries and regions

            </p>

          </div>

        </div>


        <div className="space-y-5 mt-6">

          {locationData.map((location) => (

            <div key={location.country}>

              <div className="flex justify-between">

                <div>

                  <h3 className="font-semibold">

                    {location.country}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {location.region}

                  </p>

                </div>


                <div className="text-right">

                  <b>

                    {location.percentage}%

                  </b>

                  <p className="text-xs text-gray-500">

                    {location.audience}

                  </p>

                </div>

              </div>


              <div className="h-2 bg-gray-100 rounded-full mt-2">

                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${location.percentage}%`,
                    background:
                      "linear-gradient(90deg,#6C4CFF,#00A896)",
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* REACH AND IMPRESSIONS */}

      <div className="ad-card p-6">

        <h2 className="font-bold text-lg">

          Reach and Impressions Analysis

        </h2>

        <p className="text-sm text-gray-500">

          Unique audience exposure compared with total content visibility

        </p>


        <div className="h-[350px] mt-6">

          <ResponsiveContainer>

            <LineChart
              data={reachImpressionData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />


              <XAxis
                dataKey="date"
              />


              <YAxis />


              <Tooltip
                contentStyle={tooltipStyle}
              />


              <Legend />


              <Line
                dataKey="reach"
                stroke="#6C4CFF"
                strokeWidth={3}
              />


              <Line
                dataKey="impressions"
                stroke="#FF7A59"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ENGAGEMENT */}

      <div className="ad-card p-6">

        <h2 className="font-bold text-lg">

          Audience Engagement Insights

        </h2>

        <p className="text-sm text-gray-500">

          Audience interaction trends across your content

        </p>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <div className="p-4 rounded-xl bg-purple-50">

            <Heart
              style={{ color: "#6C4CFF" }}
            />

            <h3 className="text-2xl font-bold mt-3">

              124K

            </h3>

            <p className="text-sm">

              Likes

            </p>

          </div>


          <div className="p-4 rounded-xl bg-green-50">

            <MessageCircle
              style={{ color: "#00A896" }}
            />

            <h3 className="text-2xl font-bold mt-3">

              24.6K

            </h3>

            <p className="text-sm">

              Comments

            </p>

          </div>


          <div className="p-4 rounded-xl bg-orange-50">

            <Share2
              style={{ color: "#FF7A59" }}
            />

            <h3 className="text-2xl font-bold mt-3">

              17.6K

            </h3>

            <p className="text-sm">

              Shares

            </p>

          </div>


          <div className="p-4 rounded-xl bg-pink-50">

            <Bookmark
              style={{ color: "#E63973" }}
            />

            <h3 className="text-2xl font-bold mt-3">

              15.1K

            </h3>

            <p className="text-sm">

              Saves

            </p>

          </div>

        </div>


        <div className="h-[350px] mt-7">

          <ResponsiveContainer>

            <BarChart
              data={engagementData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />


              <XAxis
                dataKey="date"
              />


              <YAxis />


              <Tooltip
                contentStyle={tooltipStyle}
              />


              <Legend />


              <Bar
                dataKey="likes"
                fill="#6C4CFF"
              />


              <Bar
                dataKey="comments"
                fill="#00A896"
              />


              <Bar
                dataKey="shares"
                fill="#FF7A59"
              />


              <Bar
                dataKey="saves"
                fill="#E63973"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};


export default AudienceAnalytics;