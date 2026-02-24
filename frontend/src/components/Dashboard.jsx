import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { getDashboard } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";

function StatCard({ icon, label, value, color }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1.5}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: `${color}.50`,
              color: `${color}.main`,
              display: "flex",
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Fetching dashboard data…" />;
  if (error) return <ErrorAlert message={error} />;
  if (!stats) return null;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of your workforce at a glance
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleAltIcon />}
            label="Total Employees"
            value={stats.total_employees}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AssignmentIcon />}
            label="Attendance Records"
            value={stats.total_attendance_records}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircleOutlineIcon />}
            label="Present Today"
            value={stats.present_today}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CancelOutlinedIcon />}
            label="Absent Today"
            value={stats.absent_today}
            color="error"
          />
        </Grid>
      </Grid>

      {stats.departments.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
              Active Departments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={1}>
              {stats.departments.map((dept) => (
                <Chip
                  key={dept}
                  label={dept}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
