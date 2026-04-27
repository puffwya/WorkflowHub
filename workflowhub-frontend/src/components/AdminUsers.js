import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
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
      [e.target.name]: e.target.value
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
    <div>
      <h2>Admin User Management</h2>

      {/* CREATE MANAGER FORM */}
      <form onSubmit={createManager} style={{ marginBottom: "20px" }}>
        <h3>Create Manager</h3>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Create Manager</button>
      </form>

      {/* USER LIST */}
      <h3>All Users</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
