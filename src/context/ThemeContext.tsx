import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#7A68B3' : '#8E7BC8',
        light: mode === 'light' ? '#9A8CC8' : '#A596D9',
        dark: mode === 'light' ? '#5A4B8C' : '#6E5EA3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'light' ? '#E4567F' : '#FF6B9F',
        light: mode === 'light' ? '#EC7B9B' : '#FF8DB5',
        dark: mode === 'light' ? '#B43A61' : '#D9487E',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#FF8C42',
        light: mode === 'light' ? '#FFA66B' : '#FFA573',
        dark: mode === 'light' ? '#E67324' : '#E67E4D',
      },
      warning: {
        main: '#FFD166',
        light: mode === 'light' ? '#FFE08C' : '#FFE066',
        dark: mode === 'light' ? '#E6B84D' : '#E6C84D',
      },
      background: {
        default: mode === 'light' ? '#F9F8FC' : '#1A1724',
        paper: mode === 'light' ? '#FFFFFF' : '#2C2638',
      },
      text: {
        primary: mode === 'light' ? '#2D2A33' : '#FFFFFF',
        secondary: mode === 'light' ? '#595667' : '#D8D5E2',
      },
      divider: mode === 'light' ? 'rgba(89, 86, 103, 0.12)' : 'rgba(216, 213, 226, 0.12)',
      action: {
        active: mode === 'light' ? '#7A68B3' : '#8E7BC8',
        hover: mode === 'light' ? 'rgba(122, 104, 179, 0.08)' : 'rgba(142, 123, 200, 0.08)',
        selected: mode === 'light' ? 'rgba(122, 104, 179, 0.16)' : 'rgba(142, 123, 200, 0.16)',
        disabled: mode === 'light' ? 'rgba(89, 86, 103, 0.38)' : 'rgba(216, 213, 226, 0.38)',
        disabledBackground: mode === 'light' ? 'rgba(89, 86, 103, 0.12)' : 'rgba(216, 213, 226, 0.12)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      h2: {
        fontWeight: 600,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      h3: {
        fontWeight: 600,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      h4: {
        fontWeight: 600,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      h5: {
        fontWeight: 600,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      h6: {
        fontWeight: 600,
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      subtitle1: {
        color: mode === 'light' ? '#595667' : '#D8D5E2',
      },
      subtitle2: {
        color: mode === 'light' ? '#595667' : '#D8D5E2',
      },
      body1: {
        color: mode === 'light' ? '#2D2A33' : '#FFFFFF',
      },
      body2: {
        color: mode === 'light' ? '#595667' : '#D8D5E2',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#7A68B3' : '#8E7BC8',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light'
              ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0px 4px 6px -1px rgba(0, 0, 0, 0.2), 0px 2px 4px -1px rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#7A68B3' : '#8E7BC8',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#F9F8FC' : '#2C2638',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: mode === 'light' ? 'rgba(89, 86, 103, 0.12)' : 'rgba(216, 213, 226, 0.12)',
          },
          head: {
            backgroundColor: mode === 'light' ? '#F9F8FC' : '#2C2638',
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
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};