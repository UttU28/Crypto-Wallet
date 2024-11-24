// components/VaultAccountForm.jsx
"use client";

import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Shield, Info } from 'lucide-react';

export default function VaultAccountForm({ onResponse, onError }) {
  const [formData, setFormData] = useState({
    name: '',
    hiddenOnUI: false,
    customerRefId: '',
    autoFuel: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError(null);
    onResponse(null);

    try {
      const res = await fetch('/api/createVaultAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create vault account');
      onResponse(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <Shield size={28} color="#90caf9" />
          <Typography variant="h5" color="primary.light" fontWeight={600}>
            Create New Vault Account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Account Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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

            <TextField
              label="Customer Reference ID"
              name="customerRefId"
              value={formData.customerRefId}
              onChange={handleInputChange}
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

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              backgroundColor: 'rgba(144, 202, 249, 0.05)',
              borderRadius: 1,
              p: 2,
              border: '1px solid rgba(144, 202, 249, 0.1)'
            }}>
              <FormControlLabel
                control={
                  <Switch
                    name="hiddenOnUI"
                    checked={formData.hiddenOnUI}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Hidden on UI
                    <Tooltip title="Hide this vault account from the UI">
                      <Info size={16} color="#90caf9" />
                    </Tooltip>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    name="autoFuel"
                    checked={formData.autoFuel}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Auto Fuel
                    <Tooltip title="Enable automatic fueling for this vault">
                      <Info size={16} color="#90caf9" />
                    </Tooltip>
                  </Box>
                }
              />
            </Box>

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
                'Create Vault Account'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}