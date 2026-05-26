import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState("");
  const [error, setError] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // TASK SUMMARY
        const summaryRes = await apiClient.get("/dashboard/task-summary");
        setSummary(summaryRes.data);

        // DAILY REPORT
        const reportRes = await apiClient.get("/dashboard/report");
        setReport(reportRes.data.report);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setReportLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const goToTasks = () => {
    navigate("/tasks");
  };

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
        <div style={styles.card} onClick={goToTasks}>
          <div style={styles.value}>{summary.todo}</div>
          <div style={styles.label}>To Do</div>
        </div>

        <div style={styles.card} onClick={goToTasks}>
          <div style={styles.value}>{summary.inProgress}</div>
          <div style={styles.label}>In Progress</div>
        </div>

        <div style={styles.card} onClick={goToTasks}>
          <div style={styles.value}>{summary.review}</div>
          <div style={styles.label}>Review</div>
        </div>

        <div style={styles.card} onClick={goToTasks}>
          <div style={styles.value}>{summary.done}</div>
          <div style={styles.label}>Done</div>
        </div>
      </div>

      {/* (fake for now) AI / Insight Section */}
      <div style={styles.reportContainer}>
        <h2 style={styles.reportTitle}>Daily Insight</h2>

        {reportLoading ? (
          <p style={styles.loading}>Generating insight...</p>
        ) : (
          <pre style={styles.reportText}>
            {report}
          </pre>
        )}
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
    cursor: "pointer",
    transition: "all 0.2s ease",
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

  reportContainer: {
    marginTop: "30px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  reportTitle: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#111827",
  },

  reportText: {
    whiteSpace: "pre-wrap",
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: "1.5",
  },

  loading: {
    color: "#6b7280",
  },

  error: {
    color: "#dc2626",
  },
};

export default Dashboard;
