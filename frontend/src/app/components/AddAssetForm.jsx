// components/AddAssetForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Typography,
  Container,
  Fade,
  Chip,
  Tooltip,
} from '@mui/material';
import { PlusCircle, Wallet, Coins, Info } from 'lucide-react';

const AVAILABLE_ASSETS = [
  { id: 'BTC', name: 'Bitcoin', icon: '₿' },
  { id: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { id: 'ETH_TEST5', name: 'Ethereum Testnet', icon: 'Ξ' },
  { id: 'SOL', name: 'Solana', icon: '◎' },
  { id: 'USDC', name: 'USD Coin', icon: '$' },
];

export default function AddAssetForm({ vaults, onResponse, onError }) {
  const [formData, setFormData] = useState({
    vaultAccountId: '',
    assetId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError(null);
    onResponse(null);

    try {
      const res = await fetch('/api/addVaultAsset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add asset to vault');
      onResponse(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedVault = vaults.find(v => v.id === formData.vaultAccountId);

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <PlusCircle size={28} color="#90caf9" />
          <Typography variant="h5" color="primary.light" fontWeight={600}>
            Add Asset to Vault
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl variant="outlined">
              <InputLabel id="vault-select-label">Select Vault Account</InputLabel>
              <Select
                labelId="vault-select-label"
                name="vaultAccountId"
                value={formData.vaultAccountId}
                onChange={handleInputChange}
                required
                label="Select Vault Account"
                startAdornment={
                  <Wallet size={18} style={{ marginRight: '8px', opacity: 0.7 }} />
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                  },
                }}
              >
                {vaults.map((vault) => (
                  <MenuItem key={vault.id} value={vault.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{vault.name}</Typography>
                      <Chip 
                        label={`${vault.assets?.length || 0} assets`}
                        size="small"
                        sx={{ 
                          ml: 2,
                          backgroundColor: 'rgba(144, 202, 249, 0.1)',
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedVault && (
              <Fade in={true}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(144, 202, 249, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(144, 202, 249, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="primary.light" sx={{ mb: 1 }}>
                    Selected Vault Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedVault.id}
                  </Typography>
                </Box>
              </Fade>
            )}

            <FormControl variant="outlined" required>
              <InputLabel id="asset-select-label">Select Asset</InputLabel>
              <Select
                labelId="asset-select-label"
                name="assetId"
                value={formData.assetId}
                onChange={handleInputChange}
                label="Select Asset"
                startAdornment={
                  <Coins size={18} style={{ marginRight: '8px', opacity: 0.7 }} />
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                  },
                }}
              >
                {AVAILABLE_ASSETS.map((asset) => (
                  <MenuItem 
                    key={asset.id} 
                    value={asset.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      width: '100%',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                          }}
                        >
                          {asset.icon}
                        </Typography>
                        <Typography>{asset.name}</Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          px: 1,
                          py: 0.5,
                          borderRadius: '4px',
                        }}
                      >
                        {asset.id}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 2,
                backgroundColor: '#90caf9',
                '&:hover': {
                  backgroundColor: '#42a5f5',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(144, 202, 249, 0.3)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlusCircle size={20} />
                  Add Asset to Vault
                </Box>
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}