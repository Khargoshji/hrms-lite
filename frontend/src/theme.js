import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a237e",        // Deep indigo
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00897b",        // Teal accent
      light: "#4ebaaa",
      dark: "#005b4f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#5a5a7a",
    },
    success: { main: "#2e7d32" },
    error: { main: "#c62828" },
    warning: { main: "#e65100" },
    info: { main: "#0277bd" },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.5px" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.2px" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1a237e 0%, #534bae 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          border: "1px solid rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f0f2ff",
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#1a237e",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "#fafbff" },
        },
      },
    },
  },
});

export default theme;
