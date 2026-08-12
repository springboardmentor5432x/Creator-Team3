import React from "react";

export default function BrandCampaigns() {
  return (
    <div className="brand-page-container">

      <div className="brand-page-header">
        <div>
          <h1>Campaigns</h1>
          <p>Manage and monitor your brand campaigns.</p>
        </div>

        <button className="create-campaign-btn">
          + Create Campaign
        </button>
      </div>

      <div className="brand-content-card">

        <h2>Campaign Management</h2>

        <div className="campaign-list">

          <div className="campaign-item">
            <div>
              <h3>Summer Product Launch</h3>
              <p>24 creators • 2.4M reach</p>
            </div>

            <span className="status active-status">
              Active
            </span>
          </div>

          <div className="campaign-item">
            <div>
              <h3>Influencer Awareness</h3>
              <p>18 creators • 1.8M reach</p>
            </div>

            <span className="status active-status">
              Active
            </span>
          </div>

          <div className="campaign-item">
            <div>
              <h3>New Product Campaign</h3>
              <p>12 creators • 950K reach</p>
            </div>

            <span className="status completed-status">
              Completed
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}