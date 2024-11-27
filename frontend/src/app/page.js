// page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ThemeProvider } from '@mui/material';
import { 
  Box, 
  CssBaseline, 
  Container, 
  Alert, 
  Tabs, 
  Tab, 
  Paper,
  Typography,
  Fade,
} from '@mui/material';
import Dashboard from "./components/Dashboard";
import darkTheme from './theme';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login"); // Redirect to login page if not logged in
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isLoggedIn ? <Dashboard /> : null}
    </ThemeProvider>
  );
}
