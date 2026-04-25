import React, { useEffect, useState } from "react";
import API_BASE from "../api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard/task-summary`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard data");
      }
    };

    fetchSummary();
  }, []);

  if (error) return <p>{error}</p>;
  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h2>Task Summary</h2>
      <ul>
        <li>To Do: {summary.todo}</li>
        <li>In Progress: {summary.inProgress}</li>
        <li>Review: {summary.review}</li>
        <li>Done: {summary.done}</li>
      </ul>
    </div>
  );
}

export default Dashboard;
