const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "12px 16px",
        color: "#fff",
        minWidth: "220px",
        maxWidth: "300px",
        whiteSpace: "normal",
        wordBreak: "break-word",
        boxShadow: "0 8px 24px rgba(0,0,0,.35)",
      }}
    >
      {label && (
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            color: "#fff",
            fontSize: "14px",
          }}
        >
          {label}
        </div>
      )}

      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: entry.color,
              marginRight: 8,
            }}
          />

          <span
            style={{
              flex: 1,
              color: "#fff",
              whiteSpace: "normal",
            }}
          >
            {entry.name}
          </span>

          <span
            style={{
              color: entry.color,
              fontWeight: 700,
              marginLeft: 12,
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;