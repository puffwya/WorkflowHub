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
    <div>
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              onClick={() => navigate(`/tasks?projectId=${project.id}`)}
              style={{
                cursor: "pointer",
                padding: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px"
              }}
            >
              <strong>{project.name || project.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Projects;
