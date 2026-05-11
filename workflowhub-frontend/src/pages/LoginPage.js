import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../apiClient";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome</h1>

        <p style={styles.subtitle}>
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
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
    transition: "border-color 0.2s",
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

export default LoginPage;
