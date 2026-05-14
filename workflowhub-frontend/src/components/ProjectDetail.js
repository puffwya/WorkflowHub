import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

function ProjectDetail() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const [projectArchived, setProjectArchived] = useState(false);

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
      await apiClient.post(`/projects/${id}/assign/${selectedUser}`);
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
  const moveTask = async (taskId, newStatus) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: Number(newStatus) }
            : task
        )
      );

      await apiClient.put(`/tasks/${taskId}/status?status=${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      fetchTasks();
    }
  };

  // -------------------------
  // Delete task
  // -------------------------
  const handleDeleteTask = async (taskId) => {
    const backup = [...tasks];

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Delete failed");
      setTasks(backup);
    }
  };

  // -------------------------
  // Archive project
  // -------------------------
  const handleArchiveProject = async () => {
    try {
      await apiClient.put(`/projects/${id}/archive`);
      setProjectArchived(true);
    } catch (err) {
      console.error("Failed to archive project", err);
      alert("Archive failed");
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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Project Workspace</h1>
          <p style={styles.subtitle}>
            Manage tasks, assignments, and workflow
          </p>
        </div>

        {/* PROJECT ACTIONS */}
        <div style={styles.projectActions}>
          <button
            onClick={handleArchiveProject}
            style={styles.archiveBtn}
          >
            {projectArchived ? "Archived" : "Archive Project"}
          </button>
        </div>
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
          <div
            key={key}
            onDragOver={(e) => {
              e.preventDefault();
              setDraggedOverColumn(key);
            }}
            onDragLeave={() => setDraggedOverColumn(null)}
            onDrop={() => {
              if (draggedTask) moveTask(draggedTask.id, key);
              setDraggedTask(null);
              setDraggedOverColumn(null);
            }}
            style={{
              ...styles.column,
              ...(draggedOverColumn === key
                ? styles.columnActive
                : {}),
            }}
          >
            <div style={styles.columnHeader}>
              <span>{col.title}</span>
              <span style={styles.count}>{col.items.length}</span>
            </div>

            <div style={styles.columnBody}>
              {col.items.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTask(task)}
                  style={styles.taskCard}
                >
                  <div style={styles.taskTop}>
                    <div style={styles.taskTitle}>
                      {task.title}
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={styles.deleteBtn}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={styles.taskMetaRow}>
                    <span style={styles.priorityBadge}>
                      {task.priority}
                    </span>
                  </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  projectActions: {
    display: "flex",
    gap: "10px",
  },

  archiveBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "600",
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
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "15px",
  },

  row: {
    display: "flex",
    gap: "12px",
  },

  select: {
    flex: 1,
    padding: "12px",
  },

  button: {
    padding: "12px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
  },

  mutedText: {
    color: "#6b7280",
  },

  userList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  userChip: {
    backgroundColor: "#e0e7ff",
    padding: "6px 10px",
    borderRadius: "999px",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },

  column: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "20px",
  },

  columnActive: {
    border: "2px dashed #2563eb",
  },

  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },

  count: {
    backgroundColor: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "999px",
  },

  columnBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  taskCard: {
    padding: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    backgroundColor: "#fff",
  },

  taskTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  taskTitle: {
    fontWeight: "700",
  },

  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
  },

  taskMetaRow: {
    marginTop: "10px",
  },

  priorityBadge: {
    backgroundColor: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: "999px",
  },
};

export default ProjectDetail;
