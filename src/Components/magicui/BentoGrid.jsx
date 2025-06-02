import React from "react";

export const BentoGrid = ({ children }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "1rem",
      padding: "1rem",
      backdropFilter: "blur(10px)",
      background: "rgba(0,0,0,0.2)",
      borderRadius: "1rem"
    }}>
      {children}
    </div>
  );
};

export const BentoCard = ({ title, value }) => {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "1rem",
      padding: "1rem",
      textAlign: "center",
      color: "lightcyan"
    }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
