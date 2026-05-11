import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function ProjectCreate() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await apiClient.post("/projects", form);

      navigate("/projects");
    } catch (err) {
      console.error("Failed to create project", err);
      setError("Failed to create project");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Project</h1>

        <p style={styles.subtitle}>
          Start organizing your workflow with a new project
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Project Name */}
          <div style={styles.field}>
            <label style={styles.label}>
              Project Name
            </label>

            <input
              name="name"
              placeholder="Enter project name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your project..."
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>
            Create Project
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
    minHeight: "140px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
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

export default ProjectCreate;
