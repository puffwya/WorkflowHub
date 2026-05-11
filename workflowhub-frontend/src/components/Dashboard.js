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

  if (error) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Overview of your task workflow
        </p>
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.value}>{summary.todo}</div>
          <div style={styles.label}>To Do</div>
        </div>

        <div style={styles.card}>
          <div style={styles.value}>{summary.inProgress}</div>
          <div style={styles.label}>In Progress</div>
        </div>

        <div style={styles.card}>
          <div style={styles.value}>{summary.review}</div>
          <div style={styles.label}>Review</div>
        </div>

        <div style={styles.card}>
          <div style={styles.value}>{summary.done}</div>
          <div style={styles.label}>Done</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   STYLES
------------------------- */
const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f4f7fb",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  card: {
    backgroundColor: "white",
    padding: "22px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    textAlign: "center",
  },

  value: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#111827",
  },

  label: {
    marginTop: "6px",
    fontSize: "0.95rem",
    color: "#6b7280",
    fontWeight: "600",
  },

  loading: {
    color: "#6b7280",
  },

  error: {
    color: "#dc2626",
  },
};

export default Dashboard;
