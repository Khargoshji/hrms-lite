import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

export default function EmployeesPage({ onViewAttendance }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        Employee Management
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Add, view, and manage your organisation's employees
      </Typography>

      <Box mb={3}>
        <EmployeeForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      </Box>

      <EmployeeList
        refreshTrigger={refreshKey}
        onViewAttendance={onViewAttendance}
      />
    </Box>
  );
}
