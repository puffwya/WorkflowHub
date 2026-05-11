# WorkflowHub Frontend

A modern project and task management frontend built with React.  
This application is part of the WorkflowHub full-stack system, designed to manage projects, tasks, user roles, and 
activity tracking in a SaaS-style workflow environment.

---

## Tech Stack

- React (Functional Components + Hooks)
- React Router
- Axios
- JWT Authentication
- REST API integration (C# .NET backend)

---

## Features

- User authentication (login/register with JWT)
- Dashboard with task status summaries
- Project management (create, view, assign users)
- Task management with filtering, pagination, and status updates
- Admin user management (role-based access control)
- Activity logs for audit tracking
- Project-level Kanban board workflow
- Role-based navigation (Admin vs User views)

---

## Installation

npm install

---

## Running the App

npm start

The app will run at:
http://localhost:3000

---

## Environment Variables

Create a .env file in the root of the frontend project:

REACT_APP_API_BASE_URL=http://localhost:5000

---

## Project Structure

src/
  components/
  pages/
  apiClient.js
  auth.js
  App.js

---

## Backend

This frontend connects to a separate .NET backend API that handles:

- Authentication (JWT)
- Projects & Tasks CRUD
- User roles (Admin / User)
- Activity logging

---

## Notes

- Built as a production-style SaaS dashboard for portfolio demonstration
- Focused on workflow management, role-based access, and full-stack integration
