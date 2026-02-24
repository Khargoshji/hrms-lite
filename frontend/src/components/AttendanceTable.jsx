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
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { getAttendance, deleteAttendance } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";

const STATUS_COLORS = { Present: "success", Absent: "error" };

export default function AttendanceTable({ employee, refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ from_date: "", to_date: "", status: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    if (!employee) return;
    setLoading(true);
    setError("");
    const active = {};
    if (filters.from_date) active.from_date = filters.from_date;
    if (filters.to_date) active.to_date = filters.to_date;
    if (filters.status) active.status = filters.status;
    getAttendance(employee.employee_id, active)
      .then(setRecords)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [employee, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const clearFilters = () =>
    setFilters({ from_date: "", to_date: "", status: "" });

  const hasFilters = filters.from_date || filters.to_date || filters.status;

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAttendance(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetch();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!employee) {
    return (
      <Card>
        <CardContent sx={{ p: 3.5 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <EventNoteIcon color="primary" />
            <Typography variant="h6">Attendance Records</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <EmptyState
            title="No employee selected"
            subtitle="Click the calendar icon on an employee to view their attendance"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={1.5}
            mb={2}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EventNoteIcon color="primary" />
                <Typography variant="h6">Attendance — {employee.full_name}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" ml={4.5}>
                {employee.employee_id} · {employee.department}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip label={`✓ ${presentCount} Present`} color="success" size="small" />
              <Chip label={`✗ ${absentCount} Absent`} color="error" size="small" />
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Filters */}
          <Box mb={2.5}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <FilterListIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Filters
              </Typography>
              {hasFilters && (
                <Button
                  size="small"
                  startIcon={<ClearIcon fontSize="small" />}
                  onClick={clearFilters}
                  color="inherit"
                  sx={{ ml: "auto", fontSize: "0.75rem" }}
                >
                  Clear
                </Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="From Date"
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.from_date}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, from_date: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="To Date"
                  type="date"
                  size="small"
                  fullWidth
                  value={filters.to_date}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, to_date: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Status"
                  select
                  size="small"
                  fullWidth
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 0 }} />
          <ErrorAlert message={error} />

          {loading ? (
            <LoadingSpinner message="Loading attendance records…" />
          ) : records.length === 0 ? (
            <EmptyState
              title="No attendance records"
              subtitle={
                hasFilters
                  ? "No records match your filters"
                  : "No records marked yet for this employee"
              }
            />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((rec, idx) => (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <Typography variant="body2" color="text.disabled">
                          {idx + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(rec.date + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rec.status}
                          size="small"
                          color={STATUS_COLORS[rec.status] || "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete record">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteDialog({ open: true, id: rec.id })
                            }
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Attendance Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this attendance record?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            disabled={deleting}
          >
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
