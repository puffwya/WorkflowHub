import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getUserRole } from "../auth";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div style={styles.wrapper}>

      {/* Hamburger */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            ...styles.hamburger,
            left: open ? "260px" : "15px",
            transition: "left 0.25s ease",
          }}
        >
          ☰
        </button>
      )}

      {/* Overlay */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={styles.overlay}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isMobile
            ? (open ? "translateX(0)" : "translateX(-100%)")
            : "translateX(0)",
        }}
      >

        {/* TOP CONTENT (NOW SCROLLABLE AREA) */}
        <div style={styles.scrollArea}>

          <div style={styles.brand}>
            WorkflowHub
          </div>

          <div style={styles.section}>
            <p style={styles.sectionLabel}>MAIN</p>

            <Link to="/dashboard" onClick={() => setOpen(false)} style={linkStyle(isActive("/dashboard"))}>
              Dashboard
            </Link>

            <Link to="/projects" onClick={() => setOpen(false)} style={linkStyle(isActive("/projects"))}>
              Projects
            </Link>

            <Link to="/tasks" onClick={() => setOpen(false)} style={linkStyle(isActive("/tasks"))}>
              Tasks
            </Link>

            <Link to="/tasks/new" onClick={() => setOpen(false)} style={linkStyle(isActive("/tasks/new"))}>
              Create Task
            </Link>
          </div>

          {role === "Admin" && (
            <div style={styles.section}>
              <p style={styles.sectionLabel}>ADMIN</p>

              <Link to="/admin/users" onClick={() => setOpen(false)} style={linkStyle(isActive("/admin/users"))}>
                Users
              </Link>

              <Link to="/activity" onClick={() => setOpen(false)} style={linkStyle(isActive("/activity"))}>
                Activity Logs
              </Link>
            </div>
          )}

        </div>

        {/* LOGOUT (ALWAYS VISIBLE, NEVER CUT OFF) */}
        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}

const linkStyle = (active) => ({
  ...styles.link,
  ...(active ? styles.activeLink : {}),
});

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7fb",
  },

  sidebar: {
    width: "240px",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
  },

  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  },

  logoutContainer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "#0f172a",
  },

  brand: {
    fontSize: "1.4rem",
    fontWeight: "800",
    marginBottom: "30px",
  },

  section: {
    marginBottom: "24px",
  },

  sectionLabel: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    marginBottom: "10px",
    letterSpacing: "1px",
  },

  link: {
    display: "block",
    padding: "10px 12px",
    borderRadius: "10px",
    color: "#cbd5e1",
    textDecoration: "none",
    marginBottom: "6px",
    fontSize: "0.95rem",
  },

  activeLink: {
    backgroundColor: "#1e293b",
    color: "white",
    fontWeight: "600",
  },

  logout: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: "600",
  },

  main: {
    flex: 1,
    marginLeft: "240px",
    padding: "30px",
  },

  hamburger: {
    position: "fixed",
    top: "15px",
    zIndex: 20,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 5,
  },
};

export default MainLayout;
