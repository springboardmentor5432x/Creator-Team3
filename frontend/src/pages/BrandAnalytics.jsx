import React from "react";

import BrandKPICards from "../components/dashboard/BrandKPICards";
import CampaignChart from "../components/analytics/CampaignChart";
import BrandEngagement from "../components/analytics/BrandEngagement";

export default function BrandAnalytics() {
  return (
    <div className="brand-page-container">

      <div className="brand-page-header">
        <div>
          <h1>Brand Analytics</h1>
          <p>
            Analyze your campaign performance and audience engagement.
          </p>
        </div>
      </div>

      <BrandKPICards />

      <div className="brand-chart-grid">

        <div className="brand-chart-card">
          <CampaignChart />
        </div>

        <div className="brand-chart-card">
          <BrandEngagement />
        </div>

      </div>

    </div>
  );
}