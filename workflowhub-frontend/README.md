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
- REST API Integration (.NET Backend)

---

## Features

- User authentication (login/register with JWT)
- Role-based access control (Admin / Manager / Employee)
- Dashboard with task status summaries
- Project management system
  - Create projects
  - Archive projects
  - View archived projects
  - Assign users to projects
- Task management system
  - Create tasks
  - Delete tasks
  - Status workflow updates
  - Filtering and pagination
- Activity logging / audit tracking
- Project-level Kanban workflow
- Protected API routes using JWT authentication
- Responsive SaaS-style dashboard UI

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running the App

Start the development server:

```bash
npm start
```

The app will run at:

```txt
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file in the root of the frontend project:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
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

## Backend Integration

This frontend connects to a separate ASP.NET Core backend API responsible for:

- JWT authentication
- Projects & tasks CRUD operations
- Role management
- Activity logging
- Workflow enforcement
- PostgreSQL database access

---

## UI Features

### Projects

- Create and manage projects
- Archive inactive projects
- Toggle archived project visibility
- Project detail pages
- User assignment support

### Tasks

- Create and delete tasks
- Task filtering and pagination
- Status workflow updates
- Priority tracking
- Due date management

### Activity Logs

- Tracks important actions such as:
  - Project creation
  - Project archiving
  - Task deletion
  - Status changes
  - User assignment

---

## Authentication

WorkflowHub uses JWT authentication for secure API access.

Authenticated users receive protected access based on their assigned role:

- **Admin**
  - Full system access
- **Manager**
  - Project and task management access
- **Employee**
  - Limited task interaction permissions

---

## Notes

- Built as a production-style SaaS portfolio project
- Focused on full-stack architecture and scalable workflow management
- Designed with clean UI patterns and modular React structure
- Backend deployed separately using Docker + Render
```
