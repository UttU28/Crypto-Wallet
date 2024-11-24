import React, { useState } from 'react';
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';

const FIREBLOCKS_API_SECRET_PATH = './fireblocks_secret.key';

const fireblocks = new Fireblocks({
  apiKey: 'f365ee88-6aff-44e9-822e-804332e1958c',
  basePath: BasePath.Sandbox, // Replace with your base path
  secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, 'utf8'),
});

const FireblocksApp = () => {
  console.log(readFileSync(FIREBLOCKS_API_SECRET_PATH, 'utf8'))
  const [vaultAccounts, setVaultAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a new vault
  const createVault = async () => {
    try {
      setIsLoading(true);
      const vault = await fireblocks.vaults.createVaultAccount({
        createVaultAccountRequest: {
          name: 'My First Vault Account',
          hiddenOnUI: false,
          autoFuel: false,
        },
      });
      console.log('Vault created:', vault.data);
      alert('Vault account created successfully!');
    } catch (error) {
      console.error('Error creating vault account:', error);
      alert('Error creating vault account. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Retrieve paged vault accounts
  const getVaultPagedAccounts = async (limit = 10) => {
    try {
      setIsLoading(true);
      const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
      console.log('Vault accounts:', vaults.data);
      setVaultAccounts(vaults.data);
    } catch (error) {
      console.error('Error retrieving vault accounts:', error);
      alert('Error retrieving vault accounts. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fireblocks Vault Manager</h1>
      <button onClick={createVault} disabled={isLoading}>
        {isLoading ? 'Creating Vault...' : 'Create Vault'}
      </button>
      <button onClick={() => getVaultPagedAccounts(10)} disabled={isLoading}>
        {isLoading ? 'Fetching Vaults...' : 'Get Vault Accounts'}
      </button>
      <h2>Vault Accounts</h2>
      <ul>
        {vaultAccounts.length > 0 ? (
          vaultAccounts.map((vault) => (
            <li key={vault.id}>
              <strong>{vault.name}</strong> - ID: {vault.id}
            </li>
          ))
        ) : (
          <li>No vault accounts to display.</li>
        )}
      </ul>
    </div>
  );
};

export default FireblocksApp;
