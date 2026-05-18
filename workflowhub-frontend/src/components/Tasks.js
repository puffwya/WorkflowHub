import React, { useEffect, useState, useCallback } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import apiClient from "../apiClient";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 5;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiClient.get("/tasks", {
        params: {
          status: status || undefined,
          priority: priority || undefined,
          search: search || undefined,
          projectId: projectId || undefined,
          page,
          pageSize,
        },
      });

      setTasks(res.data.items);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, [status, priority, search, page, projectId, pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}/status`, null, {
        params: { status: newStatus },
      });

      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task");
    }
  };

  // request status change
  const requestStatusChange = async (taskId, newStatus) => {
    try {
      await apiClient.post(
        `/tasks/${taskId}/status-request`,
        newStatus,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Status change request submitted");
    } catch (err) {
      console.error("Failed to request status change", err);
      alert("Failed to request status change");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>
          Loading tasks...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>

          <p style={styles.subtitle}>
            Track and manage your workflow tasks
          </p>
        </div>

        <Link to="/tasks/new" style={styles.createButton}>
          + Create Task
        </Link>
      </div>

      {projectId && (
        <div style={styles.projectFilter}>
          Filtering by Project ID: {projectId}
        </div>
      )}

      <div style={styles.filterBar}>
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={styles.input}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="0">To Do</option>
          <option value="1">In Progress</option>
          <option value="2">Review</option>
          <option value="3">Done</option>
        </select>

        <select
          value={priority}
          onChange={(e) => {
            setPage(1);
            setPriority(e.target.value);
          }}
          style={styles.select}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr
                key={t.id}
                style={styles.row}
                onClick={() => navigate(`/tasks/${t.id}`)}
              >
                <td style={styles.td}>{t.title}</td>

                <td style={styles.td}>
                  <select
                    value={t.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="0">To Do</option>
                    <option value="1">In Progress</option>
                    <option value="2">Review</option>
                    <option value="3">Done</option>
                  </select>
                </td>

                <td style={styles.td}>{t.priority}</td>

                <td style={styles.td}>
                  {new Date(t.dueDate).toLocaleDateString()}
                </td>

                <td style={styles.td}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(t.id);
                    }}
                    style={styles.deleteButton}
                    title="Delete Task"
                  >
                    ✕
                  </button>

                  {/* request change button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestStatusChange(t.id, t.status);
                    }}
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "#e0e7ff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={styles.pageButton}
        >
          Prev
        </button>

        <span style={styles.pageText}>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          style={styles.pageButton}
        >
          Next
        </button>
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
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#6b7280",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
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
  createButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "14px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
  },
  projectFilter: {
    marginBottom: "20px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "12px 16px",
    borderRadius: "10px",
    display: "inline-block",
  },
  filterBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    minWidth: "220px",
    fontSize: "0.95rem",
  },
  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "18px",
    backgroundColor: "#f9fafb",
    color: "#374151",
    fontSize: "0.9rem",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "18px",
    borderBottom: "1px solid #f1f5f9",
    color: "#111827",
  },
  row: {
    transition: "background-color .15s ease",
    cursor: "pointer",
  },
  statusSelect: {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
  pagination: {
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  pageButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  pageText: {
    color: "#374151",
    fontWeight: "500",
  },
};

export default Tasks;
