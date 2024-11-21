import React, { useState, useEffect, useCallback } from 'react';
import { Wallet } from 'lucide-react';
import { getWeb3, getBalance, sendTransaction } from './lib/web3';
import { TransactionForm } from './components/TransactionForm';
import { TransactionStatus } from './components/TransactionStatus';
import { UserSelector } from './components/UserSelector';
import { userData, User } from './data/users';
import Web3 from 'web3';

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>();
  const [txError, setTxError] = useState<string>();
  const [txLoading, setTxLoading] = useState(false);

  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState<boolean>(false);

  // Check if MetaMask is installed
  useEffect(() => {
    if (window.ethereum) {
      setMetaMaskInstalled(true);
    } else {
      setMetaMaskInstalled(false);
    }
  }, []);

  // Connect to MetaMask
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const web3Instance = new Web3(window.ethereum);
  //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       setWeb3Instance(web3Instance);
  //       setAccounts(accounts);
  //     } catch (error) {
  //       console.error('Error connecting to MetaMask:', error);
  //     }
  //   } else {
  //     alert('MetaMask is not installed. Please install MetaMask to use this app.');
  //   }
  // };

  const fetchBalance = useCallback(async () => {
    if (selectedUser && web3Instance) {
      try {
        const newBalance = await getBalance(web3Instance, selectedUser.accountID);
        setBalance(newBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      }
    }
  }, [selectedUser, web3Instance]);

  useEffect(() => {
    if (selectedUser) {
      const web3 = getWeb3(selectedUser);
      setWeb3Instance(web3);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, web3Instance]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setBalance(null);
    setTxHash(undefined);
    setTxError(undefined);
  };

  const handleTransaction = async (toAddress: string, amount: string) => {
    if (!selectedUser || !web3Instance) return;

    setTxLoading(true);
    setTxHash(undefined);
    setTxError(undefined);

    try {
      const hash = await sendTransaction(web3Instance, selectedUser, toAddress, amount);
      setTxHash(hash);
      // Refresh balance after successful transaction
      await fetchBalance();
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-12">
            <Wallet className="w-12 h-12 text-emerald-400 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              ETH Transfer Portal
            </h1>
          </div>

          {/* MetaMask Connection */}
          {/* <div className="connectMetaMask mb-8">
            {metaMaskInstalled ? (
              accounts && accounts.length > 0 ? (
                <div className="card bg-gray-800 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Account Details:</h2>
                  <p>Address: <span className="font-mono">{accounts[0]}</span></p>
                </div>
              ) : (
                <button
                  className="bg-emerald-500 text-white px-4 py-2 rounded-md"
                  onClick={connectWallet}
                >
                  Connect MetaMask
                </button>
              )
            ) : (
              <p className="text-red-500">
                MetaMask is not installed. Please install MetaMask to use this app.
              </p>
            )}
          </div> */}

          {/* User Selection and Balance */}
          <UserSelector
            users={userData}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            balance={balance}
            onRefreshBalance={fetchBalance}
          />

          {/* Transaction Section */}
          {selectedUser && (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Send ETH</h2>
              <TransactionForm onSubmit={handleTransaction} loading={txLoading} />
              <div className="mt-4">
                <TransactionStatus hash={txHash} error={txError} />
              </div>
            </div>
          )}

          {/* Network Info */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Network: Sepolia Testnet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
