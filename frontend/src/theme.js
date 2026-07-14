import { defaultTheme } from 'react-admin';

export const oilDashboardTheme = {
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#6366f1',
      dark: '#3730a3',
    },
    secondary: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#1e293b' },
    h2: { fontWeight: 600, color: '#1e293b' },
    h3: { fontWeight: 600, color: '#1e293b' },
    h4: { fontWeight: 600, color: '#1e293b' },
    h5: { fontWeight: 500, color: '#1e293b' },
    h6: { fontWeight: 500, color: '#1e293b' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(5, 150, 105, 0.03) 100%)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          '& .RaDatagrid-headerCell': {
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
            fontWeight: 600,
            color: '#1e293b',
          },
          '& .RaDatagrid-row:hover': {
            backgroundColor: 'rgba(79, 70, 229, 0.04)',
          },
        },
      },
    },
  },
};
