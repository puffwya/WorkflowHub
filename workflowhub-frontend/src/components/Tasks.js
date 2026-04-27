import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../apiClient";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // filters
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  // pagination
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
  }, [status, priority, search, page, projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return "To Do";
      case 1: return "In Progress";
      case 2: return "Review";
      case 3: return "Done";
      default: return status;
    }
  };

  // update status
  const updateStatus = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}/status`, null, {
        params: { status: newStatus }
      });

      fetchTasks(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h2>Tasks</h2>

      <Link to="/tasks/new">+ Create Task</Link>

      {projectId && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          Filtering by Project ID: {projectId}
        </p>
      )}

      {/* Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
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
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>

              {/* status dropdown */}
              <td>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                >
                  <option value="0">To Do</option>
                  <option value="1">In Progress</option>
                  <option value="2">Review</option>
                  <option value="3">Done</option>
                </select>
              </td>

              <td>{t.priority}</td>
              <td>{new Date(t.dueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Tasks;
