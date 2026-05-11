import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../apiClient";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post("/auth/register", form);

      navigate("/login");
    } catch (err) {
      console.error("Register failed", err);
      setError("Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Sign up to get started with Wyatt's WorkflowHub
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },

  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "10px",
  },

  subtitle: {
    marginTop: 0,
    marginBottom: "30px",
    color: "#6b7280",
    fontSize: "0.95rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
  },

  button: {
    marginTop: "8px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    marginTop: "16px",
    color: "#dc2626",
    fontSize: "0.9rem",
  },

  footerText: {
    marginTop: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "0.95rem",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;
