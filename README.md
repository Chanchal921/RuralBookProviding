# RuralEdu – Rural Education Resource Sharing Platform

> A full-stack web application designed and implemented in alignment with the **Software Architecture Design (SAD)** and **Software Requirements Specification (SRS)** documentation.

---

## 1. Project Overview

**RuralEdu** is an educational resource sharing platform engineered to bridge the educational divide for rural and underserved schools, teachers, and students. The platform enables individual donors, teachers, and NGOs to donate and upload digital textbooks, chapter summaries, past board question papers, and educational multimedia links. A strict administrative verification workflow ensures that only verified, curriculum-aligned materials enter the public **Digital Library**. Students and schools can also submit requests for missing materials, which are automatically processed through an educational matching engine.

---

## 2. Technology Stack

### Frontend:
- **Framework:** React.js (v18.3) with Vite build tooling
- **Routing:** React Router DOM (v6.26) with role-based protected route guards
- **HTTP Client:** Axios (v1.7) with automatic JWT Bearer token interceptors
- **Styling & UI:** Bootstrap 5.3, Bootstrap Icons, custom responsive educational theme
- **Typography:** Plus Jakarta Sans

### Backend:
- **Runtime & Language:** Java 17 LTS
- **Framework:** Spring Boot 3.3.4
- **Security:** Spring Security 6 with stateless HMAC-SHA256 JWT authentication
- **Persistence:** Spring Data JPA with Hibernate ORM
- **Validation:** Jakarta Bean Validation (Hibernate Validator)
- **API Documentation:** SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Build Tool:** Apache Maven 3.9+

### Database & Storage:
- **Database:** MySQL 8.0+ (MySQL Workbench compatible relational schema)
- **File Storage:** Local server-side file storage with UUID isolation, MIME validation, and configurable upload path

---

## 3. System Architecture & UML Alignment

RuralEdu follows a **Three-Tier Layered Architecture**:

```
+-----------------------------------------------------------+
|                     PRESENTATION TIER                     |
|           React.js + Vite SPA (Client Browser)            |
|   (Public Library, Upload Form, Matching View, Dashboards)|
+-----------------------------------------------------------+
                             |
                   RESTful APIs / JSON / Multipart
                             |
+-----------------------------------------------------------+
|                     APPLICATION TIER                      |
|                 Spring Boot 3.x Backend                   |
|  Controllers -> Services -> Repositories -> Security/JWT  |
+-----------------------------------------------------------+
                             |
             JDBC / Hibernate SQL ORM & Local Disk
                             |
+-----------------------------------------------------------+
|                        DATA TIER                          |
|         MySQL Database (users, resources, requests)       |
|            + Local File Storage (PDFs/Documents)          |
+-----------------------------------------------------------+
```

### UML Lifecycle Alignments:

#### 1. Resource Lifecycle (State Machine Diagram)
```
[Uploaded by Donor/Teacher/NGO]
               |
               v
          +---------+
          | PENDING |
          +---------+
          /         \
 (Admin Approves)   (Admin Rejects)
        /             \
       v               v
  +----------+    +----------+
  | APPROVED |    | REJECTED |
  +----------+    +----------+
       |
(Admin Deactivates)
       |
       v
+-------------+
| DEACTIVATED |
+-------------+
```
- **PENDING:** Initial state upon upload. Visible only to uploader and Admin.
- **APPROVED:** Published in the public Digital Library for search and download.
- **REJECTED:** Did not meet curriculum criteria. Retained with admin remarks.
- **DEACTIVATED:** Retired or outdated syllabus edition removed from the public library.

#### 2. Resource Request Lifecycle (State Machine Diagram)
```
[Submitted by Student/Teacher]
               |
               v
          +---------+
          | PENDING |
          +---------+
         /     |     \
(Auto-Match)   |      \ (Admin Rejects)
       v       |       v
  +---------+  |  +----------+
  | MATCHED |  |  | REJECTED |
  +---------+  |  +----------+
       \       |      /
        v      v     v
       +----------+
       | APPROVED |
       +----------+
            |
    (Admin Completes)
            |
            v
      +-----------+
      | COMPLETED |
      +-----------+
```

---

## 4. User Roles & Demo Credentials

The backend seeds demonstration accounts for each actor. Passwords are encrypted with **BCrypt**:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@ruraledu.org` | `Admin@123` | Full verification, approve/reject resources, user & request administration |
| **STUDENT** | `aarav.student@ruraledu.org` | `password123` | Browse library, download materials, request missing resources, track requests |
| **DONOR** | `sunita.donor@ruraledu.org` | `password123` | Upload books/notes, donate educational items, track approval status |
| **TEACHER** | `ramesh.teacher@ruraledu.org` | `password123` | Access library, upload classroom materials, request kits for students |
| **NGO** | `contact@sevatrust.org` | `password123` | Community resource uploads, track village requests, donate materials |

> **Self-Registration Note:** Anyone can register as `STUDENT`, `DONOR`, `TEACHER`, or `NGO`. Self-registration as `ADMIN` is strictly forbidden by the backend. The primary admin account is securely bootstrapped by the backend `DataInitializer`.

---

## 5. Local Setup and Execution Guide (Windows)

### Prerequisites:
1. **Java JDK 17 or higher** (`java -version`)
2. **Apache Maven 3.8+** (`mvn -version`)
3. **Node.js (v18+) & npm** (`node -v`, `npm -v`)
4. **MySQL Server 8.0+** running locally on port 3306

---

### Step 1: Database Setup (MySQL Workbench)
1. Open **MySQL Workbench** and connect to your local MySQL instance.
2. Open and execute `database/schema.sql`:
   - Creates the database `ruraledu_db`
   - Defines all tables, primary keys, foreign keys, and indexes.
3. (Optional) Execute `database/seed.sql` to populate sample data:
   - *Note:* The Spring Boot backend's `DataInitializer` also automatically seeds missing master catalogs and demo users on startup!

---

### Step 2: Backend Configuration & Execution
1. Navigate to the `backend/` directory:
   ```powershell
   cd backend
   ```
2. Check or edit database credentials in `src/main/resources/application.properties` (or set environment variables):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ruraledu_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run backend tests to verify environment:
   ```powershell
   mvn test
   ```
4. Start the Spring Boot server:
   ```powershell
   mvn spring-boot:run
   ```
5. The backend will start on: **`http://localhost:8080`**
   - **Swagger / OpenAPI UI:** `http://localhost:8080/swagger-ui.html`
   - **API Docs JSON:** `http://localhost:8080/api-docs`

---

### Step 3: Frontend Configuration & Execution
1. Open a new terminal and navigate to the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```cmd
   npm.cmd install
   ```
3. Start the Vite development server:
   ```cmd
   npm.cmd run dev
   ```
4. Open your browser and navigate to: **`http://localhost:5173`**

---

## 6. Core REST API Endpoints

### Authentication:
- `POST /api/auth/register` – Register a new user (Student, Donor, Teacher, NGO)
- `POST /api/auth/login` – Authenticate with email/password and obtain JWT Bearer token
- `GET /api/auth/me` – Retrieve currently authenticated user profile

### Master Catalogs:
- `GET /api/metadata/all` – Get all Resource Types, Subjects, and Class Levels

### Resources & Digital Library:
- `GET /api/resources` – Browse and search approved resources with keyword, subject, class, and type filters
- `GET /api/resources/{id}` – Get resource details (public if approved, or owner/admin)
- `GET /api/resources/{id}/download` – Download attached PDF/document file
- `POST /api/resources` – Upload educational resource (multipart file or external URL; starts as `PENDING`)
- `GET /api/resources/my-uploads` – List resources uploaded by the authenticated user
- `DELETE /api/resources/{id}` – Delete resource (owner if pending, or admin)

### Admin Verification:
- `GET /api/admin/resources` – List resources with status filter (e.g. `PENDING`, `APPROVED`)
- `PUT /api/admin/resources/{id}/approve` – Transition resource status: `PENDING -> APPROVED`
- `PUT /api/admin/resources/{id}/reject` – Transition resource status: `PENDING -> REJECTED`
- `PUT /api/admin/resources/{id}/deactivate` – Transition resource status: `APPROVED -> DEACTIVATED`

### Resource Requests & Matching:
- `POST /api/requests` – Submit request for missing resource (runs automated matching)
- `GET /api/requests/my-requests` – List authenticated user's requests
- `GET /api/requests/{id}` – Get request details and current status
- `GET /api/requests/{id}/matches` – Retrieve candidate approved resources matching the request
- `GET /api/admin/requests` – Admin list of all user requests
- `PUT /api/admin/requests/{id}/status` – Admin update of request lifecycle status

### Dashboards:
- `GET /api/dashboard/student` – Student metrics & recently added resources
- `GET /api/dashboard/donor` – Donor metrics & upload verification status
- `GET /api/dashboard/teacher` – Teacher/School metrics & classroom requests
- `GET /api/dashboard/ngo` – NGO metrics & community outreach statistics
- `GET /api/dashboard/admin` – Central administration platform-wide statistics

---

## 7. Quality & Verification Evidence

All backend components have automated integration tests verifying:
- Prevention of self-registering as ADMIN (`BadRequestException`)
- Enforcement of unique emails
- Password BCrypt encryption and JWT generation
- Resource upload state lifecycle (`PENDING -> APPROVED -> DEACTIVATED`)
- Resource request automated matching against existing library records
- Database aggregate metrics calculation for role-specific dashboards
- State machine transition rules preventing invalid jumps (e.g. approving already approved items)

Run all tests via:
```powershell
mvn test -f backend/pom.xml
```

