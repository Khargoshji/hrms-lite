# HRMS Lite — Human Resource Management System

A lightweight, production-ready Human Resource Management System built as a full-stack web application. Manage employees and track daily attendance with a clean, professional interface.

---

## 🖥️ Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | `https://hrms-lite.vercel.app` *(update after deploy)* |
| **Backend API** | `https://hrms-lite-api.onrender.com` *(update after deploy)* |
| **API Docs** | `https://hrms-lite-api.onrender.com/docs` |

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

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Material UI v6, Axios |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | MySQL 8 + SQLAlchemy ORM |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

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
│   ├── render.yaml          # Render deploy config
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
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
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
# Edit .env → set your DATABASE_URL:
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
# Edit .env.local → confirm backend URL:
# REACT_APP_API_BASE_URL=http://localhost:8000

# Start the dev server
npm start
```

Frontend is now running at: http://localhost:3000

---

## 🚀 Deployment

### Backend → Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Provision a MySQL database**
   - Go to **Dashboard → New → MySQL**
   - Note the **Internal Connection String** (use this as `DATABASE_URL`)
   - Or use **PlanetScale** / **Railway** / **Aiven** for a free-tier MySQL

3. **Deploy the backend web service**
   - Go to **Dashboard → New → Web Service**
   - Connect your GitHub repository
   - Set **Root Directory** to `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variable:
     ```
     DATABASE_URL = mysql+pymysql://user:pass@host:3306/hrms_lite
     ```
   - Click **Create Web Service**

4. Copy your Render service URL (e.g., `https://hrms-lite-api.onrender.com`)

---

### Frontend → Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**
   - Click **Add New → Project**
   - Select your repository
   - Set **Root Directory** to `frontend`

3. **Add environment variable** in Vercel project settings:
   ```
   REACT_APP_API_BASE_URL = https://hrms-lite-api.onrender.com
   ```

4. Click **Deploy** — Vercel will build and host your React app

5. Your frontend URL will be something like `https://hrms-lite.vercel.app`

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
| Email format | Pydantic `EmailStr` validates format |
| Duplicate Employee ID | Returns 400 with clear error message |
| Duplicate Email | Returns 400 with clear error message |
| Duplicate attendance | One record per employee per date enforced |
| Employee not found | Returns 404 for invalid IDs |

---

## ⚠️ Assumptions & Limitations

- **No authentication**: Single admin user assumed; no login required
- **MySQL only**: Uses `pymysql` driver; PostgreSQL would need `psycopg2` and a URL change
- **Render free tier**: Backend may sleep after 15 min inactivity — first request may be slow (~30s)
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

© 2025 **Kiran Yadav**. All rights reserved.
