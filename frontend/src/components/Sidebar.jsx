import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "employees", label: "Employees", icon: <PeopleAltIcon /> },
  { id: "attendance", label: "Attendance", icon: <EventAvailableIcon /> },
];

export default function Sidebar({ activePage, onNavigate }) {
  

  const content = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        background: "linear-gradient(180deg, #1a237e 0%, #0d1757 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3.5 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          color="white"
          letterSpacing="-0.5px"
        >
          HRMS <span style={{ color: "#4ebaaa", fontWeight: 400 }}>Lite</span>
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
          Human Resource System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Nav */}
      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => onNavigate(item.id)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 1.2,
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                bgcolor: isActive
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: isActive ? "#4ebaaa" : "rgba(255,255,255,0.55)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
          v1.0.0 · Admin Panel
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      {content}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
