import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#111",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2>WorkflowHub</h2>

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px"
            }}
          >
            <Link style={{ color: "white" }} to="/dashboard">
              Dashboard
            </Link>

            <Link style={{ color: "white" }} to="/projects">
              Projects
            </Link>

            <Link style={{ color: "white" }} to="/tasks">
              Tasks
            </Link>

            <Link style={{ color: "white" }} to="/tasks/new">
              Create Task
            </Link>
          </nav>
        </div>

        {/* Logout section */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;
