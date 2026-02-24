# HRMS Lite — Human Resource Management System

A lightweight, production-ready Human Resource Management System built as a full-stack web application. Manage employees and track daily attendance with a clean, professional interface.

---

## 🖥️ Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://hrms-lite-beryl-ten.vercel.app/ |
| **Backend API** | https://hrms-lite-production-544e.up.railway.app/ |
| **API Docs** | https://hrms-lite-production-544e.up.railway.app/docs |
| **GitHub Repo** | https://github.com/Khargoshji/hrms-lite |

---

## 📸 Features

### Employee Management
- ➕ Add employees with unique ID, name, validated email, and department
- 📋 View all employees in a searchable table with present/absent counts
- 🗑️ Delete employee (cascades to all attendance records)

### Attendance Management
- ✅ Mark attendance (Present / Absent) for any employee on any date
- 📅 View attendance history per employee
- 🔍 Filter records by date range and status
- 🗑️ Delete individual attendance records

### Dashboard
- 📊 Total employees, attendance records, present/absent today
- 🏢 Active departments summary

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **UI Library** | Material UI v6 (MUI) | Components and styling |
| **HTTP Client** | Axios | API calls from frontend |
| **Backend** | FastAPI (Python 3.11) | REST API server |
| **ORM** | SQLAlchemy | Database models and queries |
| **Validation** | Pydantic v2 | Request/response validation |
| **Database** | MySQL 8 | Data storage |
| **DB Driver** | PyMySQL | Python MySQL connector |
| **Frontend Deploy** | Vercel | Hosting React frontend |
| **Backend Deploy** | Railway | Hosting FastAPI backend |
| **Database Host** | Railway MySQL | Online MySQL database |

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app, CORS, routers
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   ├── models.py        # Employee & Attendance ORM models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── routes/
│   │       ├── employees.py # POST, GET, DELETE /employees
│   │       ├── attendance.py# POST, GET, DELETE /attendance
│   │       └── dashboard.py # GET /dashboard
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── EmployeeForm.jsx
    │   │   ├── EmployeeList.jsx
    │   │   ├── AttendanceForm.jsx
    │   │   ├── AttendanceTable.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── ErrorAlert.jsx
    │   ├── pages/
    │   │   ├── EmployeesPage.jsx
    │   │   └── AttendancePage.jsx
    │   ├── services/
    │   │   └── api.js       # Axios service layer
    │   ├── theme.js          # MUI custom theme
    │   ├── App.jsx
    │   └── index.js
    ├── package.json
    ├── vercel.json
    └── .env.example
```

---

## ⚡ Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8 running locally

---

### 1. Clone the repository

```bash
git clone https://github.com/Khargoshji/hrms-lite.git
cd hrms-lite
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create MySQL database
mysql -u root -p
CREATE DATABASE hrms_lite;
EXIT;

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL:
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/hrms_lite

# Start the API server (tables are auto-created on first run)
uvicorn app.main:app --reload --port 8000
```

API is now running at: http://localhost:8000
Swagger docs: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and set backend URL:
# REACT_APP_API_BASE_URL=http://localhost:8000

# Start the dev server
npm start
```

Frontend is now running at: http://localhost:3000

---

## 🚀 Deployment

### Tools Used for Deployment

| What | Tool | Why |
|------|------|-----|
| **Frontend Hosting** | Vercel | Free, connects to GitHub, auto-deploys |
| **Backend Hosting** | Railway | Free trial, supports Python/FastAPI |
| **Database Hosting** | Railway MySQL | Free MySQL database with Railway project |
| **Version Control** | GitHub | Source code repository |

---

### Backend + Database → Railway

1. **Create account** at [railway.app](https://railway.app) and login with GitHub

2. **Create New Project → MySQL**
   - Wait for MySQL to come Online
   - Go to **Variables** tab and copy **MYSQL_PUBLIC_URL**
   - Change `mysql://` to `mysql+pymysql://` in the copied URL

3. **Deploy Backend**
   - Click **+ Create → GitHub Repository**
   - Select `hrms-lite` repository
   - Set **Root Directory** to `backend`
   - Go to **Variables** tab and add:
     ```
     DATABASE_URL = mysql+pymysql://your_railway_mysql_url
     ```
   - Go to **Settings → Deploy** and set Start Command:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - Click **Deploy** ✅

4. Copy your Railway backend URL from **Settings → Networking → Generate Domain**

---

### Frontend → Vercel

1. **Create account** at [vercel.com](https://vercel.com) and login with GitHub

2. **Import GitHub repository**
   - Click **Add New → Project**
   - Select `hrms-lite` repository
   - Set **Root Directory** to `frontend`

3. **Add environment variable:**
   ```
   REACT_APP_API_BASE_URL = https://your-railway-backend-url.up.railway.app
   ```

4. Click **Deploy** ✅

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Health check |
| `POST` | `/employees/` | Add employee |
| `GET` | `/employees/` | List all employees (with stats) |
| `GET` | `/employees/{id}` | Get single employee |
| `DELETE` | `/employees/{id}` | Delete employee |
| `POST` | `/attendance/` | Mark attendance |
| `GET` | `/attendance/{employee_id}` | Get attendance (supports `?from_date`, `?to_date`, `?status` filters) |
| `DELETE` | `/attendance/{id}` | Delete attendance record |
| `GET` | `/dashboard/` | Dashboard summary |

---

## ✅ Validation Rules

| Rule | Detail |
|------|--------|
| Required fields | All fields validated server-side (400 if missing) |
| Email format | Pydantic EmailStr validates format |
| Duplicate Employee ID | Returns 400 with clear error message |
| Duplicate Email | Returns 400 with clear error message |
| Duplicate attendance | One record per employee per date enforced |
| Employee not found | Returns 404 for invalid IDs |

---

## ⚠️ Assumptions & Limitations

- **No authentication**: Single admin user assumed; no login required
- **MySQL only**: Uses PyMySQL driver; PostgreSQL would need psycopg2 and a URL change
- **Railway free trial**: 30 days free — upgrade needed after trial ends
- **No pagination**: Employee and attendance lists load all records; suitable for small teams
- **No edit/update**: Employees and attendance can be added or deleted but not edited
- **Timezone**: Dates stored as-is; no timezone conversion applied
- **Leave & payroll**: Out of scope per requirements

---

## 🎁 Bonus Features Implemented

- [x] Filter attendance records by date range and status
- [x] Display total present/absent days per employee in the employee list
- [x] Dashboard summary with today's attendance counts and department list

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for full text.

---

© 2026 **Kiran Yadav**. All rights reserved.
