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
