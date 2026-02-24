import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import Footer from "./components/Footer";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [attendanceEmployee, setAttendanceEmployee] = useState(null);
  const theme = useTheme();

  const handleViewAttendance = (emp) => {
    setAttendanceEmployee(emp);
    setActivePage("attendance");
  };

  const handleNavigate = (page) => {
    if (page !== "attendance") setAttendanceEmployee(null);
    setActivePage(page);
  };

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    employees: "Employee Management",
    attendance: "Attendance",
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <EmployeesPage onViewAttendance={handleViewAttendance} />;
      case "attendance":
        return <AttendancePage preselectedEmployee={attendanceEmployee} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { md: 0 },
          minWidth: 0,
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              edge="start"
              sx={{ display: { md: "none" } }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
              {PAGE_TITLES[activePage]}
            </Typography>
            <Chip
              label={new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              size="small"
              variant="outlined"
              color="primary"
            />
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              AD
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2.5, md: 3.5 }, maxWidth: 1200 }}>
          {renderPage()}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}
