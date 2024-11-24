// page.js
"use client";
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
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
import { Wallet, PlusCircle, Settings, Repeat } from 'lucide-react';
import VaultAccountForm from './components/VaultAccountForm';
import VaultCards from './components/VaultCards';
import AddAssetForm from './components/AddAssetForm';
import TransactionForm from './components/TransactionForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#90caf9',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          minHeight: 48,
          '&.Mui-selected': {
            color: '#90caf9',
          },
        },
      },
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {value === index && children}
      </div>
    </Fade>
  );
}

export default function App() {
  const [vaults, setVaults] = useState([]);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const availableAssets = [
    { id: "BTC", name: "Bitcoin" },
    { id: "ETH", name: "Ethereum" },
    { id: "ETH_TEST5", name: "Ethereum Testnet" },
    { id: "SOL", name: "Solana" },
    { id: "USDC", name: "USD Coin" },
  ];

  useEffect(() => {
    const fetchVaultAccounts = async () => {
      try {
        const res = await fetch("/api/getAllVaultAccounts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch vault accounts");
        setVaults(data.data.accounts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVaultAccounts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.8), rgba(18, 18, 18, 0.95))`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              color="primary.light" 
              sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 1
              }}
            >
              <Wallet size={32} />
              Vault Management
            </Typography>
            <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
              Manage your vault accounts, assets, and transactions securely.
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{ 
                mb: 3, 
                backgroundColor: "rgba(211, 47, 47, 0.15)",
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {response && (
            <Alert
              severity="success"
              sx={{ 
                mb: 3, 
                backgroundColor: "rgba(56, 142, 60, 0.15)",
                '& .MuiAlert-icon': {
                  color: '#4caf50'
                }
              }}
              onClose={() => setResponse(null)}
            >
              Operation completed successfully
            </Alert>
          )}

          {/* Main Content */}
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: 'rgba(18, 18, 18, 0.95)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#90caf9',
                },
              }}
            >
              <Tab 
                icon={<Wallet size={18} />} 
                iconPosition="start" 
                label="Vaults Overview" 
              />
              <Tab 
                icon={<PlusCircle size={18} />} 
                iconPosition="start" 
                label="Create Vault" 
              />
              <Tab 
                icon={<Settings size={18} />} 
                iconPosition="start" 
                label="Add Assets" 
              />
              <Tab 
                icon={<Repeat size={18} />} 
                iconPosition="start" 
                label="Create Transaction" 
              />
            </Tabs>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <TabPanel value={activeTab} index={0}>
                <VaultCards vaults={vaults} />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <VaultAccountForm onResponse={setVaults} onError={setError} />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <AddAssetForm vaults={vaults} onResponse={setResponse} onError={setError} />
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <TransactionForm 
                  vaults={vaults} 
                  availableAssets={availableAssets} 
                  onResponse={setResponse} 
                  onError={setError} 
                />
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
