# WorkflowHub Frontend

A modern React-based frontend for the WorkflowHub full-stack workflow management system.

Built as a SaaS-style dashboard for managing projects, tasks, users, and activity tracking with role-based access 
control.

---

## Overview

This frontend is part of the WorkflowHub system and provides a responsive UI for interacting with a secure ASP.NET Core 
backend API.

It enables users to manage workflows, track tasks, and interact with project data in real time.

---

## Tech Stack

- React (Functional Components + Hooks)
- React Router
- Axios
- JWT Authentication
- REST API integration (.NET backend)

---

## Features

### Authentication & Security
- JWT-based login and session handling
- Protected routes
- Role-based UI rendering (Admin / Manager / Employee)

### Dashboard
- Task summary widgets
- Project overview
- Status tracking

### Project Management
- Create and manage projects
- Archive / restore projects
- Assign users to projects
- Project detail views

### Task Management
- Create, update, and delete tasks
- Status workflow updates
- Filtering and pagination
- Priority and due date tracking

### Activity Tracking
- Project creation events
- Task updates and deletions
- User assignment logging

---

## Backend Integration

This frontend communicates with a separate ASP.NET Core API responsible for:

- Authentication (JWT)
- Project and task CRUD operations
- Role-based authorization
- Activity logging
- PostgreSQL data persistence

---

## Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

---

## Project Structure

```txt
src/
├── components/
├── pages/
├── apiClient.js
├── auth.js
├── App.js
└── index.js
```

---

## Design Goals

- Clean separation from backend logic
- Modular and reusable React components
- Secure API communication via JWT
- SaaS-style dashboard UX
- Scalable frontend architecture

---

## Notes

This frontend is part of a production-style full-stack system designed to simulate real-world SaaS workflow platforms 
with authentication, role-based access control, and modular system design.
