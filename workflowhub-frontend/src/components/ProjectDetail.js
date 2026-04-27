import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../apiClient";
import { getUserRole } from "../auth";

function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await apiClient.get(`/projects/${id}`);
        setProject(projectRes.data);

        const tasksRes = await apiClient.get(`/tasks`, {
          params: { projectId: id }
        });

        setTasks(tasksRes.data.items);
      } catch (err) {
        console.error("Failed to load project details", err);
        setError("Failed to load project");
      }
    };

    fetchData();
  }, [id]);

  // Move logic (explicit direction)
  const moveTask = async (task, direction) => {

    let nextStatus = task.status;

    if (direction === "right" && task.status < 3) {
      nextStatus = task.status + 1;
    }

    if (direction === "left" && task.status > 0) {
      nextStatus = task.status - 1;
    }

    // no change → ignore
    if (nextStatus === task.status) return;

    try {
      await apiClient.put(`/tasks/${task.id}/status`, null, {
        params: { status: nextStatus }
      });

      // refresh tasks
      const res = await apiClient.get(`/tasks`, {
        params: { projectId: id }
      });

      setTasks(res.data.items);
    } catch (err) {
      console.error("Failed to update task status", err);
      alert("Failed to update task");
    }
  };

  const groupTasksByStatus = (tasks) => {
    return {
      todo: tasks.filter(t => t.status === 0),
      inProgress: tasks.filter(t => t.status === 1),
      review: tasks.filter(t => t.status === 2),
      done: tasks.filter(t => t.status === 3),
    };
  };

  if (error) return <p>{error}</p>;
  if (!project) return <p>Loading project...</p>;

  const role = getUserRole();

  const grouped = groupTasksByStatus(tasks);

  const Column = ({ title, items }) => (
    <div style={{
      flex: 1,
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      minHeight: "300px",
      background: "#fafafa"
    }}>
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p style={{ color: "#999" }}>No tasks</p>
      ) : (
        items.map(task => (
          <div
            key={task.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "white"
            }}
          >
            <strong>{task.title}</strong>

            <p style={{ margin: "5px 0", fontSize: "12px" }}>
              Priority: {task.priority}
            </p>

            {/* Controls */}
            <div style={{ display: "flex", gap: "5px" }}>
  
              <button
                onClick={() => moveTask(task, "left")}
                disabled={task.status === 0 || role === "Employee"}
              >
                ←
              </button>

              <button
                onClick={() => moveTask(task, "right")}
                disabled={task.status === 3 || role === "Employee"}
              >
                →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <h2>{project.name || project.title}</h2>

      <Link to="/tasks/new">+ Create Task</Link>

      <div style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px"
      }}>
        <Column title="To Do" items={grouped.todo} />
        <Column title="In Progress" items={grouped.inProgress} />
        <Column title="Review" items={grouped.review} />
        <Column title="Done" items={grouped.done} />
      </div>
    </div>
  );
}

export default ProjectDetail;
