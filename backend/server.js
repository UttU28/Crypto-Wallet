const express = require('express');
const cors = require('cors');
const { Fireblocks, BasePath } = require('@fireblocks/ts-sdk');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = 3001;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON request body
app.use(express.json());

// Fireblocks API setup
const fireblocks = new Fireblocks({
  apiKey: 'f365ee88-6aff-44e9-822e-804332e1958c', // Replace with your actual API key
  secretKey: fs.readFileSync('./fireblocks_secret.key', 'utf8'),
  basePath: BasePath.Sandbox, // Use BasePath.Production for production environment
});

async function getVaultPagedAccounts(limit = 10) {
    try {
      const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
      console.log("vaults", vaults)
      return vaults;
    } catch (e) {
      console.error('Error fetching paged vault accounts:', e.message);
      throw e;
    }
  }
  
  // API to fetch paginated vault accounts
  app.get('/api/vault-accounts', async (req, res) => {
    try {
      const { limit = 10 } = req.query; // Accept limit as a query parameter
      const vaultAccounts = await getVaultPagedAccounts(parseInt(limit, 10));
      res.json({ success: true, vaultAccounts: vaultAccounts.data });
    } catch (error) {
      console.error('Error fetching vault accounts:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

// API to create a new vault account
app.post('/api/create-vault', async (req, res) => {
  try {
    const { name } = req.body; // Vault name from request body
    const vault = await fireblocks.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
        hiddenOnUI: false,
        autoFuel: false,
      },
    });
    res.json({ success: true, vault });
  } catch (error) {
    console.error('Error creating vault account:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to add an asset (wallet) to a vault account
app.post('/api/add-wallet', async (req, res) => {
  try {
    const { vaultAccountId, assetId } = req.body; // Vault account ID and asset ID from request body
    const wallet = await fireblocks.vaults.createVaultAccountAsset({
      vaultAccountId,
      assetId,
    });
    res.json({ success: true, wallet });
  } catch (error) {
    console.error('Error adding wallet:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
