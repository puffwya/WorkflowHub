import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>
            Manage and organize your workflow projects
          </p>
        </div>

        <button
          style={styles.createButton}
          onClick={() => navigate("/projects/new")}
        >
          + Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No projects yet</h3>
          <p>Create your first project to get started.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              style={styles.card}
            >
              <h3 style={styles.projectTitle}>
                {project.name}
              </h3>

              <p style={styles.projectMeta}>
                Click to open project
              </p>
            </div>
          ))}
        </div>
      )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    gap: "20px",
    flexWrap: "wrap",
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
    fontSize: "1rem",
  },

  createButton: {
    padding: "14px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
  },

  emptyState: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "18px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    transition: "transform 0.15s ease",
    border: "1px solid #e5e7eb",
  },

  projectTitle: {
    margin: 0,
    marginBottom: "12px",
    color: "#111827",
    fontSize: "1.2rem",
  },

  projectMeta: {
    margin: 0,
    color: "#6b7280",
    fontSize: "0.95rem",
  },
};

export default Projects;
