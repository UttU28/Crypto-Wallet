// components/TransactionForm.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Typography,
  CircularProgress,
  Container,
  Fade,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import { 
  Repeat, 
  Wallet, 
  ExternalLink, 
  ArrowRightCircle, 
  Info,
  Coins,
} from 'lucide-react';

const formatBalance = (balance) => {
  const num = parseFloat(balance);
  return num.toFixed(6);
};

export default function TransactionForm({ vaults, availableAssets, onResponse, onError }) {
  const [formData, setFormData] = useState({
    assetId: '',
    amount: '',
    sourceVaultId: '',
    destinationVaultId: '',
    externalAddress: '',
    isExternal: false,
    note: '',
  });
  const [loading, setLoading] = useState(false);

  // Filter vaults that have the selected asset
  const filteredVaults = useMemo(() => {
    if (!formData.assetId) return [];
    return vaults.filter(vault => 
      vault.assets?.some(asset => asset.id === formData.assetId)
    );
  }, [vaults, formData.assetId]);

  // Get asset balance for a specific vault
  const getAssetBalance = (vault) => {
    const asset = vault.assets?.find(a => a.id === formData.assetId);
    return asset?.balance || '0';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Reset vault selections when asset changes
      if (name === 'assetId') {
        newData.sourceVaultId = '';
        newData.destinationVaultId = '';
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError(null);
    onResponse(null);

    try {
      const res = await fetch('/api/createTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create transaction');
      onResponse(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedSourceVault = vaults.find(v => v.id === formData.sourceVaultId);
  const selectedAsset = availableAssets.find(a => a.id === formData.assetId);

  return (
    <Container maxWidth="md">
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
          <Repeat size={28} color="#90caf9" />
          <Typography variant="h5" color="primary.light" fontWeight={600}>
            Create Transaction
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Asset Selection */}
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
                {availableAssets.map((asset) => (
                  <MenuItem key={asset.id} value={asset.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                      <Typography>{asset.name}</Typography>
                      <Chip 
                        label={asset.id}
                        size="small"
                        sx={{ 
                          ml: 2,
                          backgroundColor: 'rgba(144, 202, 249, 0.1)',
                          color: 'primary.light',
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Amount Field */}
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: selectedAsset && (
                  <Typography sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {selectedAsset.id}
                  </Typography>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                  },
                },
              }}
            />

            {/* Source Vault */}
            <FormControl variant="outlined" required>
              <InputLabel id="source-vault-label">Source Vault</InputLabel>
              <Select
                labelId="source-vault-label"
                name="sourceVaultId"
                value={formData.sourceVaultId}
                onChange={handleInputChange}
                label="Source Vault"
                disabled={!formData.assetId}
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
                {filteredVaults.map((vault) => {
                  const balance = getAssetBalance(vault);
                  const balanceNum = parseFloat(balance);
                  
                  return (
                    <MenuItem key={vault.id} value={vault.id}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        width: '100%' 
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography>{vault.name}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: balanceNum > 0 ? '#4caf50' : '#ffc107',
                              fontWeight: 500 
                            }}
                          >
                            <Coins size={13} style={{ marginRight: '2px', opacity: 0.7 }} /> {formatBalance(balance)}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`${vault.assets?.length || 0} assets`}
                          size="small"
                          sx={{ 
                            ml: 2,
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                          }}
                        />
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {selectedSourceVault && (
              <Fade in={true}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(144, 202, 249, 0.05)',
                  borderRadius: 1,
                  border: '1px solid rgba(144, 202, 249, 0.1)'
                }}>
                  <Typography variant="subtitle2" color="primary.light" sx={{ mb: 1 }}>
                    Source Vault Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedSourceVault.id}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: parseFloat(getAssetBalance(selectedSourceVault)) > 0 ? '#4caf50' : '#ffc107',
                      fontWeight: 500,
                      mt: 1 
                    }}
                  >
                    
                    <Coins size={13} style={{ marginRight: '2px', opacity: 0.7 }} /> {formatBalance(getAssetBalance(selectedSourceVault))}
                  </Typography>
                </Box>
              </Fade>
            )}

            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Destination Type Selection */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 1,
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Typography variant="subtitle2" color="primary.light" sx={{ mb: 2 }}>
                Select Destination Type
              </Typography>
              <RadioGroup
                name="isExternal"
                value={formData.isExternal}
                onChange={(e) => handleInputChange({ 
                  target: { 
                    name: 'isExternal', 
                    value: e.target.value === 'true' 
                  } 
                })}
                row
                sx={{ mb: 1 }}
              >
                <FormControlLabel 
                  value={false} 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Wallet size={16} />
                      Vault Account
                    </Box>
                  }
                />
                <FormControlLabel 
                  value={true} 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ExternalLink size={16} />
                      External Address
                    </Box>
                  }
                />
              </RadioGroup>

              {/* Conditional Destination Input */}
              {formData.isExternal ? (
                <TextField
                  label="External Address"
                  name="externalAddress"
                  value={formData.externalAddress}
                  onChange={handleInputChange}
                  placeholder="Enter address starting with 0x..."
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(144, 202, 249, 0.5)',
                      },
                    },
                  }}
                />
              ) : (
                <FormControl fullWidth required>
                  <InputLabel id="destination-vault-label">Destination Vault</InputLabel>
                  <Select
                    labelId="destination-vault-label"
                    name="destinationVaultId"
                    value={formData.destinationVaultId}
                    onChange={handleInputChange}
                    label="Destination Vault"
                    disabled={!formData.assetId || !formData.sourceVaultId}
                    startAdornment={
                      <ArrowRightCircle size={18} style={{ marginRight: '8px', opacity: 0.7 }} />
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
                    {filteredVaults
                      .filter(v => v.id !== formData.sourceVaultId)
                      .map((vault) => {
                        const balance = getAssetBalance(vault);
                        const balanceNum = parseFloat(balance);
                        
                        return (
                          <MenuItem key={vault.id} value={vault.id}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              width: '100%' 
                            }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>{vault.name}</Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: balanceNum > 0 ? '#4caf50' : '#ffc107',
                                    fontWeight: 500 
                                  }}
                                >
                                  $ {formatBalance(balance)}
                                </Typography>
                              </Box>
                              <Chip 
                                label={`${vault.assets?.length || 0} assets`}
                                size="small"
                                sx={{ 
                                  ml: 2,
                                  backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                }}
                              />
                            </Box>
                          </MenuItem>
                        );
                    })}
                  </Select>
                </FormControl>
              )}
            </Box>

            {/* Transaction Note */}
            <TextField
              label="Transaction Note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                  },
                },
              }}
            />

            {/* Submit Button */}
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
                  <Repeat size={20} />
                  Create Transaction
                </Box>
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}