# LegalMatch Pro

> AI-inspired legal aid matching platform that connects citizens with verified lawyers and NGOs through role-based workflows, case intelligence, and actionable analytics.

## 🚀 Project Title & Tagline

**LegalMatch Pro (Legal Aid Matching Platform)** is a full-stack social impact platform built to reduce the gap between people who need legal help and service providers who can offer it.

It combines:

- secure multi-role authentication
- case intake and lifecycle tracking
- lawyer/NGO discovery and filtering
- matching and acceptance workflows
- admin-led verification and governance
- analytics dashboards for decision support

## 📌 Problem Statement

Access to legal aid is often delayed by fragmented data, lack of verified provider information, and poor coordination between citizens, lawyers, and NGOs.

Key real-world pain points:

- citizens struggle to find trusted legal support quickly
- legal providers are hard to discover by location and specialization
- NGOs and lawyers cannot consistently track case intake and impact
- admins lack centralized visibility into platform health and outcomes

This matters because delayed legal assistance can directly affect livelihoods, safety, and justice outcomes.

## 💡 Solution Overview

LegalMatch Pro provides one unified platform where users can register by role, submit and track legal cases, discover verified providers, and collaborate through structured workflows.

At a high level, the system:

1. Authenticates users with JWT and role-aware access control.
2. Captures case details from citizens with validation and status tracking.
3. Surfaces relevant lawyers/NGOs via directory and matching logic.
4. Enables secure communication and appointment coordination.
5. Gives admins complete oversight with verifications, logs, and analytics.

## 🧠 Features (Module-wise)

### 🔹 Authentication & Roles

- Role-aware signup/login for `CITIZEN`, `LAWYER`, `NGO`, and `ADMIN`
- JWT access + refresh token flow (`/auth/login`, `/auth/refresh-token`)
- Frontend token refresh handling via Axios interceptors
- Protected route patterns for secure UI access

### 🔹 Case Management

- Citizen case submission with structured legal details
- Citizen-only personal case history (`/cases/my`)
- Admin case monitoring and search (`/cases/all`, `/cases/search`)
- Case status transitions (`OPEN`, `MATCHED`, `RESOLVED`)

### 🔹 Directory (Lawyer + NGO)

- Unified directory API with role-specific listings
- Lawyer filters: specialization, location, verification status, sorting, pagination
- NGO filters: expertise, location, verification status, sorting, pagination
- Admin-triggered import endpoint for directory sync

### 🔹 Matching System

- Match generation per case (`/matches/generate/{caseId}`)
- Match list retrieval with role/search filters (`/matches/my`)
- Provider decision flow: request, accept, approve, reject
- Match status lifecycle visibility in admin analytics

### 🔹 Chat System

- REST-based chat message send/history endpoints
- WebSocket/STOMP-ready backend configuration (`/ws` handshake)
- JWT validation during WebSocket connect via channel interceptor
- Match-linked conversation model for controlled communication

### 🔹 Admin Panel

- Verification center for lawyer/NGO approvals and rejections
- Case monitoring dashboard and system logs access
- User and role-level operational visibility
- Strict admin-only endpoint guards for sensitive actions

### 🔹 Analytics Dashboard

- KPI cards: total users, cases, matches, resolved cases
- Trend analytics for user growth and case growth (month-wise)
- Role distribution and status distribution charts
- Geographic case distribution panel with map-ready visualization support

## 🏗️ System Architecture

LegalMatch Pro follows a full-stack, API-driven architecture:

1. **Frontend (React + Tailwind)**
	 - Handles UI rendering, role-based navigation, forms, and dashboard interactions.
	 - Sends HTTP requests through a centralized API client.

2. **Backend (Spring Boot REST APIs)**
	 - Applies authentication, authorization, validation, business rules, matching, and analytics aggregation.
	 - Exposes role-protected REST endpoints and WebSocket configuration.

3. **Database (PostgreSQL + JPA/Hibernate + Flyway)**
	 - Stores users, roles, cases, matches, chat records, notifications, and analytics source data.
	 - Supports migration-based schema evolution.

**Flow:**

Frontend request -> JWT validation in backend -> service/business logic -> database read/write -> response back to frontend -> UI state update.

## ⚙️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, WebSocket/STOMP |
| Database | PostgreSQL, Flyway (migrations), Hibernate |
| Authentication | JWT (access/refresh token flow) |
| Tools | Maven, ESLint, PostCSS, npm, Git |

## 🔐 Roles & Access Control

### Citizen

- Register/login and manage personal profile
- Submit legal cases and track own case history
- View and act on assigned matches (where applicable)

### Lawyer

- Maintain profile and specialization visibility
- Receive and respond to case match requests
- Participate in case communication and appointments

### NGO

- Maintain organization profile and expertise metadata
- Accept/reject case collaborations
- Coordinate with citizens/lawyers for aid execution

### Admin

- Approve/reject lawyer and NGO verification requests
- Monitor users, cases, matches, and system logs
- Access analytics and governance endpoints
- Control directory ingestion/import operations

## 📊 Analytics & Dashboard

The admin analytics module includes:

- **KPI Cards**
	- Total Users
	- Total Cases
	- Total Matches
	- Resolved Cases

- **Charts**
	- Line chart: user and case growth trends
	- Bar charts: case status and match status distribution
	- Pie chart: user role distribution

- **Map Visualization (Geo Insights)**
	- Geographic case distribution data (top locations)
	- Map-ready panel for interactive geo expansion

## 📁 Project Structure

```text
legal-aid-matching-platform-b13/
|- frontend/                      # React application
|  |- src/
|  |  |- components/              # Reusable UI modules (chat, cases, matching, dashboard)
|  |  |- pages/                   # Route-level pages (admin, auth, directory, etc.)
|  |  |- context/                 # Auth/case context state
|  |  |- api/                     # API client, token refresh logic
|
|- backend/                       # Spring Boot REST API
|  |- src/main/java/com/legalmatch/backend/
|  |  |- controller/              # API endpoints
|  |  |- service/                 # Business logic (matching, analytics, auth)
|  |  |- repository/              # Data access layer
|  |  |- config/                  # Security and WebSocket configuration
|  |- src/main/resources/
|  |  |- application.properties   # Runtime configuration
|  |  |- db/migration/            # Flyway migration scripts
|
|- scripts/                       # Utility scripts for data generation
|- db_files/                      # Database-related assets/documentation
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+ (or use `mvnw`)
- PostgreSQL 14+

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd legal-aid-matching-platform-b13
```

### 2. Database Setup (PostgreSQL)

```sql
CREATE DATABASE legalmatch_db;
```

Update backend DB settings in `backend/src/main/resources/application.properties`:

- `spring.datasource.url=jdbc:postgresql://localhost:5432/legalmatch_db`
- `spring.datasource.username=<your_postgres_username>`
- `spring.datasource.password=<your_postgres_password>`
- `jwt.secret=<your_secure_secret>`

### 3. Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Windows alternative:

```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 🔗 API Endpoints (Key)

> Frontend calls use `/api` as base URL and pass route fragments like `/auth/login`, `/cases`, etc.

| Module | Method | Endpoint | Purpose |
|---|---|---|---|
| Auth | `POST` | `/api/auth/login` | Authenticate user and issue tokens |
| Auth | `POST` | `/api/auth/register` | Register new user by role |
| Auth | `POST` | `/api/auth/refresh-token` | Refresh access token |
| Cases | `POST` | `/api/cases` | Create case (Citizen) |
| Cases | `GET` | `/api/cases/my` | Citizen case history |
| Cases | `GET` | `/api/cases/all` | Admin case monitoring |
| Directory | `GET` | `/api/directory/lawyers` | List/filter lawyers |
| Directory | `GET` | `/api/directory/ngos` | List/filter NGOs |
| Directory | `POST` | `/api/directory/import` | Import/sync directory data (Admin) |
| Matching | `GET` | `/api/matches/my` | View matches |
| Matching | `POST` | `/api/matches/generate/{caseId}` | Generate matches for a case |
| Chat | `POST` | `/api/chats/send` | Send message |
| Chat | `GET` | `/api/chats/{matchId}` | Get chat history by match |
| Analytics | `GET` | `/api/analytics/overview` | Overview metrics |
| Analytics | `GET` | `/api/analytics/users` | User metrics |
| Analytics | `GET` | `/api/analytics/cases` | Case metrics |
| Analytics | `GET` | `/api/analytics/matches` | Match metrics |
| Analytics | `GET` | `/api/analytics/kpis` | KPI cards |

## 🧪 Testing & Validation

This project includes backend test coverage for authentication, authorization, security boundaries, and service-level behavior.

Backend tests available include:

- auth registration workflows
- case, appointment, chat, and matching authorization rules
- directory filtering and endpoint security checks
- integration smoke tests for milestone APIs

Run backend tests:

```bash
cd backend
./mvnw test
```

Frontend validation:

```bash
cd frontend
npm run lint
```

Additional validation performed during development:

- manual end-to-end role flow checks (Citizen -> Match -> Provider/Admin actions)
- API validation via authenticated request testing
- null/empty state handling checks across dashboard and list views

## ⚠️ Challenges Faced

- **ID routing issues**
	- Inconsistent ID usage between UI state and backend payload fields caused route/action mismatches in matching and detail views.

- **Null data handling**
	- Some analytics and directory fields were nullable, requiring defensive mapping and fallback rendering to avoid runtime UI errors.

- **Merging directory data**
	- Integrating lawyer and NGO sources with differing schemas required normalization, filtering, and consistent pagination behavior.

## 🔥 Improvements Made

- Refined backend layering (`controller -> service -> repository`) for cleaner separation of concerns.
- Built reusable frontend components for cards, filters, empty states, and dashboards.
- Implemented analytics aggregation services for KPI/trend/geo insights.
- Strengthened role-based routing and endpoint-level security guards.
- Added token refresh interception for smoother authenticated sessions.

## 🚀 Future Enhancements

- AI-powered match scoring and explainable recommendations
- Full real-time chat with expanded WebSocket presence and typing indicators
- Interactive geospatial map integration for case/provider discovery
- Event-driven notifications (email, in-app, push)
- Audit-friendly admin reports and exportable analytics snapshots

## 👨‍💻 Author

- **Name:** Your Name
- **Role:** Full Stack Developer
- **GitHub:** https://github.com/your-username

---

### Resume Value Snapshot

LegalMatch Pro demonstrates practical full-stack engineering with secure authentication, multi-role workflow design, analytics-driven operations, and production-style API architecture in a social impact domain.
