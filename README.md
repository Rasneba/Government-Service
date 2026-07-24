# Sub-City Letter Tracking/Exchange System

## Architecture

```
SUBCITY/
├── backend/                          # ASP.NET Core Web API
│   └── SubCityLetterSystem.Api/
│       ├── Controllers/              # API endpoints
│       ├── Data/                     # DbContext, SeedData
│       ├── DTOs/                     # Data Transfer Objects
│       ├── Models/                   # Entities and Enums
│       └── Services/                 # Business logic
├── frontend/                         # Next.js + React + Tailwind
│   └── src/
│       ├── app/                      # Pages
│       ├── components/               # Reusable components
│       ├── lib/                      # API client, auth utilities
│       └── types/                    # TypeScript interfaces
└── database/
    └── init.sql                      # SQL Server schema
```

## Getting Started

### Backend
1. Open `backend/SubCityLetterSystem.Api/` in Visual Studio or VS Code
2. Update `appsettings.json` connection string for your SQL Server
3. Run: `dotnet restore && dotnet run`
4. API runs on `http://localhost:5000`
5. Swagger UI at `http://localhost:5000/swagger`

### Frontend
1. `cd frontend`
2. `npm install`
3. Set `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `http://localhost:5000/api`)
4. `npm run dev`
5. App runs on `http://localhost:3000`

### Database
- Run `database/init.sql` against your SQL Server instance
- Or use EF Core migrations: `dotnet ef database update`

## Default Users
| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | SystemAdministrator |
| subadmin | Sub@123 | SubCityAdministrator |
| clerk | Clerk@123 | Clerk |

## Modules
- User Management (6 roles, RBAC)
- Organization & Department Management
- Incoming/Outgoing Letter Registration
- Approval Workflow (Draft → Submitted → Approved → Sent → Received → Closed)
- Letter Exchange (Sub-City ↔ Police ↔ Departments)
- Tracking with Movement History
- Advanced Search by multiple criteria
- Reports (Letter, Monthly, Department Performance)
- Notifications (Dashboard alerts)
- Dashboard with charts and activity timeline