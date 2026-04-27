import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layout/MainLayout";

import DashboardPage from "./pages/DashboardPage";
import Projects from "./pages/Projects";
import TasksPage from "./pages/TasksPage";
import TaskCreatePage from "./pages/TaskCreatePage";

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

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
