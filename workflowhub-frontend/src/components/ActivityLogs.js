import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [taskId, setTaskId] = useState("");

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try {
      const res = await apiClient.get("/activity", {
        params: {
          action: action || undefined,
          userId: userId || undefined,
          taskId: taskId || undefined,
        },
      });

      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  }, [action, userId, taskId]);

  const fetchDropdownData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        apiClient.get("/users"),
        apiClient.get("/tasks?page=1&pageSize=100"),
      ]);

      setUsers(usersRes.data);
      setTasks(tasksRes.data.items);
    } catch (err) {
      console.error("Failed to load dropdown data", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Activity Logs</h1>
          <p style={styles.subtitle}>
            System audit trail and user activity tracking
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterCard}>
        <input
          placeholder="Search action..."
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={styles.input}
        />

        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.select}
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          style={styles.select}
        >
          <option value="">All Tasks</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Logs */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Details</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Entity</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={styles.row}>
                <td style={styles.td}>
                  <span style={styles.actionBadge}>
                    {log.action}
                  </span>
                </td>

                <td style={styles.td}>{log.details}</td>

                <td style={styles.td}>
                  {log.username || "Unknown"}
                </td>

                <td style={styles.td}>
                  {log.taskId ? (
                    <button
                      style={styles.linkButton}
                      onClick={() =>
                        navigate(`/tasks?taskId=${log.taskId}`)
                      }
                    >
                      View Task
                    </button>
                  ) : log.projectId ? (
                    <button
                      style={styles.linkButton}
                      onClick={() =>
                        navigate(`/projects/${log.projectId}`)
                      }
                    >
                      View Project
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                <td style={styles.td}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    marginTop: "8px",
    color: "#6b7280",
  },

  filterCard: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    minWidth: "200px",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },

  tableCard: {
    backgroundColor: "white",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    color: "#111827",
    verticalAlign: "top",
  },

  row: {
    transition: "background-color 0.15s ease",
  },

  actionBadge: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },

  linkButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
};

export default ActivityLogs;
