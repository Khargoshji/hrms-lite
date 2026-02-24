import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { getEmployees, deleteEmployee } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";

export default function EmployeeList({ refreshTrigger, onViewAttendance }) {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, emp: null });
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    setError("");
    getEmployees()
      .then((data) => {
        setEmployees(data);
        setFiltered(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.employee_id.toLowerCase().includes(q) ||
          e.full_name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  const confirmDelete = (emp) => setDeleteDialog({ open: true, emp });
  const cancelDelete = () => setDeleteDialog({ open: false, emp: null });

  const handleDelete = async () => {
    if (!deleteDialog.emp) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteDialog.emp.employee_id);
      cancelDelete();
      fetchEmployees();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={2}
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <PeopleAltIcon color="primary" />
              <Typography variant="h6">Employees</Typography>
              {!loading && (
                <Chip
                  label={employees.length}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            <TextField
              placeholder="Search employees…"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 260 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Divider sx={{ mb: 0 }} />

          <ErrorAlert message={error} />

          {loading ? (
            <LoadingSpinner message="Loading employees…" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={search ? "No matching employees" : "No employees yet"}
              subtitle={search ? "Try a different search term" : "Add your first employee above"}
            />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="center">Present</TableCell>
                    <TableCell align="center">Absent</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.employee_id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          {emp.employee_id}
                        </Typography>
                      </TableCell>
                      <TableCell>{emp.full_name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {emp.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={emp.department} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={emp.total_present}
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ minWidth: 36 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={emp.total_absent}
                          size="small"
                          color="error"
                          variant="filled"
                          sx={{ minWidth: 36 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={0.5}>
                          <Tooltip title="View attendance">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onViewAttendance && onViewAttendance(emp)}
                            >
                              <EventNoteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete employee">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => confirmDelete(emp)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.emp?.full_name}</strong> (
            {deleteDialog.emp?.employee_id})? This will also remove all their
            attendance records. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cancelDelete} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
