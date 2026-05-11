# WorkflowHub

WorkflowHub is a full-stack SaaS-style project management system for managing projects, tasks, users, and 
activity tracking with role-based access control.

It consists of a React frontend and a C# .NET backend API working together to provide a modern workflow 
management experience.

---

## Overview

WorkflowHub allows users to:

- Create and manage projects  
- Assign users to projects  
- Track tasks in a Kanban-style workflow  
- Filter and update tasks in real time  
- Manage users with role-based permissions  
- View system activity logs for auditing  

---

## Architecture

### Frontend
- React (Hooks + Functional Components)
- React Router
- Axios
- JWT authentication
- Role-based UI rendering

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- JWT authentication & authorization
- Role-based access control (Admin / Manager / Employee)
- SQL database

---

## Authentication & Roles

### Admin
- Full system access
- Can create managers and manage all users

### Manager
- Can manage projects
- Can assign users to projects
- Limited user visibility

### Employee
- Can view assigned tasks only
- Restricted access to admin features

---

## Core Features

### Dashboard
- Task summary (To Do, In Progress, Review, Done)

### Projects
- Create and view projects
- Assign users
- Kanban-style project detail board

### Tasks
- Create tasks linked to projects
- Filter by status, priority, and search
- Pagination support
- Inline status updates

### Users (Admin)
- View all users
- Create manager accounts
- Role-based filtering

### Activity Logs
- Track system actions
- Filter by user, task, or action type

---

## API Communication

Frontend communicates with backend via REST API:

- Authentication: `/auth`
- Projects: `/projects`
- Tasks: `/tasks`
- Users: `/users`
- Activity Logs: `/activity`

JWT tokens are stored in localStorage and attached to requests via Axios.

---

## Deployment

### Frontend
- React SPA
- Connects to backend API via configured base URL

### Backend
- ASP.NET Core Web API
- Handles business logic and data persistence

---

## Project Structure

### Frontend
src/
- components/
- pages/
- apiClient.js
- auth.js
- App.js

### Backend
- Controllers/
- DTOs/
- Domain/
- Infrastructure/

---

## Design Goals

- Clean separation of frontend and backend
- Role-based access control
- Scalable API structure
- Production-style UI
- Real-world workflow simulation

---

## Notes

This project demonstrates:

- React frontend development
- Secure .NET backend API design
- Authentication and authorization flows
- Full-stack CRUD workflows
- SaaS-style architecture and UI patterns
