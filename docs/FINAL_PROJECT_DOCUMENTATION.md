# Nexora Event Management System

## Final Project Report, SRS, Scope, and Presentation Guide

**Project Type:** Full-stack event management platform  
**Stack:** React + TypeScript + Vite, Express + TypeScript, MySQL, JWT  
**Purpose:** Event discovery, event creation, registrations, and platform moderation

---

## 1. Executive Summary

Nexora is a role-based event management system built to connect event organizers, attendees, and administrators in one platform. It lets visitors discover events by category, search and sort listings, register for events, and manage their participation. Organizers can create, duplicate, publish, cancel, and monitor events. Admins can manage users and moderate events.

The system is designed as a practical solution for colleges, communities, companies, and event-driven organizations that need a centralized platform for publishing events and tracking registrations.

---

## 2. Progressive Report

### 2.1 Project Foundation

- Set up the frontend and backend as separate TypeScript projects.
- Established strict type checking, path aliases, and linting.
- Created shared conventions for API responses, validation, and error handling.
- Added database migration support and a MySQL schema.

### 2.2 Public User Experience

- Built public pages for Home, Events, Categories, About, Contact, Login, and Signup.
- Added a themed UI with dark mode support.
- Created reusable components for navigation, cards, buttons, forms, loaders, and layouts.
- Added search, filtering, sorting, and event browsing flows.

### 2.3 Authenticated Role Features

- Implemented JWT-based login and registration.
- Added route protection for user, organizer, and admin areas.
- Added role-specific dashboards and permissions.

### 2.4 Event Management

- Implemented event creation, editing, duplication, publishing, cancellation, and deletion for organizers.
- Added attendee management and registration statistics.
- Added event registration and unregistration for users.

### 2.5 Administration and Oversight

- Added admin dashboards for platform overview.
- Added user role updates, account status changes, and user deletion.
- Added event moderation actions for admin control.

### 2.6 Current Status

- The platform has a working end-to-end structure for browsing, registering, organizing, and moderating events.
- The backend exposes the core API modules needed for the platform.
- The frontend contains complete role-based UI flows for presentation and demo use.

---

## 3. Software Requirements Specification (SRS)

### 3.1 Introduction

#### 3.1.1 Purpose

This document defines the requirements, scope, behavior, and architecture of the Nexora Event Management System.

#### 3.1.2 Scope

Nexora is intended to:

- help users discover and register for events,
- help organizers create and manage events,
- help admins supervise users and content,
- provide a structured, secure, and maintainable web application.

#### 3.1.3 Intended Audience

- Developers
- Testers
- Project evaluators
- Presentation audience
- Future maintainers

### 3.2 Overall Description

#### 3.2.1 Product Perspective

Nexora is a web-based client-server application:

- Frontend: React SPA with routing and API integration
- Backend: Express REST API
- Database: MySQL relational schema

#### 3.2.2 User Classes

| Role | Capabilities |
|---|---|
| Guest | Browse public pages, view events, view categories |
| User | Register/login, register for events, cancel registrations, view dashboard |
| Organizer | Create and manage events, view attendees, export attendee lists |
| Admin | Manage users, change roles/status, moderate events, view reports |

#### 3.2.3 Operating Environment

- Modern desktop and mobile browsers
- Node.js runtime for backend and frontend tooling
- MySQL database server

#### 3.2.4 Design Constraints

- Strict TypeScript typing
- Role-based access control
- MySQL schema with relational integrity
- Consistent API response format
- Tailwind-based frontend styling

### 3.3 Functional Requirements

#### Public Features

1. View landing page and platform overview.
2. Browse events with pagination.
3. Search events by title, description, or location.
4. Filter events by category.
5. Sort events by date, popularity, or title.
6. View category listings and category-wise event counts.
7. Access About and Contact pages.

#### Authentication Features

1. Register as a user or organizer.
2. Log in with email and password.
3. Store JWT token for session persistence.
4. Log out and clear session data.
5. Protect dashboard routes by role.

#### User Features

1. View personal profile.
2. View dashboard summary.
3. View registered events.
4. Register for an event.
5. Cancel an event registration.

#### Organizer Features

1. View organizer dashboard.
2. Create events with validation.
3. Edit existing events.
4. Duplicate an event.
5. Publish/unpublish or cancel events.
6. View attendee list.
7. Remove attendees.
8. Export attendee list as CSV.
9. View registration statistics and fill rate.

#### Admin Features

1. View admin dashboard.
2. View platform-wide statistics.
3. Search and list users.
4. Change user role.
5. Change account status.
6. Delete users.
7. Moderate events.

### 3.4 Non-Functional Requirements

#### Performance

- Event listing should support pagination and sorting.
- Dashboard calls should remain responsive and data-driven.

#### Security

- Passwords must be hashed before storage.
- JWT authentication protects private routes.
- Role checks restrict sensitive actions.
- Validation prevents malformed input.

#### Reliability

- Standardized success and error responses.
- Graceful handling of invalid routes and server errors.

#### Maintainability

- Modular folder structure.
- Reusable frontend components.
- Separated controllers, services, middleware, and routes.

#### Usability

- Responsive interface.
- Dark mode support.
- Clear navigation and role-based dashboards.

### 3.5 External Interface Requirements

#### User Interface

- Home page with hero, featured events, categories, and CTA sections
- Events page with search/filter/sort
- Role dashboards
- Authentication forms

#### API Interface

- `/api/health`
- `/api/auth/*`
- `/api/events/*`
- `/api/users/*`
- `/api/categories`

#### Database Interface

- `users`
- `categories`
- `events`
- `event_registrations`

---

## 4. System Architecture

### 4.1 Frontend

- React 18 SPA
- React Router for navigation
- Axios API client for backend calls
- Theme context for dark mode
- Reusable component library

### 4.2 Backend

- Express application with middleware chain
- JWT auth middleware
- Validation middleware using express-validator
- Central error handler
- Controllers and services for business logic

### 4.3 Database

- MySQL relational schema
- Foreign keys between events, categories, users, and registrations
- Default categories seeded through migration

---

## 5. Data Model Overview

| Table | Purpose |
|---|---|
| users | Stores account data, roles, and profile information |
| categories | Stores event categories and metadata |
| events | Stores event details, organizer, capacity, price, and status |
| event_registrations | Stores user registrations and attendance state |

---

## 6. What the Project Solves

Nexora solves the common fragmentation in event handling:

- users usually browse events across multiple platforms,
- organizers often lack a simple control panel,
- admins need a single place to supervise users and content,
- event registration status is often scattered and hard to track.

Nexora centralizes all of this into one workflow:

1. Discover events.
2. Register or manage participation.
3. Organize and monitor events.
4. Moderate and govern the platform.

---

## 7. Project Scope

### In Scope

- Event discovery
- Category browsing
- Search and sorting
- User registration and login
- Event registration and cancellation
- Organizer event CRUD
- Attendee management
- Admin moderation
- Dashboard analytics
- Dark mode and responsive UI

### Out of Scope

- Online payments
- Email/SMS notifications
- Real-time chat
- Ratings and reviews
- Mobile application
- Third-party ticketing integration

---

## 8. Presentation Talking Points

- Explain the problem: event discovery and management are fragmented.
- Show the role-based model: guest, user, organizer, admin.
- Demonstrate the event lifecycle: create -> publish -> register -> manage -> moderate.
- Highlight security: JWT, role checks, validation, password hashing.
- Highlight usability: search, filter, sort, dashboards, dark mode.
- Mention scalability: modular architecture and relational data model.

---

## 9. Likely Viva / Question-and-Answer Set

| Question | Short Answer |
|---|---|
| What is Nexora? | A role-based event management platform for discovery, registration, and event control. |
| Who uses it? | Guests, users, organizers, and admins. |
| What problem does it solve? | It unifies event discovery, registrations, and moderation in one place. |
| Why React and Express? | React gives a fast SPA UI; Express gives a simple REST backend. |
| Why MySQL? | It fits relational data such as users, events, categories, and registrations. |
| How is authentication handled? | With JWT-based login and protected routes. |
| How are permissions enforced? | Through role-based middleware and dashboard routing. |
| How are forms validated? | On the frontend and backend with schema/rule validation. |
| How do organizers benefit? | They can create, update, duplicate, and monitor events. |
| How do admins benefit? | They can manage users and moderate events. |
| What makes the system scalable? | Separation of concerns, typed APIs, reusable UI, and structured database design. |
| What is the biggest limitation? | Advanced production features like payments and notifications are not included yet. |

---

## 10. Conclusion

Nexora is a complete event management platform designed for practical use and demonstration. It provides a strong full-stack foundation, supports multiple user roles, and covers the core workflow of event discovery, event creation, registration, and moderation.

It is suitable for a final-year project presentation because it shows:

- problem analysis,
- structured system design,
- implementation across frontend, backend, and database,
- role-based security,
- and a realistic scope that can be extended later.

