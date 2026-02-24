import React from "react";
import { Alert, Box } from "@mui/material";

export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <Box mb={2}>
      <Alert severity="error" variant="outlined">
        {message}
      </Alert>
    </Box>
  );
}
