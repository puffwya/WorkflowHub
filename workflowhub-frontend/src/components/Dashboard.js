import React, { useEffect, useState } from "react";
import API_BASE from "../api";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/task-summary`)
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

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
