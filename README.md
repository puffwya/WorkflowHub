# WorkflowHub

A full-stack SaaS-style workflow and project management platform for managing projects, tasks, and users with 
role-based access control.

Built with React and ASP.NET Core, WorkflowHub simulates a production-grade workflow system with 
authentication, activity logging, AI-assisted insights, and scalable backend architecture.

---

## Live Demo

[View App](https://puffwya.github.io/WorkflowHub/#/login)

---

## Preview

![Dashboard](images/dashboard.jpg)
![Kanban Board](images/kanban.jpg)

---

## Core Features

- Project and task management system
- Kanban-style workflow tracking
- Role-based access control (Admin / Manager / Employee)
- JWT authentication and protected routes
- Activity logging and audit tracking
- User and permission management
- Real-time task filtering and updates
- AI-generated dashboard insights per user role (Groq-powered LLM integration)
- Automated daily digest reports triggered via GitHub Actions cron job
- Task review workflow (Employees can submit tasks for review)
- Project archiving (Admins and Managers can archive completed or inactive projects)

---

## Architecture Overview

### Frontend
- React (Hooks + Functional Components)
- React Router
- Axios with JWT interceptors
- Role-based UI rendering

### Backend
- ASP.NET Core Web API (.NET 9)
- Clean layered architecture (Controller → Service → Repository)
- Entity Framework Core
- PostgreSQL database
- JWT authentication & authorization
- AI service integration (Groq LLM API for dashboard insights)
- Dockerized deployment support

---

## System Design Highlights

- Secure authentication with JWT
- Role-based permission system
- RESTful API design
- Audit logging for system actions
- Modular service architecture
- Separation of frontend/backend concerns
- AI-powered productivity insights for users based on task and project state
- Scheduled backend automation using GitHub Actions (daily digest generation)

---

## Key Roles

**Admin**
- Full system access
- User and role management
- Global project/task control
- Archive and manage system-wide projects

**Manager**
- Project creation and management
- Task assignment and tracking
- Team coordination
- Archive projects when completed or inactive

**Employee**
- View assigned work
- Update task status
- Submit tasks for review before completion
- Limited system access

---

## Tech Stack

`React` `ASP.NET Core (.NET 9)` `Entity Framework Core` `PostgreSQL` `JWT` `Docker` `Groq API` `GitHub Actions`

---

## Notes

This project helped me to understand production-style full-stack engineering concepts including authentication systems, role-based access control, scalable API architecture, background automation, and modern SaaS UI patterns enhanced with AI-driven insights.
