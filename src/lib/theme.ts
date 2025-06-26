import { createTheme, ThemeOptions } from '@mui/material/styles';

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288d1',
      light: '#03dac6',
      dark: '#018786',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    divider: '#e0e0e0',
  },
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#81d4fa',
      light: '#b3e5fc',
      dark: '#29b6f6',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#4caf50',
      contrastText: '#000000',
    },
    error: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#f44336',
      contrastText: '#000000',
    },
    divider: '#424242',
  },
});

export const chartColors = {
  light: {
    income: '#4caf50',
    expense: '#f44336',
    categories: [
      '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336',
      '#00bcd4', '#795548', '#607d8b', '#3f51b5', '#8bc34a'
    ],
  },
  dark: {
    income: '#66bb6a',
    expense: '#ef5350',
    categories: [
      '#90caf9', '#81c784', '#ffb74d', '#ba68c8', '#e57373',
      '#4dd0e1', '#a1887f', '#90a4ae', '#7986cb', '#aed581'
    ],
  },
};
