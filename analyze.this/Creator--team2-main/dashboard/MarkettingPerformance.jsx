import React from "react";
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";

const channelData = [
  {
    channel: "Instagram",
    reach: "1.2M",
    engagement: "9.4%",
    conversions: "1,820",
    score: 94,
  },
  {
    channel: "YouTube",
    reach: "860K",
    engagement: "8.6%",
    conversions: "1,460",
    score: 87,
  },
  {
    channel: "Facebook",
    reach: "540K",
    engagement: "6.9%",
    conversions: "980",
    score: 72,
  },
  {
    channel: "LinkedIn",
    reach: "310K",
    engagement: "7.8%",
    conversions: "640",
    score: 79,
  },
];

const funnelData = [
  {
    stage: "Campaign Reach",
    value: "2.4M",
    width: "100%",
  },
  {
    stage: "Content Engagement",
    value: "420K",
    width: "75%",
  },
  {
    stage: "Website Clicks",
    value: "108K",
    width: "52%",
  },
  {
    stage: "Conversions",
    value: "4,250",
    width: "30%",
  },
];

function MarketingPerformance() {
    const goals = [
  {
    title: "Monthly Reach",
    current: "2.4M",
    target: "3M",
    progress: 80,
  },
  {
    title: "Conversions",
    current: "4,250",
    target: "5,000",
    progress: 85,
  },
  {
    title: "Campaign Engagement",
    current: "8.7%",
    target: "10%",
    progress: 87,
  },
];

const alerts = [
  {
    title: "High Performing Channel",
    message:
      "Instagram engagement increased by 18% this week.",
    type: "success",
  },
  {
    title: "Budget Attention",
    message:
      "Facebook campaign has used 88% of its allocated budget.",
    type: "warning",
  },
  {
    title: "Conversion Opportunity",
    message:
      "YouTube has high reach but lower conversion performance.",
    type: "info",
  },
];
  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <p className="text-sm font-semibold text-blue-600">
          Marketing Intelligence
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Marketing Performance
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor channel performance, campaign conversions
          and marketing efficiency.
        </p>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Campaign Reach
              </p>

              <h2 className="text-3xl font-bold mt-2">
                2.4M
              </h2>

              <p className="text-sm text-green-600 mt-2">
                +18.4% growth
              </p>

            </div>

            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">

              <BarChart3 size={25} />

            </div>

          </div>

        </div>


        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Average Engagement
              </p>

              <h2 className="text-3xl font-bold mt-2">
                8.7%
              </h2>

              <p className="text-sm text-green-600 mt-2">
                +1.2% improvement
              </p>

            </div>

            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">

              <TrendingUp size={25} />

            </div>

          </div>

        </div>


        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Total Clicks
              </p>

              <h2 className="text-3xl font-bold mt-2">
                108K
              </h2>

              <p className="text-sm text-blue-600 mt-2">
                4.5% click rate
              </p>

            </div>

            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">

              <MousePointerClick size={25} />

            </div>

          </div>

        </div>


        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Conversions
              </p>

              <h2 className="text-3xl font-bold mt-2">
                4,250
              </h2>

              <p className="text-sm text-green-600 mt-2">
                +22% this month
              </p>

            </div>

            <div className="p-3 rounded-xl bg-green-100 text-green-600">

              <Target size={25} />

            </div>

          </div>

        </div>

      </div>


      {/* CHANNEL PERFORMANCE */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">

        <h2 className="text-xl font-bold">
          Channel Performance
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Compare reach, engagement and conversions
          across marketing channels.
        </p>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-gray-50 border-b">

                <th className="text-left p-4">
                  Channel
                </th>

                <th className="text-left p-4">
                  Reach
                </th>

                <th className="text-left p-4">
                  Engagement
                </th>

                <th className="text-left p-4">
                  Conversions
                </th>

                <th className="text-left p-4">
                  Performance
                </th>

              </tr>

            </thead>

            <tbody>

              {channelData.map((channel, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">

                    {channel.channel}

                  </td>

                  <td className="p-4">

                    {channel.reach}

                  </td>

                  <td className="p-4 text-green-600 font-semibold">

                    {channel.engagement}

                  </td>

                  <td className="p-4">

                    {channel.conversions}

                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-28 h-2 bg-gray-200 rounded-full">

                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{
                            width: `${channel.score}%`,
                          }}
                        />

                      </div>

                      <span className="font-semibold">

                        {channel.score}%

                      </span>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* CONVERSION FUNNEL + TOP CAMPAIGN */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* CONVERSION FUNNEL */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-bold">
            Conversion Funnel
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Track how audiences move from reach
            to successful conversions.
          </p>

          <div className="space-y-5">

            {funnelData.map((item, index) => (

              <div key={index}>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">

                    {item.stage}

                  </span>

                  <span className="font-bold">

                    {item.value}

                  </span>

                </div>

                <div className="w-full h-10 bg-gray-100 rounded-lg flex items-center">

                  <div
                    className="h-10 bg-blue-600 rounded-lg"
                    style={{
                      width: item.width,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* TOP CAMPAIGN */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center gap-2">

            <Trophy className="text-yellow-500" />

            <h2 className="text-xl font-bold">
              Top Performing Campaign
            </h2>

          </div>

          <div className="mt-7 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-7">

            <p className="text-sm opacity-80">
              Best Campaign This Month
            </p>

            <h3 className="text-2xl font-bold mt-2">
              Tech Product Launch 2026
            </h3>

            <div className="grid grid-cols-3 gap-4 mt-7">

              <div>

                <p className="text-xs opacity-80">
                  Reach
                </p>

                <p className="font-bold text-lg">
                  840K
                </p>

              </div>

              <div>

                <p className="text-xs opacity-80">
                  Engagement
                </p>

                <p className="font-bold text-lg">
                  11.2%
                </p>

              </div>

              <div>

                <p className="text-xs opacity-80">
                  Conversions
                </p>

                <p className="font-bold text-lg">
                  1,420
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* AI RECOMMENDATIONS */}

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-7 text-white">

        <div className="flex items-center gap-3">

          <Sparkles size={26} />

          <h2 className="text-2xl font-bold">
            AI Marketing Recommendations
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-bold">
              Increase Instagram Budget
            </h3>

            <p className="text-sm mt-2 text-gray-200">
              Instagram has the highest performance
              score and conversion potential.
            </p>

          </div>

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-bold">
              Improve Click Rate
            </h3>

            <p className="text-sm mt-2 text-gray-200">
              Test stronger call-to-action content
              to improve website clicks.
            </p>

          </div>

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-bold">
              Growth Opportunity
            </h3>

            <p className="text-sm mt-2 text-gray-200">
              LinkedIn engagement is strong and can
              be expanded with targeted campaigns.
            </p>

          </div>

        </div>

      </div>
      {/* ================================= */}
{/* MARKETING HEALTH + BUDGET */}
{/* ================================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* MARKETING HEALTH SCORE */}

  <div className="bg-white rounded-2xl border shadow-sm p-6">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-xl font-bold">
          Marketing Health Score
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Overall marketing performance assessment
        </p>

      </div>

      <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold">

        Excellent

      </span>

    </div>

    <div className="flex flex-col sm:flex-row items-center gap-8 mt-7">

      <div className="w-40 h-40 rounded-full border-[14px] border-green-500 flex flex-col items-center justify-center">

        <span className="text-4xl font-bold">
          91
        </span>

        <span className="text-sm text-gray-500">
          out of 100
        </span>

      </div>

      <div className="flex-1 w-full space-y-4">

        <div>

          <div className="flex justify-between text-sm">

            <span>
              Reach
            </span>

            <b>
              94%
            </b>

          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-2">

            <div className="h-2 w-[94%] bg-blue-600 rounded-full" />

          </div>

        </div>

        <div>

          <div className="flex justify-between text-sm">

            <span>
              Engagement
            </span>

            <b>
              87%
            </b>

          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-2">

            <div className="h-2 w-[87%] bg-purple-600 rounded-full" />

          </div>

        </div>

        <div>

          <div className="flex justify-between text-sm">

            <span>
              Conversion
            </span>

            <b>
              92%
            </b>

          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-2">

            <div className="h-2 w-[92%] bg-green-600 rounded-full" />

          </div>

        </div>

      </div>

    </div>

  </div>


  {/* BUDGET EFFICIENCY */}

  <div className="bg-white rounded-2xl border shadow-sm p-6">

    <h2 className="text-xl font-bold">
      Campaign Budget Efficiency
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Monitor budget usage and marketing return
    </p>

    <div className="grid grid-cols-2 gap-4 mt-7">

      <div className="bg-blue-50 rounded-xl p-5">

        <p className="text-sm text-gray-500">
          Total Budget
        </p>

        <h3 className="text-2xl font-bold mt-2">
          ₹8.5L
        </h3>

      </div>

      <div className="bg-orange-50 rounded-xl p-5">

        <p className="text-sm text-gray-500">
          Budget Used
        </p>

        <h3 className="text-2xl font-bold mt-2">
          ₹6.7L
        </h3>

      </div>

      <div className="bg-green-50 rounded-xl p-5">

        <p className="text-sm text-gray-500">
          Remaining
        </p>

        <h3 className="text-2xl font-bold mt-2">
          ₹1.8L
        </h3>

      </div>

      <div className="bg-purple-50 rounded-xl p-5">

        <p className="text-sm text-gray-500">
          Marketing ROI
        </p>

        <h3 className="text-2xl font-bold mt-2">
          3.8×
        </h3>

      </div>

    </div>

    <div className="mt-6">

      <div className="flex justify-between text-sm">

        <span>
          Budget Utilization
        </span>

        <b>
          79%
        </b>

      </div>

      <div className="h-3 bg-gray-200 rounded-full mt-2">

        <div className="h-3 w-[79%] bg-blue-600 rounded-full" />

      </div>

    </div>

  </div>

</div>


{/* ================================= */}
{/* MARKETING GOALS */}
{/* ================================= */}

<div className="bg-white rounded-2xl border shadow-sm p-6">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

    <div>

      <h2 className="text-xl font-bold">
        Marketing Goal Progress
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Track monthly marketing objectives
      </p>

    </div>

    <span className="text-green-600 font-bold">

      84% Average Progress

    </span>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-7">

    {goals.map((goal, index) => (

      <div
        key={index}
        className="border rounded-xl p-5"
      >

        <p className="font-bold">

          {goal.title}

        </p>

        <div className="flex justify-between mt-4">

          <span className="text-2xl font-bold">

            {goal.current}

          </span>

          <span className="text-sm text-gray-500">

            Target: {goal.target}

          </span>

        </div>

        <div className="h-3 bg-gray-200 rounded-full mt-4">

          <div
            className="h-3 bg-blue-600 rounded-full"
            style={{
              width: `${goal.progress}%`,
            }}
          />

        </div>

        <p className="text-sm text-green-600 mt-3">

          {goal.progress}% completed

        </p>

      </div>

    ))}

  </div>

</div>


{/* ================================= */}
{/* ALERTS + AI FORECAST */}
{/* ================================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* PERFORMANCE ALERTS */}

  <div className="bg-white rounded-2xl border shadow-sm p-6">

    <h2 className="text-xl font-bold">
      Performance Alerts
    </h2>

    <p className="text-sm text-gray-500 mt-1 mb-5">
      Important marketing changes that need attention
    </p>

    <div className="space-y-4">

      {alerts.map((alert, index) => (

        <div
          key={index}
          className={
            alert.type === "success"
              ? "p-4 rounded-xl bg-green-50 border border-green-100"
              : alert.type === "warning"
              ? "p-4 rounded-xl bg-orange-50 border border-orange-100"
              : "p-4 rounded-xl bg-blue-50 border border-blue-100"
          }
        >

          <p className="font-bold">

            {alert.title}

          </p>

          <p className="text-sm text-gray-600 mt-1">

            {alert.message}

          </p>

        </div>

      ))}

    </div>

  </div>


  {/* AI GROWTH FORECAST */}

  <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-purple-800 text-white p-7">

    <p className="text-sm opacity-80">

      AI Growth Forecast

    </p>

    <h2 className="text-2xl font-bold mt-2">

      Expected Marketing Growth

    </h2>

    <div className="grid grid-cols-2 gap-5 mt-7">

      <div className="bg-white/10 rounded-xl p-5">

        <p className="text-sm opacity-80">

          Expected Reach

        </p>

        <h3 className="text-3xl font-bold mt-2">

          3.1M

        </h3>

        <p className="text-green-300 text-sm mt-2">

          +29% forecast

        </p>

      </div>

      <div className="bg-white/10 rounded-xl p-5">

        <p className="text-sm opacity-80">

          Expected Conversions

        </p>

        <h3 className="text-3xl font-bold mt-2">

          5,600

        </h3>

        <p className="text-green-300 text-sm mt-2">

          +32% forecast

        </p>

      </div>

    </div>

    <div className="bg-white/10 rounded-xl p-5 mt-5">

      <p className="font-bold">

        AI Recommendation

      </p>

      <p className="text-sm text-blue-100 mt-2">

        Increase Instagram investment by 15% and
        retarget returning users to improve conversions.

      </p>

    </div>

  </div>

</div>

    </div>
  );
}

export default MarketingPerformance;