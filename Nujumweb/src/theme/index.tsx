import React from 'react';
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Custom theme hook that adapts to user preferences
export const useAppTheme = (): Theme => {
  const { state } = useAuth();

  // Dark/Light mode configuration
  const isDark = state.themeMode === 'dark';

  // Base theme options
  const baseThemeOptions = {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#90CAF9' : '#2196F3', // Accessible blue (lighter in dark mode)
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#81C784' : '#4CAF50', // Accessible green (lighter in dark mode)
        contrastText: '#ffffff',
      },
      error: {
        main: '#F44336', // Accessible red
      },
      warning: {
        main: '#FF9800',
      },
      info: {
        main: '#2196F3',
      },
      success: {
        main: '#4CAF50',
      },
      background: {
        default: isDark ? '#121212' : '#ffffff',
        paper: isDark ? '#1e1e1e' : '#f8f9fa',
      },
      text: {
        primary: isDark ? '#ffffff' : '#212529',
        secondary: isDark ? '#b0b0b0' : '#6c757d',
      },
      ...(isDark && {
        divider: '#333333',
      }),
    },

    typography: {
      fontFamily: state.language === 'ar' ? '"Noto Sans Arabic", "Segoe UI", Roboto, sans-serif' : '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        marginBottom: '1rem',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        marginBottom: '0.875rem',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
        marginBottom: '0.75rem',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5rem',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.5rem',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none' as const,
        fontWeight: 500,
        fontSize: '1rem',
      },
    },

    spacing: 8,

    shape: {
      borderRadius: 8,
    },

    // Component overrides for accessibility
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 44, // WCAG touch target size
            minWidth: 44,
            fontSize: '1rem',
            padding: '12px 24px',
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
            '&:active': {
              boxShadow: 'none',
            },
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              minHeight: 56, // Increased from standard 48px
              fontSize: '1rem',
            },
          },
        },
      },

      MuiFormControl: {
        styleOverrides: {
          root: {
            marginBottom: '1rem',
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            marginBottom: '0.5rem',
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: 12,
            '& svg': {
              fontSize: '1.5rem',
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            padding: 12,
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 56, // WCAG list item height
            padding: '16px',
            borderRadius: 8,
            marginBottom: 4,
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.08)',
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            border: 'none',
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#212529',
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.1)',
            minHeight: 64, // WCAG header height
          },
        },
      },

      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 80, // Larger bottom navigation for mobile
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            boxShadow: isDark ? '0 -2px 12px rgba(0,0,0,0.3)' : '0 -2px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },

    // RTL support
    direction: state.language === 'ar' ? 'rtl' : 'ltr',
  } as const;

  // Accessibility mode modifications
  let themeModifiers = {};

  if (state.accessibilityMode === 'blind') {
    themeModifiers = {
      palette: {
        ...baseThemeOptions.palette,
        text: {
          primary: '#000000',
          secondary: '#000000',
        },
        background: {
          default: '#ffffff',
          paper: '#ffffff',
        },
      },
      typography: {
        ...baseThemeOptions.typography,
        fontSize: 18, // Larger font size
      },
      components: {
        ...baseThemeOptions.components,
        MuiButton: {
          ...baseThemeOptions.components?.MuiButton,
          styleOverrides: {
            ...baseThemeOptions.components?.MuiButton?.styleOverrides,
            root: {
              ...baseThemeOptions.components?.MuiButton?.styleOverrides?.root,
              minHeight: 64, // Even larger for screen readers
              minWidth: 64,
              fontSize: '1.25rem',
            },
          },
        },
      },
    };
  } else if (state.accessibilityMode === 'deaf') {
    themeModifiers = {
      palette: {
        ...baseThemeOptions.palette,
        // High contrast colors for better visibility
        primary: {
          main: '#000000',
        },
        secondary: {
          main: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#333333',
        },
      },
    };
  } else if (state.accessibilityMode === 'motor-impaired') {
    themeModifiers = {
      components: {
        ...baseThemeOptions.components,
        MuiButton: {
          ...baseThemeOptions.components?.MuiButton,
          styleOverrides: {
            ...baseThemeOptions.components?.MuiButton?.styleOverrides,
            root: {
              ...baseThemeOptions.components?.MuiButton?.styleOverrides?.root,
              minHeight: 80, // Much larger touch targets
              minWidth: 80,
              fontSize: '1.25rem',
              margin: '0.5rem',
            },
          },
        },
        MuiTextField: {
          ...baseThemeOptions.components?.MuiTextField,
          styleOverrides: {
            ...baseThemeOptions.components?.MuiTextField?.styleOverrides,
            root: {
              ...baseThemeOptions.components?.MuiTextField?.styleOverrides?.root,
              '& .MuiInputBase-root': {
                minHeight: 72, // Larger input fields
                fontSize: '1.25rem',
              },
            },
          },
        },
      },
    };
  }

  // Merge base theme with accessibility modifications
  const themeOptions = {
    ...baseThemeOptions,
    ...themeModifiers,
    palette: {
      ...baseThemeOptions.palette,
      ...(themeModifiers as any).palette,
    },
    typography: {
      ...baseThemeOptions.typography,
      ...(themeModifiers as any).typography,
    },
    components: {
      ...baseThemeOptions.components,
      ...(themeModifiers as any).components,
    },
  };

  return createTheme(themeOptions);
};

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppTheme();

  return (
    <div dir={theme.direction}>
      {children}
    </div>
  );
};

// Wrapper component that makes theme available inside AuthProvider
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  );
};
