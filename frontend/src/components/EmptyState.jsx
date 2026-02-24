import React from "react";
import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ title = "No data found", subtitle = "" }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      gap={1.5}
    >
      <InboxIcon sx={{ fontSize: 56, color: "text.disabled" }} />
      <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.disabled">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
