import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function TaskCreate() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    projectId: "",
  });

  // --------------------
  // Load projects
  // --------------------
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };

    fetchProjects();
  }, []);

  // --------------------
  // Handle input changes
  // --------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------
  // Submit task
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.projectId) {
      setError("Please select a project");
      return;
    }

    try {
      await apiClient.post("/tasks", form);

      navigate("/tasks");
    } catch (err) {
      console.error("Failed to create task", err);
      setError("Failed to create task");
    }
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Task</h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* Project Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <select
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          required
        >
          <option value="">Select Project</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name || project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Create Task
        </button>
      </form>
    </div>
  );
}

export default TaskCreate;
