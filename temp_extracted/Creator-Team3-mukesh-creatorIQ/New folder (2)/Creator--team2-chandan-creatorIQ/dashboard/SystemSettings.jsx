import React from "react";

function SystemSettings() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        System Settings
      </h1>

      <div className="bg-white rounded-xl shadow p-8 space-y-6">

        <label className="flex justify-between">

          Dark Mode

          <input type="checkbox" />

        </label>

        <label className="flex justify-between">

          Email Notifications

          <input type="checkbox" defaultChecked />

        </label>

        <label className="flex justify-between">

          Enable Analytics

          <input type="checkbox" defaultChecked />

        </label>

      </div>

    </div>
  );
}

export default SystemSettings;