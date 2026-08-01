import React from "react";

export default function AudienceForecast() {
  return (
    <div className="growth-card">
      <h3>Audience Growth Forecast</h3>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Expected Followers</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>30 Days</td>
            <td>135,000</td>
          </tr>

          <tr>
            <td>60 Days</td>
            <td>148,000</td>
          </tr>

          <tr>
            <td>90 Days</td>
            <td>165,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}