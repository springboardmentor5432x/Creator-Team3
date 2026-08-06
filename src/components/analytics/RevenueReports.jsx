import React from "react";

export default function RevenueReports() {
  const reports = [
    {
      name: "Monthly Revenue Report",
      category: "Revenue",
      generatedOn: "2026-08-01",
      revenue: 18500,
      status: "Completed"
    },
    {
      name: "Platform Earnings Report",
      category: "Platform",
      generatedOn: "2026-08-02",
      revenue: 12400,
      status: "Completed"
    },
    {
      name: "Sponsorship Revenue Report",
      category: "Sponsorship",
      generatedOn: "2026-08-03",
      revenue: 8900,
      status: "Completed"
    },
    {
      name: "Affiliate Revenue Report",
      category: "Affiliate",
      generatedOn: "2026-08-04",
      revenue: 4200,
      status: "Processing"
    },
    {
      name: "Subscription Revenue Report",
      category: "Subscription",
      generatedOn: "2026-08-05",
      revenue: 6700,
      status: "Completed"
    }
  ];

  const handleExportCSV = () => {
    alert("CSV Report Exported");
  };

  const handleExportPDF = () => {
    alert("PDF Report Exported");
  };

  return (
    <div className="revenue-dashboard">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h2>📄 Revenue Reports Center</h2>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >
          <button
            className="export-btn"
            onClick={handleExportCSV}
          >
            Export CSV
          </button>

          <button
            className="export-btn"
            onClick={handleExportPDF}
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="revenue-kpi-grid">

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Reports Generated
          </span>

          <span className="kpi-value">
            25
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Last Generated
          </span>

          <span className="kpi-value">
            Today
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Export Count
          </span>

          <span className="kpi-value">
            142
          </span>
        </div>

        <div className="kpi-summary-card">
          <span className="kpi-label">
            Revenue Audits
          </span>

          <span className="kpi-value">
            12
          </span>
        </div>

      </div>

      <div className="table-card">

        <h4
          className="chart-card-title"
          style={{ marginBottom: "1rem" }}
        >
          Revenue Reports History
        </h4>

        <table className="custom-table">

          <thead>
            <tr>
              <th>Report Name</th>
              <th>Category</th>
              <th>Generated On</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>

                <td>{report.name}</td>

                <td>{report.category}</td>

                <td>{report.generatedOn}</td>

                <td
                  style={{
                    color: "#10b981",
                    fontWeight: "700"
                  }}
                >
                  $
                  {report.revenue.toLocaleString()}
                </td>

                <td>
                  <span
                    className={`status-pill ${report.status.toLowerCase()}`}
                  >
                    {report.status}
                  </span>
                </td>

                <td>
                  <button
                    className="export-btn"
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.75rem"
                    }}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <div className="insights-box">

        <h3>📊 Report Insights</h3>

        <ul className="insights-list">
          <li>
            Sponsorship revenue increased 18% this month.
          </li>

          <li>
            Subscription earnings remain the most stable source.
          </li>

          <li>
            Affiliate revenue shows strong growth potential.
          </li>

          <li>
            Platform diversification reduced revenue risk.
          </li>
        </ul>

      </div>

    </div>
  );
}