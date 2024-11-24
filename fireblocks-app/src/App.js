import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS for styling

const App = () => {
  const [vaultAccounts, setVaultAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [walletForm, setWalletForm] = useState({
    vaultAccountId: '',
    assetId: '',
  });

  // Fetch vault accounts on component load
  useEffect(() => {
    getVaultAccounts();
  }, []);

  // Fetch vault accounts
  const getVaultAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/vault-accounts');
      // Extract the nested accounts data from the response
      const accounts = response.data.vaultAccounts?.accounts || [];
      setVaultAccounts(accounts);
      console.log('Fetched Vault Accounts:', accounts);
    } catch (error) {
      console.error('Error fetching vault accounts:', error.message);
      alert('Failed to fetch vault accounts. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a wallet to a vault account
  const addWallet = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/add-wallet', walletForm);
      alert(`Wallet for asset ${walletForm.assetId} added successfully!`);
      console.log('Wallet added:', response.data.wallet);
      getVaultAccounts(); // Refresh vault accounts after adding a wallet
    } catch (error) {
      console.error('Error adding wallet:', error.message);
      alert('Failed to add wallet. Check console for details.');
    }
  };

  return (
    <div className="app">
      <h1>Fireblocks Vault Manager</h1>
      <div className="button-container">
        <button onClick={getVaultAccounts} disabled={isLoading}>
          {isLoading ? 'Fetching Vaults...' : 'Refresh Vault Accounts'}
        </button>
      </div>

      <h2>Vault Accounts</h2>
      <div className="vault-list">
        {vaultAccounts.length > 0 ? (
          vaultAccounts.map((vault) => (
            <div key={vault.id} className="vault-card">
              <h3>{vault.name}</h3>
              <p>ID: {vault.id}</p>
              <p>Auto Fuel: {vault.autoFuel ? 'Enabled' : 'Disabled'}</p>
              <p>Hidden on UI: {vault.hiddenOnUI ? 'Yes' : 'No'}</p>
              <h4>Assets:</h4>
              <ul className="asset-list">
                {vault.assets.length > 0 ? (
                  vault.assets.map((asset) => (
                    <li key={asset.id} className="asset-item">
                      <strong>{asset.id}</strong>
                      <p>Total: {asset.total}</p>
                      <p>Balance: {asset.balance}</p>
                      <p>Available: {asset.available}</p>
                      {asset.blockHeight && (
                        <p>
                          Block Height: {asset.blockHeight} | Block Hash:{' '}
                          <span className="hash">{asset.blockHash}</span>
                        </p>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No assets available</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No vault accounts available.</p>
        )}
      </div>

      <h2>Add Wallet to Vault</h2>
      <form onSubmit={addWallet} className="wallet-form">
        <div className="form-group">
          <label>
            Vault Account ID:
            <input
              type="text"
              value={walletForm.vaultAccountId}
              onChange={(e) => setWalletForm({ ...walletForm, vaultAccountId: e.target.value })}
              placeholder="Enter Vault Account ID (e.g., 148)"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Asset ID:
            <input
              type="text"
              value={walletForm.assetId}
              onChange={(e) => setWalletForm({ ...walletForm, assetId: e.target.value })}
              placeholder="Enter Asset ID (e.g., ETH_TEST5)"
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding Wallet...' : 'Add Wallet'}
        </button>
      </form>
    </div>
  );
};

export default App;
