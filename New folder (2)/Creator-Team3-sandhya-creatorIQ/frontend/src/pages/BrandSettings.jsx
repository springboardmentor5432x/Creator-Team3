import React, { useEffect, useState } from "react";

export default function BrandSettings() {
  const [settings, setSettings] = useState({
    campaignNotifications: true,
    creatorUpdates: true,
    emailReports: true,
    campaignVisibility: true,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "brandSettings"
    );

    if (savedSettings) {
      setSettings(
        JSON.parse(savedSettings)
      );
    }
  }, []);

  const handleChange = (event) => {
    const {
      name,
      checked,
    } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "brandSettings",
      JSON.stringify(settings)
    );

    setMessage(
      "Brand settings saved successfully."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="settings-page">

      <div className="settings-container">

        <div className="settings-header">
          <h1>Brand Settings</h1>

          <p>
            Manage your brand and campaign preferences.
          </p>
        </div>


        {message && (
          <div className="settings-success">
            {message}
          </div>
        )}


        <div className="settings-card">

          <h2>Campaign Notifications</h2>


          <label className="setting-row">

            <div>
              <strong>Campaign Updates</strong>

              <p>
                Receive updates about your active campaigns.
              </p>
            </div>

            <input
              type="checkbox"
              name="campaignNotifications"
              checked={
                settings.campaignNotifications
              }
              onChange={handleChange}
            />

          </label>


          <label className="setting-row">

            <div>
              <strong>Creator Updates</strong>

              <p>
                Receive updates about partnered creators.
              </p>
            </div>

            <input
              type="checkbox"
              name="creatorUpdates"
              checked={
                settings.creatorUpdates
              }
              onChange={handleChange}
            />

          </label>

        </div>


        <div className="settings-card">

          <h2>Reports & Privacy</h2>


          <label className="setting-row">

            <div>
              <strong>Email Reports</strong>

              <p>
                Receive campaign performance reports.
              </p>
            </div>

            <input
              type="checkbox"
              name="emailReports"
              checked={
                settings.emailReports
              }
              onChange={handleChange}
            />

          </label>


          <label className="setting-row">

            <div>
              <strong>Campaign Visibility</strong>

              <p>
                Allow campaign analytics to be visible to collaborators.
              </p>
            </div>

            <input
              type="checkbox"
              name="campaignVisibility"
              checked={
                settings.campaignVisibility
              }
              onChange={handleChange}
            />

          </label>

        </div>


        <button
          className="settings-save-button"
          onClick={handleSave}
        >
          Save Brand Settings
        </button>

      </div>


      <style>{`

        .settings-page {
          min-height: 100vh;
          background: #080c14;
          color: #f8fafc;
          padding: 40px;
        }

        .settings-container {
          max-width: 900px;
          margin: auto;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .settings-header p {
          color: #94a3b8;
        }

        .settings-card {
          background: #111827;
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .settings-card h2 {
          margin-bottom: 20px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 0;
          border-bottom: 1px solid #1e293b;
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-row p {
          color: #94a3b8;
          margin-top: 6px;
          font-size: 14px;
        }

        .setting-row input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .settings-save-button {
          padding: 14px 25px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #8b5cf6
          );
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .settings-success {
          background: #064e3b;
          color: #6ee7b7;
          padding: 14px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

      `}</style>

    </div>
  );
}