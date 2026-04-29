import React, { useEffect, useState } from "react";
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
  const fetchTasks = async () => {
    try {
      const res = await apiClient.get(`/tasks/project/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // -------------------------
  // Fetch all users
  // -------------------------
  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // -------------------------
  // Fetch assigned users
  // -------------------------
  const fetchAssignedUsers = async () => {
    try {
      const res = await apiClient.get(`/projects/${id}/users`);
      setAssignedUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned users", err);
    }
  };

  // -------------------------
  // Assign user
  // -------------------------
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("Select a user first");
      return;
    }

    try {
      await apiClient.post(`/projects/${id}/assign/${selectedUser}`);
      setSelectedUser("");
      fetchAssignedUsers(); // refresh list
    } catch (err) {
      console.error("Failed to assign user", err);
      alert("Assignment failed");
    }
  };

  // -------------------------
  // Move task (status click)
  // -------------------------
  const moveTask = async (task) => {
    const nextStatus = (task.status + 1) % 4;

    try {
      await apiClient.put(`/tasks/${task.id}/status?status=${nextStatus}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchAssignedUsers();
  }, [id]);

  // -------------------------
  // Group tasks (Kanban)
  // -------------------------
  const columns = {
    0: { title: "To Do", items: [] },
    1: { title: "In Progress", items: [] },
    2: { title: "Review", items: [] },
    3: { title: "Done", items: [] },
  };

  tasks.forEach((t) => {
    columns[t.status]?.items.push(t);
  });

  return (
    <div>
      <h2>Project Detail</h2>

      {/* -------------------------
          Assign User Section
      ------------------------- */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Assign User</h3>

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.role})
            </option>
          ))}
        </select>

        <button onClick={handleAssign} style={{ marginLeft: "10px" }}>
          Assign
        </button>
      </div>

      {/* -------------------------
          Assigned Users List
      ------------------------- */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Assigned Users</h3>

        {assignedUsers.length === 0 ? (
          <p>No users assigned</p>
        ) : (
          <ul>
            {assignedUsers.map((u) => (
              <li key={u.id}>
                {u.username} ({u.role})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* -------------------------
          Kanban Board
      ------------------------- */}
      <div style={{ display: "flex", gap: "20px" }}>
        {Object.entries(columns).map(([key, col]) => (
          <div
            key={key}
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: "10px",
              minHeight: "300px",
            }}
          >
            <h3>{col.title}</h3>

            {col.items.map((task) => (
              <div
                key={task.id}
                onClick={() => moveTask(task)}
                style={{
                  border: "1px solid #999",
                  padding: "8px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  background: "#f9f9f9",
                }}
              >
                <strong>{task.title}</strong>
                <div>{task.priority}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;
