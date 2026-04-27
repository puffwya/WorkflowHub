import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getUserRole } from "./auth";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layout/MainLayout";

import DashboardPage from "./pages/DashboardPage";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";
import TasksPage from "./pages/TasksPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import AdminUsers from "./components/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* protected app */}
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Navigate to="/dashboard" />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/projects" element={<Projects />} />

          <Route path="/projects/:id" element={<ProjectDetail />} />

          <Route
            path="tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="tasks/new"
            element={
              <ProtectedRoute>
                <TaskCreatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              getUserRole() === "Admin" ? <AdminUsers /> : <Navigate to="/dashboard" />
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
