import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [editingUser, setEditingUser] =
    useState(null);

  const [editForm, setEditForm] =
    useState({
      username: "",
      email: "",
      role: "",
      password: "",
    });

  const fetchUsers = async () => {
    try {
      const res =
        await apiClient.get("/users");

      setUsers(res.data);
    } catch (err) {
      console.error(
        "Failed to load users",
        err
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const createManager =
    async (e) => {
      e.preventDefault();

      try {
        await apiClient.post(
          "/users/create-manager",
          form
        );

        setForm({
          username: "",
          email: "",
          password: "",
        });

        fetchUsers();
      } catch (err) {
        console.error(
          "Failed to create manager",
          err
        );

        alert(
          "Failed to create manager"
        );
      }
    };

  const startEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const saveUser =
    async () => {
      try {
        await apiClient.put(
          `/users/${editingUser.id}`,
          editForm
        );

        setEditingUser(null);

        fetchUsers();
      } catch (err) {
        console.error(
          "Failed updating user",
          err
        );

        alert(
          "Failed to update user"
        );
      }
    };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Admin Users
          </h1>

          <p style={styles.subtitle}>
            Manage system users and roles
          </p>
        </div>
      </div>

      {/* CREATE MANAGER */}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Create Manager
        </h2>

        <form
          onSubmit={createManager}
          style={styles.form}
        >
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={
              handleChange
            }
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={
              handleChange
            }
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={
              handleChange
            }
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Create Manager
          </button>
        </form>
      </div>

      {/* USERS */}

      <div style={styles.tableCard}>
        <h2 style={styles.sectionTitle}>
          All Users
        </h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Username
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Role
              </th>

              <th style={styles.th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={styles.row}
              >
                <td style={styles.td}>
                  {u.username}
                </td>

                <td style={styles.td}>
                  {u.email}
                </td>

                <td style={styles.td}>
                  <span
                    style={
                      styles.roleBadge
                    }
                  >
                    {u.role}
                  </span>
                </td>

                <td style={styles.td}>
                  <button
                    style={
                      styles.editButton
                    }
                    onClick={() =>
                      startEdit(u)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Edit User</h2>

            <input
              value={
                editForm.username
              }
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  username:
                    e.target
                      .value,
                })
              }
              placeholder="Username"
              style={
                styles.input
              }
            />

            <input
              value={
                editForm.email
              }
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  email:
                    e.target
                      .value,
                })
              }
              placeholder="Email"
              style={
                styles.input
              }
            />

            <select
              value={
                editForm.role
              }
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role:
                    e.target
                      .value,
                })
              }
              style={
                styles.input
              }
            >
              <option>
                Admin
              </option>

              <option>
                Manager
              </option>

              <option>
                Employee
              </option>
            </select>

            <input
              type="password"
              placeholder="New password (optional)"
              value={
                editForm.password
              }
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  password:
                    e.target
                      .value,
                })
              }
              style={
                styles.input
              }
            />

            <div
              style={
                styles.modalButtons
              }
            >
              <button
                style={
                  styles.button
                }
                onClick={
                  saveUser
                }
              >
                Save
              </button>

              <button
                style={
                  styles.cancelButton
                }
                onClick={() =>
                  setEditingUser(
                    null
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page:{
    padding:"40px",
    backgroundColor:"#f4f7fb",
    minHeight:"100vh"
  },

  header:{
    marginBottom:"30px"
  },

  title:{
    margin:0,
    fontSize:"2.2rem",
    fontWeight:"700"
  },

  subtitle:{
    color:"#6b7280"
  },

  card:{
    background:"white",
    padding:"30px",
    borderRadius:"18px",
    marginBottom:"30px",
    boxShadow:"0 10px 30px rgba(0,0,0,.06)",
    maxWidth:"600px"
  },

  tableCard:{
    background:"white",
    padding:"30px",
    borderRadius:"18px",
    boxShadow:"0 10px 30px rgba(0,0,0,.06)"
  },

  sectionTitle:{
    marginTop:0
  },

  form:{
    display:"flex",
    flexDirection:"column",
    gap:"14px"
  },

  input:{
    padding:"14px",
    borderRadius:"10px",
    border:"1px solid #d1d5db"
  },

  button:{
    padding:"14px",
    border:"none",
    borderRadius:"10px",
    background:"#2563eb",
    color:"white",
    cursor:"pointer"
  },

  editButton:{
    border:"none",
    padding:"8px 12px",
    borderRadius:"8px",
    background:"#f59e0b",
    color:"white",
    cursor:"pointer"
  },

  cancelButton:{
    padding:"14px",
    border:"none",
    borderRadius:"10px",
    background:"#6b7280",
    color:"white"
  },

  table:{
    width:"100%",
    borderCollapse:"collapse"
  },

  th:{
    textAlign:"left",
    padding:"14px"
  },

  td:{
    padding:"14px"
  },

  row:{
    borderBottom:"1px solid #eee"
  },

  roleBadge:{
    background:"#e0e7ff",
    padding:"4px 10px",
    borderRadius:"999px"
  },

  overlay:{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,.4)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  modal:{
    background:"white",
    padding:"30px",
    width:"450px",
    borderRadius:"18px",
    display:"flex",
    flexDirection:"column",
    gap:"14px"
  },

  modalButtons:{
    display:"flex",
    gap:"10px"
  }
};

export default AdminUsers;
