import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Target,
  Users,
  IndianRupee,
  CheckCircle2,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const campaignReports = [
  {
    campaign: "Tech Product Launch",
    reach: "1.2M",
    engagement: "9.4%",
    conversions: "1,850",
    roi: "4.2×",
    status: "Excellent",
  },
  {
    campaign: "Beauty Collection",
    reach: "980K",
    engagement: "8.6%",
    conversions: "1,420",
    roi: "3.8×",
    status: "Good",
  },
  {
    campaign: "Fitness Challenge",
    reach: "760K",
    engagement: "7.2%",
    conversions: "980",
    roi: "2.9×",
    status: "Needs Improvement",
  },
];
const downloadMarketingReport = (
  format,
  period,
  reports
) => {

  const reportData = reports.map((item) => ({
    Campaign: item.campaign,
    Reach: item.reach,
    Engagement: item.engagement,
    Conversions: item.conversions,
    ROI: item.roi,
    Performance: item.status,
  }));


  /* CSV DOWNLOAD */

  if (format === "CSV") {

    const worksheet =
      XLSX.utils.json_to_sheet(
        reportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Marketing Report"
    );

    XLSX.writeFile(
      workbook,
      `Marketing_Report_${period}.csv`
    );

  }


  /* EXCEL DOWNLOAD */

  else if (format === "Excel") {

    const worksheet =
      XLSX.utils.json_to_sheet(
        reportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Marketing Report"
    );

    XLSX.writeFile(
      workbook,
      `Marketing_Report_${period}.xlsx`
    );

  }


  /* PDF DOWNLOAD */

  else if (format === "PDF") {

    const pdf = new jsPDF();

    pdf.setFontSize(20);

    pdf.text(
      "Marketing Performance Report",
      14,
      20
    );

    pdf.setFontSize(11);

    pdf.text(
      `Report Period: ${period}`,
      14,
      30
    );

    autoTable(
      pdf,
      {
        startY: 40,

        head: [[
          "Campaign",
          "Reach",
          "Engagement",
          "Conversions",
          "ROI",
          "Performance",
        ]],

        body: reportData.map(
          (item) => [
            item.Campaign,
            item.Reach,
            item.Engagement,
            item.Conversions,
            item.ROI,
            item.Performance,
          ]
        ),
      }
    );

    pdf.save(
      `Marketing_Report_${period}.pdf`
    );

  }

};
function MarketingReports() {
  const [period, setPeriod] = useState("This Month");
  const [downloadFormat, setDownloadFormat] =
  useState("PDF");

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <p className="text-blue-600 font-semibold">
            Marketing Intelligence
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Marketing Reports
          </h1>

          <p className="text-gray-500 mt-2">
            Analyze campaign performance, audience growth,
            conversions and marketing efficiency.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

  {/* REPORT PERIOD */}

  <select
    value={period}
    onChange={(e) =>
      setPeriod(e.target.value)
    }
    className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
  >

    <option>This Week</option>

    <option>This Month</option>

    <option>Last 3 Months</option>

    <option>This Year</option>

  </select>


  {/* DOWNLOAD FORMAT */}

  <select
    value={downloadFormat}
    onChange={(e) =>
      setDownloadFormat(e.target.value)
    }
    className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
  >

    <option value="PDF">
      PDF
    </option>

    <option value="Excel">
      Excel
    </option>

    <option value="CSV">
      CSV
    </option>

  </select>


  {/* DOWNLOAD BUTTON */}

  <button
    onClick={() =>
      downloadMarketingReport(
        downloadFormat,
        period,
        campaignReports
      )
    }
    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold"
  >

    <Download size={19} />

    Download Report

  </button>

</div>
</div>
      {/* REPORT SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between">

            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">

              <Users size={24} />

            </div>

            <span className="text-green-600 text-sm font-bold">

              +18%

            </span>

          </div>

          <p className="text-gray-500 mt-5">
            Total Audience Reach
          </p>

          <h2 className="text-3xl font-bold mt-1">
            2.4M
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Compared with previous period
          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between">

            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">

              <TrendingUp size={24} />

            </div>

            <span className="text-green-600 text-sm font-bold">

              +1.2%

            </span>

          </div>

          <p className="text-gray-500 mt-5">
            Average Engagement
          </p>

          <h2 className="text-3xl font-bold mt-1">
            8.7%
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Strong audience interaction
          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between">

            <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center">

              <Target size={24} />

            </div>

            <span className="text-green-600 text-sm font-bold">

              +24%

            </span>

          </div>

          <p className="text-gray-500 mt-5">
            Total Conversions
          </p>

          <h2 className="text-3xl font-bold mt-1">
            4,250
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            85% of monthly target
          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between">

            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">

              <IndianRupee size={24} />

            </div>

            <span className="text-green-600 text-sm font-bold">

              +16%

            </span>

          </div>

          <p className="text-gray-500 mt-5">
            Marketing ROI
          </p>

          <h2 className="text-3xl font-bold mt-1">
            3.8×
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Return on marketing investment
          </p>

        </div>

      </div>


      {/* EXECUTIVE SUMMARY */}

      <div className="bg-gradient-to-r from-blue-700 to-purple-800 rounded-2xl p-7 text-white">

        <div className="flex items-start gap-4">

          <div className="bg-white/15 p-3 rounded-xl">

            <FileText size={26} />

          </div>

          <div>

            <p className="text-blue-200 text-sm">
              AI Executive Summary
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Marketing Performance is Growing
            </h2>

            <p className="text-blue-100 mt-3 max-w-4xl">

              Marketing reach increased by 18% and conversions
              improved by 24%. Instagram remains the strongest
              engagement channel. The Fitness Challenge campaign
              needs better audience targeting to improve ROI.

            </p>

          </div>

        </div>

      </div>


      {/* CAMPAIGN REPORT TABLE */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Campaign Performance Report
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Compare campaign reach, engagement,
            conversions and marketing return.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-4">
                  Campaign
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
                  ROI
                </th>

                <th className="text-left p-4">
                  Performance
                </th>

              </tr>

            </thead>

            <tbody>

              {campaignReports.map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">

                    {item.campaign}

                  </td>

                  <td className="p-4">

                    {item.reach}

                  </td>

                  <td className="p-4 text-green-600 font-semibold">

                    {item.engagement}

                  </td>

                  <td className="p-4">

                    {item.conversions}

                  </td>

                  <td className="p-4 font-bold">

                    {item.roi}

                  </td>

                  <td className="p-4">

                    <span
                      className={
                        item.status === "Excellent"
                          ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                          : item.status === "Good"
                          ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          : "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                      }
                    >

                      {item.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* REPORT STATUS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-600"
            />

            <div>

              <p className="font-bold">
                Campaign Report
              </p>

              <p className="text-sm text-gray-500">
                Updated today
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <Calendar
              className="text-blue-600"
            />

            <div>

              <p className="font-bold">
                Monthly Report
              </p>

              <p className="text-sm text-gray-500">
                Ready to download
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <FileText
              className="text-purple-600"
            />

            <div>

              <p className="font-bold">
                AI Summary
              </p>

              <p className="text-sm text-gray-500">
                Generated successfully
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
export default MarketingReports;