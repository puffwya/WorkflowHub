import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get("/dashboard/task-summary");
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      }
    };

    fetchSummary();
  }, []);

  if (error) return <p>{error}</p>;
  if (!summary) return <p>Loading...</p>;

  const cardStyle = {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    background: "#f5f5f5",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const containerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Dashboard</h2>

      <h4 style={{ marginBottom: "10px" }}>Tasks</h4>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1>{summary.todo}</h1>
          <p>To Do</p>
        </div>

        <div style={cardStyle}>
          <h1>{summary.inProgress}</h1>
          <p>In Progress</p>
        </div>

        <div style={cardStyle}>
          <h1>{summary.review}</h1>
          <p>Review</p>
        </div>

        <div style={cardStyle}>
          <h1>{summary.done}</h1>
          <p>Done</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
