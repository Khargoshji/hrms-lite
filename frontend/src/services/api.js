import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Response interceptor: normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

// ─── Employee API ─────────────────────────────────────────────────────────────

export const getEmployees = () => api.get("/employees/").then((r) => r.data);

export const getEmployee = (employeeId) =>
  api.get(`/employees/${employeeId}`).then((r) => r.data);

export const addEmployee = (payload) =>
  api.post("/employees/", payload).then((r) => r.data);

export const deleteEmployee = (employeeId) =>
  api.delete(`/employees/${employeeId}`).then((r) => r.data);

// ─── Attendance API ───────────────────────────────────────────────────────────

export const markAttendance = (payload) =>
  api.post("/attendance/", payload).then((r) => r.data);

export const getAttendance = (employeeId, filters = {}) => {
  const params = {};
  if (filters.from_date) params.from_date = filters.from_date;
  if (filters.to_date) params.to_date = filters.to_date;
  if (filters.status) params.status = filters.status;
  return api.get(`/attendance/${employeeId}`, { params }).then((r) => r.data);
};

export const deleteAttendance = (attendanceId) =>
  api.delete(`/attendance/${attendanceId}`).then((r) => r.data);

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const getDashboard = () => api.get("/dashboard/").then((r) => r.data);

export default api;
