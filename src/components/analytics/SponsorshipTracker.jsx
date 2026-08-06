import React from "react";

export default function SponsorshipTracker() {
  const sponsorships = [
    {
      brand: "Nike",
      campaign: "Fitness Challenge",
      amount: 2500,
      status: "Active",
      payment: "Paid"
    },
    {
      brand: "Samsung",
      campaign: "Galaxy Promotion",
      amount: 4200,
      status: "Completed",
      payment: "Paid"
    },
    {
      brand: "Amazon",
      campaign: "Prime Day Campaign",
      amount: 1800,
      status: "Pending",
      payment: "Pending"
    },
    {
      brand: "Adobe",
      campaign: "Creator Tools",
      amount: 3000,
      status: "Active",
      payment: "Overdue"
    }
  ];

  return (
    <div className="table-card">
      <h2
        style={{
          marginBottom: "1.5rem"
        }}
      >
        🤝 Sponsorship Tracker
      </h2>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Campaign</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {sponsorships.map((item, index) => (
            <tr key={index}>
              <td>{item.brand}</td>

              <td>{item.campaign}</td>

              <td
                style={{
                  color: "#10b981",
                  fontWeight: "700"
                }}
              >
                ${item.amount.toLocaleString()}
              </td>

              <td>
                <span
                  className={`status-pill ${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>
              </td>

              <td>
                <span
                  className={`status-pill ${item.payment.toLowerCase()}`}
                >
                  {item.payment}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}