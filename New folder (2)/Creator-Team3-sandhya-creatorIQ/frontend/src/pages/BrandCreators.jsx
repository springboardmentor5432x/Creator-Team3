import React from "react";

export default function BrandCreators() {
  return (
    <div className="brand-page-container">

      <div className="brand-page-header">
        <div>
          <h1>Creators</h1>
          <p>Discover and manage creators for your campaigns.</p>
        </div>

        <button className="create-campaign-btn">
          + Find Creators
        </button>
      </div>

      <div className="brand-content-card">

        <h2>Available Creators</h2>

        <div className="creator-list">

          <div className="creator-item">
            <div className="creator-small-avatar">
              AS
            </div>

            <div className="creator-info">
              <h3>Alex Smith</h3>
              <p>Technology • 125K Followers</p>
            </div>

            <span className="creator-status">
              Available
            </span>
          </div>


          <div className="creator-item">
            <div className="creator-small-avatar">
              JM
            </div>

            <div className="creator-info">
              <h3>Jamie Miller</h3>
              <p>Fashion • 98K Followers</p>
            </div>

            <span className="creator-status">
              Available
            </span>
          </div>


          <div className="creator-item">
            <div className="creator-small-avatar">
              RK
            </div>

            <div className="creator-info">
              <h3>Ryan Kumar</h3>
              <p>Fitness • 210K Followers</p>
            </div>

            <span className="creator-status">
              Available
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}