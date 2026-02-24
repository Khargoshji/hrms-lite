import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { addEmployee } from "../services/api";

const INITIAL = { employee_id: "", full_name: "", email: "", department: "" };

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const errs = {};
    if (!form.employee_id.trim()) errs.employee_id = "Employee ID is required.";
    if (!form.full_name.trim()) errs.full_name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.department.trim()) errs.department = "Department is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      await addEmployee(form);
      setSuccess(`Employee "${form.full_name}" added successfully!`);
      setForm(INITIAL);
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
          <PersonAddIcon color="primary" />
          <Typography variant="h6">Add New Employee</Typography>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                error={!!errors.employee_id}
                helperText={errors.employee_id || "Must be unique (e.g. EMP001)"}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={!!errors.department}
                helperText={errors.department || "e.g. Engineering, HR, Finance"}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <PersonAddIcon />
                  )
                }
              >
                {submitting ? "Adding…" : "Add Employee"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
