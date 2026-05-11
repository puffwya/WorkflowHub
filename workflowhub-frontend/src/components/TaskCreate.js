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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Task</h1>

        <p style={styles.subtitle}>
          Add a new task to your workflow
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Project */}
          <div style={styles.field}>
            <label style={styles.label}>Project</label>

            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title</label>

            <input
              name="title"
              placeholder="Enter task title"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>

            <textarea
              name="description"
              placeholder="Describe the task..."
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          {/* Due Date */}
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Priority */}
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7fb",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: "30px",
    color: "#6b7280",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontWeight: "600",
    color: "#374151",
    fontSize: "0.95rem",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
  },

  textarea: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    minHeight: "120px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  },

  select: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },

  errorBox: {
    marginBottom: "20px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "0.95rem",
  },
};

export default TaskCreate;
