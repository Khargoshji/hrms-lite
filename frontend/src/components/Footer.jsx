import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2,
        px: { xs: 2.5, md: 3.5 },
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="caption"
        color="text.disabled"
        display="block"
        textAlign="center"
        letterSpacing="0.3px"
      >
        © {new Date().getFullYear()} <strong style={{ color: "#534bae" }}>Kiran Yadav</strong>
        {" "}· HRMS Lite · All rights reserved.
      </Typography>
    </Box>
  );
}
