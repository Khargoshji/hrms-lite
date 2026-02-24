import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";

export default function AttendancePage({ preselectedEmployee }) {
  const [selectedEmployee, setSelectedEmployee] = useState(
    preselectedEmployee || null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => setRefreshKey((k) => k + 1);

  const handleEmployeeChange = (emp) => {
    setSelectedEmployee(emp);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        Attendance Management
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Mark and view daily attendance records for employees
      </Typography>

      <Box mb={3}>
        <AttendanceForm
          preselectedEmployee={selectedEmployee}
          onSuccess={handleSuccess}
        />
      </Box>

      <AttendanceTable
        employee={selectedEmployee}
        refreshTrigger={refreshKey}
      />
    </Box>
  );
}
