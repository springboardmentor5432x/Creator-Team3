import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Mail,
  Calendar,
  BarChart3,
  Download,
} from "lucide-react";

const reportCards = [
  {
    title: "Reports Generated",
    value: "245",
    color: "bg-blue-500",
  },
  {
    title: "Downloads",
    value: "1,248",
    color: "bg-green-500",
  },
  {
    title: "Scheduled Reports",
    value: "12",
    color: "bg-purple-500",
  },
  {
    title: "Last Generated",
    value: "Today",
    color: "bg-orange-500",
  },
];

const reportTypes = [
  "Revenue Analytics Report",
  "Content Performance Report",
  "Audience Analytics Report",
  "Growth & Trends Report",
  "Complete Analytics Report",
];

const aiInsights = [
  "Revenue increased by 18% compared to last month.",
  "Instagram Reels generated the highest engagement.",
  "YouTube contributed the highest revenue.",
  "Audience from India increased by 12%.",
  "Technology content achieved the highest RPM.",
];

const ReportDashboard = () => {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Reports Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Generate, preview and export social media analytics reports.
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {reportCards.map((card, index) => (

          <div
            key={index}
            className="bg-white rounded-xl shadow p-6"
          >

            <div
              className={`${card.color} w-12 h-12 rounded-lg mb-4`}
            />

            <p className="text-gray-500">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Report Filters
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <div>

            <label className="font-medium block mb-2">
              Date
            </label>

            <input
              type="date"
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="font-medium block mb-2">
              Platform
            </label>

            <select className="w-full border rounded-lg p-3">

              <option>All Platforms</option>
              <option>YouTube</option>
              <option>Instagram</option>
              <option>Facebook</option>
              <option>TikTok</option>
              <option>LinkedIn</option>

            </select>

          </div>

          <div>

            <label className="font-medium block mb-2">
              Report Type
            </label>

            <select className="w-full border rounded-lg p-3">

              {reportTypes.map((type,index)=>(
                <option key={index}>{type}</option>
              ))}

            </select>

          </div>

        </div>

      </div>

      {/* Report Preview */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Report Preview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold">Revenue</h3>
            <p className="text-2xl font-bold mt-2">$48,500</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold">Top Platform</h3>
            <p className="text-2xl font-bold mt-2">YouTube</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold">Followers</h3>
            <p className="text-2xl font-bold mt-2">128K</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="font-semibold">Engagement</h3>
            <p className="text-2xl font-bold mt-2">8.7%</p>
          </div>

        </div>

      </div>

      {/* AI Insights */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          AI Report Summary
        </h2>

        <div className="space-y-4">

          {aiInsights.map((item,index)=>(

            <div
              key={index}
              className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4"
            >
              🤖 {item}
            </div>

          ))}

        </div>

      </div>

      {/* Export Buttons */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Export Reports
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <button className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-5 flex flex-col items-center gap-3">
            <FileText size={30}/>
            PDF
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 flex flex-col items-center gap-3">
            <FileSpreadsheet size={30}/>
            Excel
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 flex flex-col items-center gap-3">
            <FileDown size={30}/>
            CSV
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-5 flex flex-col items-center gap-3">
            <Mail size={30}/>
            Email
          </button>

          <button
            onClick={() => window.print()}
            className="bg-gray-700 hover:bg-gray-900 text-white rounded-xl p-5 flex flex-col items-center gap-3"
          >
            <Printer size={30}/>
            Print
          </button>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-5 flex flex-col items-center gap-3">
            <Download size={30}/>
            Generate
          </button>

        </div>

      </div>

      {/* Recent Reports */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-2 mb-5">

          <BarChart3 />

          <h2 className="text-xl font-bold">
            Recent Reports
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Report</th>
              <th>Date</th>
              <th>Platform</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-b">

              <td className="py-4">Revenue Report</td>
              <td>20 Jul 2026</td>
              <td>YouTube</td>
              <td className="text-green-600 font-semibold">
                Completed
              </td>

            </tr>

            <tr className="border-b">

              <td className="py-4">Audience Report</td>
              <td>18 Jul 2026</td>
              <td>Instagram</td>
              <td className="text-green-600 font-semibold">
                Completed
              </td>

            </tr>

            <tr>

              <td className="py-4">Growth Report</td>
              <td>15 Jul 2026</td>
              <td>Facebook</td>
              <td className="text-yellow-600 font-semibold">
                Scheduled
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ReportDashboard;