import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Calendar,
  Filter,
} from "lucide-react";

const DownloadReports = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Download Reports
        </h2>

        <p className="text-gray-500">
          Generate and export detailed revenue reports.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div>

          <label className="font-medium mb-2 block">
            Select Date Range
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="font-medium mb-2 block">
            Platform
          </label>

          <select className="w-full border rounded-lg p-3">

            <option>All Platforms</option>
            <option>YouTube</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
            <option>X</option>

          </select>

        </div>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <button className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-5 flex flex-col items-center gap-3 transition">

          <FileText size={32}/>

          <span>Download PDF</span>

        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 flex flex-col items-center gap-3 transition">

          <FileSpreadsheet size={32}/>

          <span>Export Excel</span>

        </button>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 flex flex-col items-center gap-3 transition">

          <FileDown size={32}/>

          <span>Export CSV</span>

        </button>

        <button
          onClick={() => window.print()}
          className="bg-gray-800 hover:bg-black text-white rounded-xl p-5 flex flex-col items-center gap-3 transition"
        >

          <Printer size={32}/>

          <span>Print Report</span>

        </button>

      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-5">

        <div className="flex items-center gap-3 mb-3">

          <Calendar className="text-blue-600"/>

          <h3 className="font-bold">
            Report Summary
          </h3>

        </div>

        <ul className="space-y-2 text-gray-700">

          <li>✔ Total Revenue Summary</li>

          <li>✔ Platform-wise Revenue</li>

          <li>✔ Video Earnings Report</li>

          <li>✔ Sponsorship Analytics</li>

          <li>✔ Subscription Analytics</li>

          <li>✔ Affiliate Marketing Report</li>

          <li>✔ AI Revenue Prediction</li>

          <li>✔ Financial Insights</li>

        </ul>

      </div>

      <div className="mt-6 flex justify-end">

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition">

          <Filter size={20}/>

          Generate Report

        </button>

      </div>

    </div>
  );
};

export default DownloadReports;