'use client'; // This must be a Client Component because MUI is client-side

import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {

  const [theme] = useState(() =>
    createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#14b8a6', 
          contrastText: '#ffffff',
        },
        background: {
          default: '#0f172a',
          paper: '#1e293b',
        },
        success: { main: '#10b981' },
        info: { main: '#3b82f6' },    
        warning: { main: '#f59e0b' },
        error: { main: '#ef4444' }, 
      },
      typography: {
        fontFamily: 'var(--font-inter), sans-serif',
        button: {
          textTransform: 'none', 
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 8, 
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
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
    })
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline guarantees standard HTML elements match the theme initially */}
      <CssBaseline />
      
      {/* 
        Toaster provides floating success/error notifications at the top right.
        We style the Toast boxes slightly transparent (glassmorphism) for a premium feel.
      */}
      <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1e293b',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1e293b',
              },
            },
          }} 
      />
      
      {/* Render the rest of the app */}
      {children}
    </ThemeProvider>
  );
}
