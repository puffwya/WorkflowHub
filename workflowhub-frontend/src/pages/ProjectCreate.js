import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function ProjectCreate() {
  const navigate = useNavigate();

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

    try {
      await apiClient.post("/projects", form);
      navigate("/projects");
    } catch (err) {
      console.error("Failed to create project", err);
      alert("Failed to create project");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default ProjectCreate;
