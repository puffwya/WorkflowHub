import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  // Filters
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [taskId, setTaskId] = useState("");

  // dropdown data
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  // Fetch logs
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

  // Fetch users + tasks (once)
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
    <div>
      <h2>Activity Logs</h2>

      {/* Filters */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        
        {/* Action filter */}
        <input
          placeholder="Filter by action..."
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />

        {/* User dropdown */}
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        {/* Task dropdown */}
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">All Tasks</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Action</th>
            <th>Details</th>
            <th>User</th>
            <th>Task / Project</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{log.username || "Unknown"}</td>

              {/* Task / Project navigation */}
              <td>
                {log.taskId ? (
                  <button onClick={() => navigate(`/tasks?taskId=${log.taskId}`)}>
                    View Task
                  </button>
                ) : log.projectId ? (
                  <button onClick={() => navigate(`/projects/${log.projectId}`)}>
                    View Project
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {new Date(log.createdAt).toLocaleString()}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityLogs;
