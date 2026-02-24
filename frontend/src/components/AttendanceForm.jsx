import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  Autocomplete,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getEmployees, markAttendance } from "../services/api";

const STATUS_OPTIONS = ["Present", "Absent"];

const todayStr = () => new Date().toISOString().split("T")[0];

export default function AttendanceForm({ preselectedEmployee, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [date, setDate] = useState(todayStr());
  const [status, setStatus] = useState("Present");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => {});
  }, []);

  useEffect(() => {
    if (preselectedEmployee) {
      setSelectedEmp(preselectedEmployee);
    }
  }, [preselectedEmployee]);

  const validate = () => {
    const errs = {};
    if (!selectedEmp) errs.employee = "Please select an employee.";
    if (!date) errs.date = "Date is required.";
    if (!status) errs.status = "Status is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError("");
    setSuccess("");
    try {
      await markAttendance({
        employee_id: selectedEmp.employee_id,
        date,
        status,
      });
      setSuccess(
        `Attendance marked: ${selectedEmp.full_name} — ${status} on ${date}`
      );
      setDate(todayStr());
      setStatus("Present");
      onSuccess && onSuccess();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <EventAvailableIcon color="secondary" />
          <Typography variant="h6">Mark Attendance</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
            {apiError}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={5}>
              <Autocomplete
                options={employees}
                getOptionLabel={(o) => `${o.full_name} (${o.employee_id})`}
                value={selectedEmp}
                onChange={(_, val) => {
                  setSelectedEmp(val);
                  setFieldErrors((p) => ({ ...p, employee: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    size="small"
                    error={!!fieldErrors.employee}
                    helperText={fieldErrors.employee}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setFieldErrors((p) => ({ ...p, date: "" }));
                }}
                fullWidth
                size="small"
                error={!!fieldErrors.date}
                helperText={fieldErrors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Status"
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <EventAvailableIcon />
                  )
                }
              >
                {submitting ? "Saving…" : "Mark Attendance"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
