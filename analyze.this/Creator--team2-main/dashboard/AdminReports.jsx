import React, { useMemo, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import {
  FileText,
  Download,
  Search,
  Users,
  UserCheck,
  ShieldCheck,
  Activity,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";


const reportData = [
  {
    id: 1,
    title: "Platform User Report",
    category: "Users",
    period: "This Month",
    value: "12,480",
    change: "+12%",
    status: "Healthy",
    updated: "Today, 11:30 AM",
    description:
      "User registrations and active users increased compared with the previous month.",
  },

  {
    id: 2,
    title: "Platform Security Report",
    category: "Security",
    period: "This Month",
    value: "98.7%",
    change: "+2.4%",
    status: "Secure",
    updated: "Today, 10:45 AM",
    description:
      "Most accounts are protected and unusual login attempts are being monitored.",
  },

  {
    id: 3,
    title: "System Performance Report",
    category: "Performance",
    period: "This Month",
    value: "99.9%",
    change: "+0.5%",
    status: "Excellent",
    updated: "Today, 09:20 AM",
    description:
      "The dashboard and analytics services are operating with high availability.",
  },

  {
    id: 4,
    title: "Marketing Analytics Report",
    category: "Analytics",
    period: "This Month",
    value: "2.4M",
    change: "+18%",
    status: "Growing",
    updated: "Yesterday",
    description:
      "Audience reach and campaign engagement showed positive growth.",
  },

  {
    id: 5,
    title: "Revenue Summary Report",
    category: "Revenue",
    period: "This Month",
    value: "₹8.45L",
    change: "+16%",
    status: "Growing",
    updated: "Yesterday",
    description:
      "Platform revenue increased because of improved campaign performance.",
  },
];


function AdminReports() {

  const [period, setPeriod] =
    useState("This Month");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [selectedReportId, setSelectedReportId] =
    useState(1);


  const filteredReports = useMemo(() => {

    return reportData.filter((report) => {

      const searchMatch =

        report.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        report.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const categoryMatch =

        category === "All" ||

        report.category === category;


      return (
        searchMatch &&
        categoryMatch
      );

    });

  }, [
    search,
    category,
  ]);


  const selectedReport =

    reportData.find(

      (report) =>

        report.id ===
        selectedReportId

    ) ||

    reportData[0];


  const downloadPDF = () => {

    const pdf = new jsPDF();


    pdf.setFontSize(20);

    pdf.text(
      "Admin Platform Report",
      14,
      20
    );


    pdf.setFontSize(11);

    pdf.text(
      `Period: ${period}`,
      14,
      29
    );


    pdf.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      36
    );


    autoTable(
      pdf,
      {
        startY: 45,

        head: [
          [
            "Report",
            "Category",
            "Value",
            "Growth",
            "Status",
            "Updated",
          ],
        ],

        body:

          filteredReports.map(
            (report) => [

              report.title,

              report.category,

              report.value,

              report.change,

              report.status,

              report.updated,

            ]
          ),

      }
    );


    pdf.save(
      "admin-platform-report.pdf"
    );

  };


  const downloadExcel = () => {

    const excelData =

      filteredReports.map(
        (report) => ({

          Report:
            report.title,

          Category:
            report.category,

          Value:
            report.value,

          Growth:
            report.change,

          Status:
            report.status,

          Updated:
            report.updated,

          Description:
            report.description,

        })
      );


    const worksheet =

      XLSX.utils.json_to_sheet(
        excelData
      );


    const workbook =

      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Admin Reports"

    );


    XLSX.writeFile(

      workbook,

      "admin-platform-report.xlsx"

    );

  };


  const downloadCSV = () => {

    const csvHeader =

      "Report,Category,Value,Growth,Status,Updated\n";


    const csvRows =

      filteredReports.map(
        (report) =>

          `"${report.title}",` +

          `"${report.category}",` +

          `"${report.value}",` +

          `"${report.change}",` +

          `"${report.status}",` +

          `"${report.updated}"`
      );


    const csvContent =

      csvHeader +

      csvRows.join("\n");


    const blob = new Blob(

      [csvContent],

      {
        type:
          "text/csv;charset=utf-8;",
      }

    );


    const url =

      URL.createObjectURL(
        blob
      );


    const link =

      document.createElement(
        "a"
      );


    link.href = url;


    link.download =

      "admin-platform-report.csv";


    link.click();


    URL.revokeObjectURL(
      url
    );

  };


  const getStatusStyle = (
    status
  ) => {

    if (
      status === "Healthy" ||
      status === "Secure" ||
      status === "Excellent"
    ) {

      return (
        "bg-green-100 " +
        "text-green-700"
      );

    }


    if (
      status === "Growing"
    ) {

      return (
        "bg-blue-100 " +
        "text-blue-700"
      );

    }


    return (
      "bg-orange-100 " +
      "text-orange-700"
    );

  };


  return (

    <div className="space-y-7">


      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">


        <div>

          <p className="text-blue-600 font-semibold">

            Platform Administration

          </p>


          <h1 className="text-3xl font-bold mt-1">

            Admin Reports

          </h1>


          <p className="text-gray-500 mt-2">

            Monitor platform users,
            security, performance,
            analytics and revenue.

          </p>

        </div>


        <div className="flex flex-wrap gap-3">


          <select

            value={period}

            onChange={(event) =>

              setPeriod(
                event.target.value
              )

            }

            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              bg-white
            "

          >

            <option>

              This Week

            </option>

            <option>

              This Month

            </option>

            <option>

              Last 3 Months

            </option>

            <option>

              This Year

            </option>

          </select>


          <button

            type="button"

            onClick={
              downloadPDF
            }

            className="
              flex
              items-center
              gap-2
              bg-red-600
              hover:bg-red-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
            "

          >

            <FileText
              size={18}
            />

            PDF

          </button>


          <button

            type="button"

            onClick={
              downloadExcel
            }

            className="
              flex
              items-center
              gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
            "

          >

            <FileSpreadsheet
              size={18}
            />

            Excel

          </button>


          <button

            type="button"

            onClick={
              downloadCSV
            }

            className="
              flex
              items-center
              gap-2
              bg-blue-700
              hover:bg-blue-800
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
            "

          >

            <FileDown
              size={18}
            />

            CSV

          </button>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">


        <div className="
          bg-white
          border
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="
            w-12
            h-12
            bg-blue-100
            text-blue-700
            rounded-xl
            flex
            items-center
            justify-center
          ">

            <Users size={24} />

          </div>


          <p className="
            text-gray-500
            mt-5
          ">

            Total Users

          </p>


          <h2 className="
            text-3xl
            font-bold
            mt-1
          ">

            12,480

          </h2>


          <p className="
            text-green-600
            text-sm
            mt-2
          ">

            +12% growth

          </p>

        </div>


        <div className="
          bg-white
          border
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="
            w-12
            h-12
            bg-green-100
            text-green-700
            rounded-xl
            flex
            items-center
            justify-center
          ">

            <UserCheck
              size={24}
            />

          </div>


          <p className="
            text-gray-500
            mt-5
          ">

            Active Users

          </p>


          <h2 className="
            text-3xl
            font-bold
            mt-1
          ">

            11,820

          </h2>


          <p className="
            text-green-600
            text-sm
            mt-2
          ">

            94.7% active

          </p>

        </div>


        <div className="
          bg-white
          border
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="
            w-12
            h-12
            bg-purple-100
            text-purple-700
            rounded-xl
            flex
            items-center
            justify-center
          ">

            <ShieldCheck
              size={24}
            />

          </div>


          <p className="
            text-gray-500
            mt-5
          ">

            Security Score

          </p>


          <h2 className="
            text-3xl
            font-bold
            mt-1
          ">

            98.7%

          </h2>


          <p className="
            text-green-600
            text-sm
            mt-2
          ">

            Platform secure

          </p>

        </div>


        <div className="
          bg-white
          border
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="
            w-12
            h-12
            bg-orange-100
            text-orange-700
            rounded-xl
            flex
            items-center
            justify-center
          ">

            <Activity
              size={24}
            />

          </div>


          <p className="
            text-gray-500
            mt-5
          ">

            System Uptime

          </p>


          <h2 className="
            text-3xl
            font-bold
            mt-1
          ">

            99.9%

          </h2>


          <p className="
            text-blue-600
            text-sm
            mt-2
          ">

            Running normally

          </p>

        </div>

      </div>


      {/* AI SUMMARY */}

      <div className="
        bg-gradient-to-r
        from-blue-700
        to-purple-800
        rounded-2xl
        p-7
        text-white
      ">

        <div className="
          flex
          gap-4
        ">

          <div className="
            bg-white/20
            p-3
            rounded-xl
            h-fit
          ">

            <TrendingUp
              size={25}
            />

          </div>


          <div>

            <p className="
              text-blue-200
              text-sm
            ">

              AI Executive Summary

            </p>


            <h2 className="
              text-2xl
              font-bold
              mt-1
            ">

              Platform Performance
              is Stable

            </h2>


            <p className="
              text-blue-100
              mt-3
              max-w-4xl
            ">

              User growth increased
              by 12%, platform uptime
              remains at 99.9%, and
              security protection is
              strong. Seven unusual
              login attempts require
              administrator review.

            </p>

          </div>

        </div>

      </div>


      {/* SEARCH */}

      <div className="
        bg-white
        border
        rounded-2xl
        p-5
        shadow-sm
      ">

        <div className="
          flex
          flex-col
          lg:flex-row
          gap-4
          lg:items-center
          lg:justify-between
        ">


          <div className="
            relative
            w-full
            lg:w-96
          ">

            <Search

              size={19}

              className="
                absolute
                left-4
                top-4
                text-gray-400
              "

            />


            <input

              type="text"

              value={search}

              onChange={(event) =>

                setSearch(
                  event.target.value
                )

              }

              placeholder="
                Search reports...
              "

              className="
                w-full
                border
                rounded-xl
                pl-11
                pr-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "

            />

          </div>


          <select

            value={category}

            onChange={(event) =>

              setCategory(
                event.target.value
              )

            }

            className="
              border
              rounded-xl
              px-4
              py-3
              bg-white
            "

          >

            <option value="All">

              All Categories

            </option>

            <option value="Users">

              Users

            </option>

            <option value="Security">

              Security

            </option>

            <option value="Performance">

              Performance

            </option>

            <option value="Analytics">

              Analytics

            </option>

            <option value="Revenue">

              Revenue

            </option>

          </select>

        </div>

      </div>


      {/* REPORT TABLE */}

      <div className="
        bg-white
        border
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">

        <div className="
          p-6
          border-b
        ">

          <h2 className="
            text-xl
            font-bold
          ">

            Platform Reports

          </h2>


          <p className="
            text-sm
            text-gray-500
            mt-1
          ">

            Showing
            {" "}
            {filteredReports.length}
            {" "}
            reports

          </p>

        </div>


        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            min-w-[900px]
          ">

            <thead className="
              bg-gray-50
            ">

              <tr>

                <th className="
                  text-left
                  p-4
                ">

                  Report

                </th>


                <th className="
                  text-left
                  p-4
                ">

                  Category

                </th>


                <th className="
                  text-left
                  p-4
                ">

                  Value

                </th>


                <th className="
                  text-left
                  p-4
                ">

                  Growth

                </th>


                <th className="
                  text-left
                  p-4
                ">

                  Status

                </th>


                <th className="
                  text-left
                  p-4
                ">

                  Action

                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReports.map(
                (report) => (

                  <tr

                    key={report.id}

                    className="
                      border-t
                      hover:bg-gray-50
                    "

                  >

                    <td className="
                      p-4
                      font-semibold
                    ">

                      {report.title}

                    </td>


                    <td className="
                      p-4
                    ">

                      {report.category}

                    </td>


                    <td className="
                      p-4
                      font-bold
                    ">

                      {report.value}

                    </td>


                    <td className="
                      p-4
                      text-green-600
                      font-semibold
                    ">

                      {report.change}

                    </td>


                    <td className="
                      p-4
                    ">

                      <span

                        className={

                          `
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${getStatusStyle(
                            report.status
                          )}
                          `

                        }

                      >

                        {report.status}

                      </span>

                    </td>


                    <td className="
                      p-4
                    ">

                      <button

                        type="button"

                        onClick={() =>

                          setSelectedReportId(
                            report.id
                          )

                        }

                        className="
                          flex
                          items-center
                          gap-2
                          text-blue-700
                          bg-blue-50
                          hover:bg-blue-100
                          px-3
                          py-2
                          rounded-lg
                          font-semibold
                        "

                      >

                        <Eye
                          size={17}
                        />

                        View

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* SELECTED REPORT */}

      <div className="
        bg-white
        border
        rounded-2xl
        p-7
        shadow-sm
      ">

        <div className="
          flex
          items-start
          gap-4
        ">

          <div className="
            bg-blue-100
            text-blue-700
            p-3
            rounded-xl
          ">

            <FileText
              size={25}
            />

          </div>


          <div>

            <p className="
              text-blue-600
              font-semibold
              text-sm
            ">

              Selected Report

            </p>


            <h2 className="
              text-2xl
              font-bold
              mt-1
            ">

              {selectedReport.title}

            </h2>


            <p className="
              text-gray-500
              mt-3
              max-w-3xl
            ">

              {selectedReport.description}

            </p>


            <div className="
              flex
              flex-wrap
              gap-5
              mt-5
              text-sm
            ">

              <span>

                <strong>
                  Category:
                </strong>

                {" "}

                {selectedReport.category}

              </span>


              <span>

                <strong>
                  Value:
                </strong>

                {" "}

                {selectedReport.value}

              </span>


              <span>

                <strong>
                  Updated:
                </strong>

                {" "}

                {selectedReport.updated}

              </span>

            </div>

          </div>

        </div>

      </div>


      {/* REPORT STATUS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">


        <div className="
          bg-white
          border
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <CheckCircle2
              className="
                text-green-600
              "
            />


            <div>

              <p className="
                font-bold
              ">

                Reports Updated

              </p>


              <p className="
                text-sm
                text-gray-500
              ">

                Latest data available

              </p>

            </div>

          </div>

        </div>


        <div className="
          bg-white
          border
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <Calendar
              className="
                text-blue-600
              "
            />


            <div>

              <p className="
                font-bold
              ">

                Report Schedule

              </p>


              <p className="
                text-sm
                text-gray-500
              ">

                Monthly generation

              </p>

            </div>

          </div>

        </div>


        <div className="
          bg-orange-50
          border
          border-orange-200
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <AlertTriangle
              className="
                text-orange-600
              "
            />


            <div>

              <p className="
                font-bold
              ">

                Security Review

              </p>


              <p className="
                text-sm
                text-gray-600
              ">

                7 login alerts detected

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


export default AdminReports;