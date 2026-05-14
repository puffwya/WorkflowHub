# WorkflowHub

WorkflowHub is a full-stack SaaS-style workflow and project management platform for managing projects, tasks, 
users, and activity tracking with role-based access control.

It consists of a React frontend and an ASP.NET Core backend API working together to provide a modern workflow 
management experience.

---

## Overview

WorkflowHub allows users to:

- Create and manage projects
- Archive and restore project visibility
- Assign users to projects
- Create and manage tasks
- Delete tasks with activity tracking
- Track tasks in a Kanban-style workflow
- Filter and update tasks in real time
- Manage users with role-based permissions
- View system activity logs for auditing

---

## Architecture

### Frontend

Built using:

- React (Hooks + Functional Components)
- React Router
- Axios
- JWT Authentication
- Protected Routes
- Role-based UI rendering

### Backend

Built using:

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication & Authorization
- Docker
- Role-based access control

---

## Authentication & Roles

WorkflowHub uses JWT authentication and permission-based authorization.

### Admin

- Full system access
- Can manage all users
- Can create managers
- Can manage all projects/tasks
- Full visibility across system resources

### Manager

- Can create projects
- Can manage assigned projects
- Can assign users
- Can manage tasks

### Employee

- Limited system permissions
- Can view assigned work
- Restricted from administrative actions

---

## Core Features

### Dashboard

- Task summary widgets
- Workflow status overview
- Project activity visibility

---

### Projects

- Create projects
- View project details
- Assign users
- Archive projects
- View archived projects
- Kanban-style project workflow board

---

### Tasks

- Create project-linked tasks
- Delete tasks
- Update workflow status
- Filter by:
  - Status
  - Priority
  - Search terms
- Pagination support
- Due date tracking

---

### Users

Admin functionality includes:

- View users
- Create manager accounts
- Role-based filtering
- Permission management

---

### Activity Logs

Tracks important system actions:

- Project creation
- Project archiving
- User assignment
- Task deletion
- Task status updates
- System workflow actions

Provides audit visibility across the application.

---

## API Communication

Frontend communicates with backend through a REST API.

Endpoints include:

```txt
/auth
/projects
/tasks
/users
/activity
```

JWT access tokens are stored in localStorage and automatically attached to requests through Axios 
interceptors.

---

## Deployment

### Frontend

- React Single Page Application
- Hosted separately from backend
- Uses configurable API base URL

---

### Backend

- ASP.NET Core Web API
- Dockerized deployment
- PostgreSQL persistence layer
- Handles authentication, business logic, and database operations

---

## Project Structure

### Frontend

```txt
src/
├── components/
├── pages/
├── apiClient.js
├── auth.js
├── App.js
└── index.js
```

### Backend

```txt
Controllers/
DTOs/
Domain/
Infrastructure/
Application/
```

---

## Design Goals

- Clean separation of frontend and backend concerns
- Scalable API architecture
- Role-based security model
- Production-style SaaS UI
- Real-world workflow simulation
- Audit logging support
- Modular and maintainable code structure

---

## Technologies Used

### Frontend

- React
- React Router
- Axios

### Backend

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Docker

---

## Notes

This project demonstrates:

- Full-stack application architecture
- React frontend development
- Secure ASP.NET backend API design
- Authentication and authorization workflows
- Role-based access control
- REST API design
- Activity logging systems
- Dockerized deployment workflows
- SaaS-style UI patterns and workflow systems

Designed as a portfolio project intended to simulate production workflow management systems and enterprise 
application patterns.
