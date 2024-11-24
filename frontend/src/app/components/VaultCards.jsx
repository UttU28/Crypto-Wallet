// components/VaultCards.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import { Wallet, Database, CircleDollarSign } from 'lucide-react';

export default function VaultCards({ vaults }) {
  const [selectedVault, setSelectedVault] = useState(null);

  console.log('hi', vaults)
  const handleVaultClick = (vault) => {
    setSelectedVault(vault);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Left Side - Vault List */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" color="primary.light" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Wallet size={24} />
            All Vaults
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {vaults.map((vault) => (
              <Card
                key={vault.id}
                onClick={() => handleVaultClick(vault)}
                sx={{
                  backgroundColor: selectedVault?.id === vault.id 
                    ? 'rgba(144, 202, 249, 0.1)' 
                    : 'rgba(18, 18, 18, 0.95)',
                  color: 'white',
                  border: '1px solid',
                  borderColor: selectedVault?.id === vault.id 
                    ? 'rgba(144, 202, 249, 0.5)' 
                    : 'rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color="primary.light" sx={{ fontWeight: 600 }}>
                        {vault.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5 
                        }}
                      >
                        <Database size={12} />
                        {vault.id}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${vault.assets?.length || 0} Assets`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(144, 202, 249, 0.1)',
                        color: 'primary.light',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Right Side - Vault Details */}
        <Grid item xs={12} md={6}>
          {selectedVault ? (
            <Paper
              sx={{
                p: 4,
                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                height: '100%',
                minHeight: '400px',
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" color="primary.light" sx={{ fontWeight: 600 }}>
                  {selectedVault.name}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5 
                  }}
                >
                  <Database size={16} />
                  ID: {selectedVault.id}
                </Typography>
              </Box>

              <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <Typography 
                variant="h6" 
                color="primary.light" 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircleDollarSign size={20} />
                Assets
              </Typography>

              {selectedVault.assets?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedVault.assets.map((asset, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          borderColor: 'rgba(144, 202, 249, 0.2)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                          Asset ID: {asset.id}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'primary.light',
                            fontWeight: 600,
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                          }}
                        >
                          {asset.balance}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.5)">
                    No assets available in this vault
                  </Typography>
                </Box>
              )}
            </Paper>
          ) : (
            <Box
              sx={{
                height: '100%',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
              }}
            >
              <Typography variant="body1" color="rgba(255, 255, 255, 0.5)">
                Select a vault to view details
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}