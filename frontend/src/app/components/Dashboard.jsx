import React, { useState, useEffect } from 'react'
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
  Button,
  Divider,
  useTheme,
} from '@mui/material'
import { Wallet, PlusCircle, Settings, Repeat, LogOut } from 'lucide-react'
import VaultAccountForm from './VaultAccountForm'
import VaultCards from './VaultCards'
import AddAssetForm from './AddAssetForm'
import TransactionForm from './TransactionForm'
import { useRouter } from 'next/navigation'

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
  )
}

export default function Dashboard() {
  const theme = useTheme()
  const [vaults, setVaults] = useState([])
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  const availableAssets = [
    { id: 'BTC', name: 'Bitcoin' },
    { id: 'ETH', name: 'Ethereum' },
    { id: 'ETH_TEST5', name: 'Ethereum Testnet' },
    { id: 'SOL', name: 'Solana' },
    { id: 'USDC', name: 'USD Coin' },
  ]

  useEffect(() => {
    const fetchVaultAccounts = async () => {
      try {
        const email = localStorage.getItem('email')
        const res = await fetch(`/api/getAllVaultAccounts?email=${email}`)
        const data = await res.json()
        if (!res.ok)
          throw new Error(data.error || 'Failed to fetch vault accounts')
        setVaults(data)
      } catch (err) {
        setError(err.message)
      }
    }

    const email = localStorage.getItem('email')
    if (email) {
      setUserEmail(email)
    } else {
      router.push('/login')
    }

    fetchVaultAccounts()
  }, [router])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleLogout = () => {
    localStorage.removeItem('email')
    router.push('/login')
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, 
            ${theme.palette.background.default} 0%,
            rgba(18, 18, 18, 0.95) 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Enhanced Header */}
          <Paper
            elevation={3}
            sx={{
              mb: 4,
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                    color: theme.palette.primary.light,
                    '& svg': {
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    },
                  }}
                >
                  <Wallet
                    size={36}
                    strokeWidth={2}
                    style={{ color: theme.palette.primary.light }}
                  />
                  Vault Management
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Manage your vault accounts, assets, and transactions securely.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'flex-start', md: 'flex-end' },
                  gap: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Logged in as:{' '}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.light,
                    }}
                  >
                    {userEmail}
                  </Typography>
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  startIcon={<LogOut />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: theme.palette.error.dark,
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                    '&:hover': {
                      background: theme.palette.error.main,
                      boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                '& .MuiAlert-icon': {
                  color: '#f44336',
                },
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
                backgroundColor: 'rgba(56, 142, 60, 0.15)',
                '& .MuiAlert-icon': {
                  color: '#4caf50',
                },
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
              overflow: 'hidden',
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
                <AddAssetForm
                  vaults={vaults}
                  onResponse={setResponse}
                  onError={setError}
                />
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
    </>
  )
}