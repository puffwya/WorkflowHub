import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

function ProjectDetail() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // -------------------------
  // Fetch tasks
  // -------------------------
  const fetchTasks = useCallback(async () => {
    try {
      const res = await apiClient.get(`/tasks/project/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, [id]);

  // -------------------------
  // Fetch users
  // -------------------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiClient.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, []);

  // -------------------------
  // Fetch assigned users
  // -------------------------
  const fetchAssignedUsers = useCallback(async () => {
    try {
      const res = await apiClient.get(`/projects/${id}/users`);
      setAssignedUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned users", err);
    }
  }, [id]);

  // -------------------------
  // Assign user
  // -------------------------
  const handleAssign = async () => {
    if (!selectedUser) return;

    try {
      await apiClient.post(
        `/projects/${id}/assign/${selectedUser}`
      );

      setSelectedUser("");
      fetchAssignedUsers();
    } catch (err) {
      console.error("Failed to assign user", err);
      alert("Assignment failed");
    }
  };

  // -------------------------
  // Move task
  // -------------------------
  const moveTask = async (task) => {
    const nextStatus = (task.status + 1) % 4;

    try {
      await apiClient.put(
        `/tasks/${task.id}/status?status=${nextStatus}`
      );

      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // -------------------------
  // Load data
  // -------------------------
  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchAssignedUsers();
  }, [fetchTasks, fetchUsers, fetchAssignedUsers]);

  // -------------------------
  // Kanban columns
  // -------------------------
  const columns = {
    0: { title: "To Do", items: [] },
    1: { title: "In Progress", items: [] },
    2: { title: "Review", items: [] },
    3: { title: "Done", items: [] },
  };

  tasks.forEach((t) => {
    if (columns[t.status]) {
      columns[t.status].items.push(t);
    }
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Project Workspace</h1>
        <p style={styles.subtitle}>
          Manage tasks, assignments, and workflow
        </p>
      </div>

      {/* Top Panels */}
      <div style={styles.topGrid}>

        {/* Assign User */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Assign User</h3>

          <div style={styles.row}>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={styles.select}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>

            <button onClick={handleAssign} style={styles.button}>
              Assign
            </button>
          </div>
        </div>

        {/* Team */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Team</h3>

          {assignedUsers.length === 0 ? (
            <p style={styles.mutedText}>No users assigned</p>
          ) : (
            <div style={styles.userList}>
              {assignedUsers.map((u) => (
                <div key={u.id} style={styles.userChip}>
                  {u.username} · {u.role}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={styles.board}>
        {Object.entries(columns).map(([key, col]) => (
          <div key={key} style={styles.column}>
            <div style={styles.columnHeader}>
              {col.title}
              <span style={styles.count}>{col.items.length}</span>
            </div>

            <div style={styles.columnBody}>
              {col.items.map((task) => (
                <div
                  key={task.id}
                  onClick={() => moveTask(task)}
                  style={styles.taskCard}
                >
                  <div style={styles.taskTitle}>{task.title}</div>
                  <div style={styles.taskMeta}>{task.priority}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
    marginTop: "8px",
    color: "#6b7280",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "1.1rem",
    fontWeight: "700",
  },

  row: {
    display: "flex",
    gap: "12px",
  },

  select: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },

  button: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  mutedText: {
    color: "#6b7280",
  },

  userList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  userChip: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  column: {
    backgroundColor: "white",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    minHeight: "400px",
  },

  columnHeader: {
    fontWeight: "700",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    color: "#111827",
  },

  count: {
    fontSize: "0.85rem",
    color: "#6b7280",
  },

  columnBody: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  taskCard: {
    backgroundColor: "#f9fafb",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },

  taskTitle: {
    fontWeight: "600",
    marginBottom: "6px",
  },

  taskMeta: {
    fontSize: "0.85rem",
    color: "#6b7280",
  },
};

export default ProjectDetail;
