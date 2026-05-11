import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createManager = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post("/users/create-manager", form);

      setForm({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to create manager", err);
      alert("Failed to create manager");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Users</h1>
          <p style={styles.subtitle}>
            Manage system users and roles
          </p>
        </div>
      </div>

      {/* CREATE MANAGER CARD */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Create Manager</h2>

        <form onSubmit={createManager} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Create Manager
          </button>
        </form>
      </div>

      {/* USERS TABLE */}
      <div style={styles.tableCard}>
        <h2 style={styles.sectionTitle}>All Users</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.row}>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={styles.roleBadge}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    marginBottom: "30px",
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
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: "30px",
    maxWidth: "600px",
  },

  tableCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#111827",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "14px",
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
    fontWeight: "600",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f1f5f9",
  },

  row: {
    transition: "background-color 0.15s ease",
  },

  roleBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
};

export default AdminUsers;
