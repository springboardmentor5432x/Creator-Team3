import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#020617",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "3rem", margin: "0 0 10px 0", color: "#f87171" }}>403 - Forbidden</h1>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>You do not have permission to view this dashboard.</p>
      <Link to="/" style={{
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: "bold",
        border: "1px solid #3b82f6",
        padding: "8px 16px",
        borderRadius: "8px"
      }}>Go Home</Link>
    </div>
  );
}
