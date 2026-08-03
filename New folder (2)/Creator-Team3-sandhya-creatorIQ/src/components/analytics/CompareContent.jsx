import React, { useEffect, useState } from "react";

export default function CompareContent() {
  const [compare, setCompare] = useState({
    left: {},
    right: {}
  });

  useEffect(() => {
    const fetchCompare = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/analytics/compare",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setCompare({
          left: data.left || {},
          right: data.right || {}
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompare();
  }, []);

  return (
    <div className="compare-card">
      <h3 className="section-title">⚖️ Compare Content</h3>
      <div className="compare-grid">
        <div className="compare-box">
          <h4>{compare.left.title}</h4>
          <p>Views : {compare.left.views}</p>
          <p>Engagement : {compare.left.engagement}</p>
        </div>
        <div className="compare-box">
          <h4>{compare.right.title}</h4>
          <p>Views : {compare.right.views}</p>
          <p>Engagement : {compare.right.engagement}</p>
        </div>
      </div>
    </div>
  );
}
