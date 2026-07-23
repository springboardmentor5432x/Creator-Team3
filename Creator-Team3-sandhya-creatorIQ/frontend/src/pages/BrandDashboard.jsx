import React from "react";

import Navbar from "../components/layout/Navbar";
import BrandSidebar from "../components/layout/BrandSidebar";

import BrandKPICards from "../components/dashboard/BrandKPICards";
import CampaignChart from "../components/analytics/CampaignChart";
import BrandEngagement from "../components/analytics/BrandEngagement";

export default function BrandDashboard() {
  return (
    <div className="brand-dashboard">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* SIDEBAR + CONTENT */}
      <div className="brand-dashboard-body">

        {/* LEFT SIDEBAR */}
        <BrandSidebar />

        {/* MAIN CONTENT */}
        <main className="brand-main-content">

          {/* WELCOME */}
          <section className="brand-welcome">

            <div>
              <h1>Welcome Back 👋</h1>

              <p>
                Here's what's happening with your campaigns today.
              </p>
            </div>

            <button className="create-campaign-btn">
              + Create Campaign
            </button>

          </section>


          {/* BRAND ANALYTICS */}
          <section className="brand-kpi-section">

            <div className="brand-section-heading">

              <h2>Brand Analytics</h2>

              <p>
                Monitor your brand performance and campaign growth
              </p>

            </div>

            <BrandKPICards />

          </section>


          {/* CAMPAIGN ANALYTICS */}
          <section className="brand-analytics-section">

            <div className="brand-section-heading">

              <h2>Campaign Analytics</h2>

              <p>
                Track your campaign performance over time
              </p>

            </div>

            <div className="brand-chart-grid">

              <div className="brand-chart-card">
                <CampaignChart />
              </div>

              <div className="brand-chart-card">
                <BrandEngagement />
              </div>

            </div>

          </section>


          {/* RECENT CAMPAIGNS */}
          <section className="brand-campaign-summary">

            <div className="brand-section-heading">

              <h2>Recent Campaigns</h2>

              <p>
                Overview of your active campaigns
              </p>

            </div>

            <div className="campaign-table-wrapper">

              <table className="campaign-table">

                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Creators</th>
                    <th>Reach</th>
                    <th>Engagement</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>Summer Product Launch</td>
                    <td>24</td>
                    <td>2.4M</td>
                    <td>8.7%</td>
                    <td>
                      <span className="status active-status">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Influencer Awareness</td>
                    <td>18</td>
                    <td>1.8M</td>
                    <td>7.2%</td>
                    <td>
                      <span className="status active-status">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>New Product Campaign</td>
                    <td>12</td>
                    <td>950K</td>
                    <td>5.8%</td>
                    <td>
                      <span className="status completed-status">
                        Completed
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}