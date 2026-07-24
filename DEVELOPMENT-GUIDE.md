# Sub-City Letter Tracking System — Developer Guide

> Written for junior developers joining the project. Read this before touching any code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [How to Set Up (Step by Step)](#4-how-to-set-up)
5. [How to Run](#5-how-to-run)
6. [Database Structure](#6-database-structure)
7. [Backend Code Walkthrough](#7-backend-code-walkthrough)
8. [Frontend Code Walkthrough](#8-frontend-code-walkthrough)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Letter Workflow](#10-letter-workflow)
11. [API Reference](#11-api-reference)
12. [How to Add a New Feature](#12-how-to-add-a-new-feature)
13. [Common Mistakes & Fixes](#13-common-mistakes--fixes)

---

## 1. Project Overview

This is a **Letter Management System** for Sub-City Administration and Police Departments. It tracks incoming and outgoing letters, manages approvals, and provides reports.

**What it does:**
- Registers incoming letters (from citizens, other offices)
- Creates outgoing letters (official responses)
- Sends letters between departments
- Tracks who has what letter and its status
- Generates reports

**Users & Roles:**

| Role | What they can do |
|------|-----------------|
| SystemAdministrator | Full access — manage users, orgs, departments, all letters |
| SubCityAdministrator | Manage sub-city staff and letters |
| PoliceAdministrator | Manage police department letters |
| DepartmentOfficer | View and process letters assigned to their department |
| Clerk | Register new letters |
| ReadOnlyUser | View only |

---

## 2. Architecture

```
SUBCITY/
├── backend/                          ← ASP.NET Core Web API (C#)
│   └── SubCityLetterSystem.Api/
│       ├── Controllers/              ← API endpoints (what the frontend calls)
│       ├── Data/                     ← Database connection + seed data
│       ├── DTOs/                     ← Data shapes sent between frontend ↔ backend
│       ├── Models/Entities/          ← Database table definitions
│       ├── Models/Enums/             ← Fixed lists (roles, priorities, statuses)
│       └── Services/                 ← Business logic (the "brain")
│
├── frontend/                         ← Next.js (React + TypeScript)
│   └── src/
│       ├── app/                      ← Pages (each folder = a URL)
│       ├── components/               ← Reusable UI pieces
│       ├── lib/                      ← API client + auth helpers
│       └── types/                    ← TypeScript interfaces
│
└── database/
    └── init.sql                      ← SQL Server table creation script
```

**How data flows:**

```
User clicks button in browser
        ↓
Frontend (Next.js) sends HTTP request to backend
        ↓
Backend Controller receives request
        ↓
Backend Service does business logic
        ↓
Backend reads/writes Database (SQL Server)
        ↓
Backend sends JSON response back
        ↓
Frontend displays the data
```

---

## 3. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 + React 19 + TypeScript | Modern React framework with SSR |
| Styling | Tailwind CSS | Utility-first CSS, fast to build UI |
| HTTP Client | Axios | Makes API calls easier |
| Charts | Recharts | React charting library |
| Icons | Lucide React | Clean, consistent icons |
| Backend | ASP.NET Core 9 (C#) | Microsoft's web framework |
| Database | SQL Server 2019 | Relational database |
| Authentication | JWT (JSON Web Tokens) | Stateless login tokens |
| ORM | Entity Framework Core | C# code talks to database |

---

## 4. How to Set Up

### Prerequisites
- SQL Server 2019 installed (you have this: `DESKTOP-J59LUHK\SA`)
- .NET 9 SDK installed (you have this)
- Node.js installed (you have v24)

### Step 1: Create the Database
Open Command Prompt or PowerShell:
```powershell
& "C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\SQLCMD.EXE" -S "DESKTOP-J59LUHK\SA" -U sa -P 123456 -i "C:\genius-erp\SUBCITY\database\init.sql"
```
This creates all 9 tables with indexes.

### Step 2: Configure Backend Connection
Edit `backend/SubCityLetterSystem.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-J59LUHK\\SA;Database=SubCityLetterSystem;User Id=sa;Password=123456;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Step 3: Install Frontend Dependencies
```powershell
cd C:\sc-frontend
npm install --legacy-peer-deps
```

---

## 5. How to Run

You need **TWO terminals** open at the same time:

### Terminal 1 — Backend (API Server)
```powershell
cd C:\genius-erp\SUBCITY\backend\SubCityLetterSystem.Api
dotnet run
```
- API runs on: **http://localhost:5000**
- Swagger docs: **http://localhost:5000/swagger**
- On first run, it seeds 2 organizations, 6 departments, 3 users

### Terminal 2 — Frontend (Website)
```powershell
cd C:\sc-frontend
npm run dev
```
- Website runs on: **http://localhost:3000**

### Login Credentials
| Username | Password | Role |
|----------|----------|------|
| `admin` | `Admin@123` | System Administrator |
| `subadmin` | `Sub@123` | Sub-City Admin |
| `clerk` | `Clerk@123` | Clerk |

---

## 6. Database Structure

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐
│  Organizations   │     │    Users         │
│─────────────────│     │─────────────────│
│ Id (PK)         │◄────│ OrganizationId   │
│ Name            │     │ Id (PK)         │
│ Code            │     │ FullName        │
│ Description     │     │ Email           │
│ IsActive        │     │ Username        │
└─────────────────┘     │ PasswordHash    │
        │               │ Role            │
        │               │ DepartmentId    │──┐
        ▼               └─────────────────┘  │
┌─────────────────┐                          │
│  Departments     │◄─────────────────────────┘
│─────────────────│
│ Id (PK)         │     ┌─────────────────┐
│ Name            │     │    Letters       │
│ Code            │     │─────────────────│
│ OrganizationId  │────►│ Id (PK)         │
│ ParentDeptId    │     │ LetterNumber    │── UNIQUE
│ IsActive        │     │ Subject         │
└─────────────────┘     │ Body            │
                        │ Priority        │── Low, Normal, High, Urgent
                        │ Status          │── Draft, Submitted, Approved, Sent, Received, Closed, Rejected
                        │ SenderId ──────────► Users.Id
                        │ ReceiverId ─────────► Users.Id
                        │ SenderDeptId ───────► Departments.Id
                        │ ReceiverDeptId ─────► Departments.Id
                        │ IsIncoming       │── true = received, false = sent
                        │ DueDate          │
                        │ CreatedAt        │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
┌─────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ LetterMovements      │ │ LetterComments   │ │ LetterAttachments│
│─────────────────────│ │──────────────────│ │──────────────────│
│ LetterId ──────────►│ │ LetterId ───────►│ │ LetterId ──────►│
│ FromUserId ────────►│ │ UserId ─────────►│ │ FileName         │
│ ToUserId            │ │ Comment          │ │ FilePath         │
│ Action              │ │ CreatedAt        │ │ ContentType      │
│ Notes               │ └──────────────────┘ │ FileSize         │
│ CreatedAt           │                      │ UploadedById ───►│
└─────────────────────┘                      └──────────────────┘

┌─────────────────┐     ┌─────────────────┐
│  Notifications   │     │   AuditLogs      │
│─────────────────│     │─────────────────│
│ UserId ────────►│     │ UserId ────────►│
│ Title           │     │ Action          │
│ Message         │     │ EntityType      │
│ Type            │     │ EntityId        │
│ IsRead          │     │ OldValues       │
│ CreatedAt       │     │ NewValues       │
└─────────────────┘     │ CreatedAt       │
                        └─────────────────┘
```

### Seed Data

| Table | Data |
|-------|------|
| Organizations | Sub-City Administration (SUB), Police Department (POL) |
| Departments | Administration, Finance, Planning, Investigation, Patrol, Records |
| Users | admin (SystemAdmin), subadmin (SubCityAdmin), clerk (Clerk) |

### Key Columns Explained

**Letters table — the core of the system:**
- `LetterNumber`: Auto-generated like `OUT-20260724-0001` or `IN-20260724-0001`
- `IsIncoming`: `true` = letter received from outside, `false` = letter we created
- `Status`: Current stage in the workflow (see Section 10)
- `SenderId`: Who created/sent the letter
- `ReceiverId`: Who should receive/process the letter
- `SenderDepartmentId` / `ReceiverDepartmentId`: For department-level routing
- `IsDeleted`: Soft delete (never actually remove from database)

---

## 7. Backend Code Walkthrough

### 7.1 Entry Point — Program.cs
```
Program.cs wires everything together:
1. Configures JWT authentication
2. Registers all services (dependency injection)
3. Sets up CORS (allows frontend to call backend)
4. Creates database if it doesn't exist
5. Seeds initial data
```

### 7.2 Models — What the Database Looks Like in C#
```csharp
// Models/Entities/Letter.cs
public class Letter
{
    public int Id { get; set; }              // Primary key
    public string LetterNumber { get; set; } // Unique number like OUT-20260724-0001
    public string Subject { get; set; }      // What the letter is about
    public string Body { get; set; }         // Full letter content
    public LetterPriority Priority { get; set; } // Low, Normal, High, Urgent
    public LetterStatus Status { get; set; }     // Draft → Submitted → Approved → ...
    public int SenderId { get; set; }        // FK → Users
    public int? ReceiverId { get; set; }     // FK → Users (nullable)
    // ... more fields
}
```

### 7.3 Enums — Fixed Lists
```csharp
// Models/Enums/Enums.cs
public enum UserRole {
    SystemAdministrator, SubCityAdministrator, PoliceAdministrator,
    DepartmentOfficer, Clerk, ReadOnlyUser
}

public enum LetterStatus {
    Draft, Submitted, Approved, Sent, Received, Closed, Rejected
}

public enum LetterPriority {
    Low, Normal, High, Urgent
}
```

### 7.4 DbContext — How C# Talks to SQL Server
```csharp
// Data/AppDbContext.cs
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();     // Maps to Users table
    public DbSet<Letter> Letters => Set<Letter>(); // Maps to Letters table
    // ... etc

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define relationships, indexes, constraints here
    }
}
```

### 7.5 Services — Business Logic Layer
```csharp
// Services/LetterService.cs
public class LetterService : ILetterService
{
    private readonly AppDbContext _context;

    public async Task<LetterDetailDto> CreateLetterAsync(CreateLetterDto dto, int userId)
    {
        // 1. Generate unique letter number
        // 2. Create Letter entity
        // 3. Add movement record
        // 4. Save to database
        // 5. Return the created letter
    }
}
```

**Rule:** Controllers call Services. Services contain business logic. Services talk to the database through DbContext. Never put business logic in Controllers.

### 7.6 Controllers — API Endpoints
```csharp
// Controllers/LettersController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]  // Must be logged in
public class LettersController : ControllerBase
{
    [HttpGet]          // GET /api/letters
    public async Task<...> GetLetters([FromQuery] LetterSearchDto search)

    [HttpPost]         // POST /api/letters
    public async Task<...> CreateLetter([FromBody] CreateLetterDto dto)

    [HttpGet("{id}")]  // GET /api/letters/5
    public async Task<...> GetLetter(int id)

    [HttpPut("{id}/status")]  // PUT /api/letters/5/status
    public async Task<...> UpdateStatus(int id, [FromBody] UpdateLetterStatusDto dto)
}
```

### 7.7 DTOs — Data Shapes
DTOs (Data Transfer Objects) define what data goes back and forth:
```csharp
// Sent from frontend when creating a letter:
public class CreateLetterDto
{
    public string Subject { get; set; }
    public string Body { get; set; }
    public string Priority { get; set; }
    public int? ReceiverId { get; set; }
    // ...
}

// Sent back to frontend with full letter details:
public class LetterDetailDto
{
    public int Id { get; set; }
    public string LetterNumber { get; set; }
    // ... all fields + nested movements, comments, attachments
}

// Standard API response wrapper:
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
}
```

---

## 8. Frontend Code Walkthrough

### 8.1 Pages — Each Folder is a URL
```
src/app/
├── layout.tsx          → Root layout (wraps ALL pages)
├── page.tsx            → Home page (redirects to /login or /dashboard)
├── globals.css         → Global styles
├── login/page.tsx      → /login
├── dashboard/page.tsx  → /dashboard
├── letters/page.tsx    → /letters (all letters list)
├── letters/new/page.tsx → /letters/new (create form)
├── letters/[id]/page.tsx → /letters/5 (letter detail)
├── inbox/page.tsx      → /inbox
├── outbox/page.tsx     → /outbox
├── search/page.tsx     → /search
├── users/page.tsx      → /users
├── organizations/page.tsx → /organizations
├── departments/page.tsx → /departments
└── reports/page.tsx    → /reports
```

### 8.2 Components — Reusable Pieces
```
src/components/
├── Layout/
│   ├── Sidebar.tsx     → Left navigation menu
│   ├── Header.tsx      → Top bar with notifications
│   └── Layout.tsx      → Wraps pages with Sidebar + Header
├── Letters/
│   ├── LetterList.tsx
│   ├── LetterForm.tsx
│   └── LetterDetail.tsx
└── common/
    ├── DataTable.tsx   → Generic table component
    ├── StatusBadge.tsx  → Colored status labels
    ├── PriorityBadge.tsx → Colored priority labels
    └── Pagination.tsx   → Page navigation
```

### 8.3 API Client — lib/api.ts
```typescript
// All API calls go through this:
import api from '@/lib/api'

// Automatically adds JWT token to every request
// Automatically redirects to /login on 401 errors

// Usage example:
const response = await api.get('/letters', { params: { page: 1 } })
// Sends GET http://localhost:5000/api/letters?page=1
// with Authorization header
```

### 8.4 Auth Helpers — lib/auth.ts
```typescript
import { login, logout, isAuthenticated, getStoredUser } from '@/lib/auth'

await login('admin', 'Admin@123')  // Stores token in localStorage
isAuthenticated()                    // Checks if token exists
getStoredUser()                      // Gets user info from localStorage
logout()                             // Clears token, redirects to /login
```

### 8.5 CRITICAL: The `mounted` Pattern

**Every page MUST use this pattern** to avoid hydration errors:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function MyPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)  // ← Start as false

  useEffect(() => {
    setMounted(true)                              // ← Set true on client only
    if (!isAuthenticated()) {
      router.replace('/login')                    // ← Redirect in useEffect, NOT in render
    }
  }, [router])

  if (!mounted) return null                       // ← Don't render until client-side

  return <div>Page content</div>
}
```

**Why?** Next.js renders pages on the server first, then sends to the browser. `localStorage` doesn't exist on the server, so `isAuthenticated()` returns different values on server vs browser = crash.

**NEVER do this:**
```tsx
// ❌ BAD — crashes React
if (!isAuthenticated()) {
  router.push('/login')  // ← Calling setState during render = CRASH
  return null
}
```

**Always do this:**
```tsx
// ✅ GOOD — safe
useEffect(() => {
  if (!isAuthenticated()) {
    router.replace('/login')
  }
}, [])
```

---

## 9. Authentication & Authorization

### How Login Works
1. User enters username + password on login page
2. Frontend sends POST to `/api/auth/login`
3. Backend checks username exists + password matches (BCrypt hash)
4. Backend generates JWT token (contains user ID, role, expiry)
5. Token stored in browser's `localStorage`
6. Every subsequent API call includes `Authorization: Bearer <token>` header

### How Authorization Works
- `[Authorize]` attribute = must be logged in
- `[Authorize(Roles = "SystemAdministrator")]` = must have that specific role
- Role is embedded in JWT token, checked by ASP.NET automatically

### JWT Token Payload
```json
{
  "sub": "1",                    // User ID
  "unique_name": "admin",        // Username
  "email": "admin@subcity.gov.et",
  "role": "SystemAdministrator",
  "FullName": "System Administrator",
  "OrganizationId": "1",
  "DepartmentId": "1",
  "exp": 1785499879              // Expiry (7 days)
}
```

---

## 10. Letter Workflow

### Status Flow
```
                    ┌─────────────────────────────────────────┐
                    │                                         │
Draft ──► Submitted ──► Approved ──► Sent ──► Received ──► Closed
                    │
                    └──► Rejected (with reason)
```

### Who Does What
| Step | Action | Who Can Do It |
|------|--------|---------------|
| Draft | Create letter | Clerk, Officer, Admin |
| Draft → Submitted | Submit for approval | Clerk, Officer |
| Submitted → Approved | Approve the letter | Admin, Department Head |
| Approved → Sent | Mark as sent | Admin, Clerk |
| Sent → Received | Mark as received by destination | Admin, Receiver |
| Received → Closed | Mark as completed | Admin, Receiver |
| Submitted → Rejected | Reject with reason | Admin |

### What Happens at Each Step
1. **Draft** → Letter created, not visible to receiver yet
2. **Submitted** → Letter is queued for approval
3. **Approved** → Someone with authority approved it
4. **Sent** → Letter has been dispatched to receiver
5. **Received** → Receiver has seen and acknowledged the letter
6. **Closed** → Processing complete, letter archived
7. **Rejected** → Sent back with a reason, may need revision

### Movement Tracking
Every status change creates a **LetterMovement** record:
```
LetterMovement: { LetterId: 5, FromUser: "clerk", Action: "Created", Notes: "Letter created" }
LetterMovement: { LetterId: 5, FromUser: "clerk", Action: "Submitted", Notes: "Submitted for review" }
LetterMovement: { LetterId: 5, FromUser: "admin", Action: "Approved", Notes: "Approved" }
```

---

## 11. API Reference

### Authentication
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | `{ username, password }` | Returns JWT token |
| GET | `/api/auth/me` | — | Returns current user info |
| POST | `/api/auth/change-password` | `{ currentPassword, newPassword }` | Change password |

### Letters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/letters` | Search/filter all letters |
| GET | `/api/letters/{id}` | Get letter detail + movements + comments |
| POST | `/api/letters` | Create new letter |
| PUT | `/api/letters/{id}/status` | Change status (submit, approve, send, etc.) |
| POST | `/api/letters/{id}/comments` | Add comment to letter |
| DELETE | `/api/letters/{id}` | Soft delete letter |
| GET | `/api/letters/inbox` | Letters sent to me |
| GET | `/api/letters/outbox` | Letters I sent |
| GET | `/api/letters/generate-number` | Get next letter number |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (Admin only) |
| GET | `/api/users/{id}` | Get user details |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| PATCH | `/api/users/{id}/toggle-status` | Enable/disable user |

### Organizations & Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | List all organizations |
| POST | `/api/organizations` | Create organization |
| GET | `/api/departments` | List all departments |
| POST | `/api/departments` | Create department |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard stats + charts data |
| GET | `/api/reports/letters` | Letter report with filters |
| GET | `/api/reports/monthly` | Monthly stats for a year |
| GET | `/api/reports/department-performance` | Department performance metrics |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/{id}/read` | Mark one as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## 12. How to Add a New Feature

### Example: Add a "Letter Priority Filter" to the Search page

**Step 1:** Backend — The filter already exists in `LetterSearchDto.priority`. No backend changes needed.

**Step 2:** Frontend — Open `app/search/page.tsx`, add priority field to the form:
```tsx
<select
  value={form.priority}
  onChange={(e) => setForm({ ...form, priority: e.target.value })}
  className="border rounded-lg px-3 py-2 text-sm"
>
  <option value="">All Priorities</option>
  <option value="Low">Low</option>
  <option value="Normal">Normal</option>
  <option value="High">High</option>
  <option value="Urgent">Urgent</option>
</select>
```

### Example: Add a New Database Table

1. Create entity in `Models/Entities/YourEntity.cs`
2. Add `DbSet<YourEntity>` in `Data/AppDbContext.cs`
3. Add relationships in `OnModelCreating` in AppDbContext
4. Create DTO in `DTOs/YourDto.cs`
5. Create interface in `Services/IYourService.cs`
6. Create implementation in `Services/YourService.cs`
7. Create controller in `Controllers/YourController.cs`
8. Register service in `Program.cs`: `builder.Services.AddScoped<IYourService, YourService>()`
9. Create frontend page in `app/your-page/page.tsx`
10. Add navigation link in `components/Layout/Sidebar.tsx`

---

## 13. Common Mistakes & Fixes

### Mistake 1: "Cannot update a component while rendering"
**Cause:** Calling `router.push()` outside of `useEffect`
**Fix:** Move it inside `useEffect`

### Mistake 2: "Hydration failed"
**Cause:** Server and client see different values (e.g., `localStorage` only exists on client)
**Fix:** Use the `mounted` pattern (see Section 8.5)

### Mistake 3: "401 Unauthorized" on API calls
**Cause:** Token expired or not being sent
**Fix:** Check `localStorage.getItem('token')` in browser DevTools. Check `lib/api.ts` interceptor.

### Mistake 4: "CORS error" — Frontend can't reach backend
**Cause:** Backend not running, or CORS not configured
**Fix:** Make sure backend is running on port 5000. Check `Program.cs` CORS policy.

### Mistake 5: "Object reference not set to an instance" in backend
**Cause:** Trying to use a null object
**Fix:** Add null checks (`if (x == null) return NotFound()`)

### Mistake 6: Database tables exist but no data
**Cause:** Seed data only runs if tables are empty
**Fix:** Check `SeedData.cs`, look at the `if (!await context.Organizations.AnyAsync())` checks

---

## File Reference

### Backend Files (Important Ones)
| File | What It Does |
|------|-------------|
| `Program.cs` | App startup — DB, auth, services, CORS |
| `appsettings.json` | Connection string, JWT key |
| `Data/AppDbContext.cs` | Database schema |
| `Data/SeedData.cs` | Initial data (orgs, depts, users) |
| `Models/Entities/*.cs` | Database table definitions |
| `Models/Enums/Enums.cs` | Fixed lists (roles, statuses) |
| `Services/LetterService.cs` | Letter business logic |
| `Services/AuthService.cs` | Login + JWT token generation |
| `Controllers/LettersController.cs` | Letter API endpoints |
| `DTOs/Letters/LetterDto.cs` | Letter data shapes |

### Frontend Files (Important Ones)
| File | What It Does |
|------|-------------|
| `src/lib/api.ts` | Axios client with auth |
| `src/lib/auth.ts` | Login/logout/token helpers |
| `src/types/index.ts` | TypeScript type definitions |
| `src/components/Layout/Layout.tsx` | Page wrapper (sidebar + header) |
| `src/components/Layout/Sidebar.tsx` | Navigation menu |
| `src/app/login/page.tsx` | Login form |
| `src/app/dashboard/page.tsx` | Dashboard with charts |
| `src/app/letters/[id]/page.tsx` | Letter detail + actions |

---

**Questions?** Check the Swagger docs at `http://localhost:5000/swagger` to test API endpoints directly.
