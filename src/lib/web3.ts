import Web3 from 'web3';
import { User } from '../data/users';

// Initialize Web3 with provider based on user's API key
const getProvider = (apiKey: string) => {
  try {
    return new Web3.providers.HttpProvider(
      `https://go.getblock.io/${apiKey}/`
    );
  } catch (error) {
    console.warn('Falling back to public Sepolia endpoint');
    return new Web3.providers.HttpProvider(
      'https://rpc.sepolia.org'
    );
  }
};

export const getWeb3 = (user: User) => {
  return new Web3(getProvider(user.thisApi));
};

export const getBalance = async (web3: Web3, address: string): Promise<string> => {
  try {
    if (!web3.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Out of requests')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching balance');
  }
};

export const sendTransaction = async (
  web3: Web3,
  user: User,
  toAddress: string,
  amount: string
): Promise<string> => {
  try {
    if (!web3.utils.isAddress(toAddress)) {
      throw new Error('Invalid recipient address format');
    }

    const amountWei = web3.utils.toWei(amount, 'ether');
    if (isNaN(Number(amountWei)) || Number(amountWei) <= 0) {
      throw new Error('Invalid amount');
    }

    const account = web3.eth.accounts.privateKeyToAccount(user.privateKey);
    const fromAddress = account.address;
    
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
    
    let gasPrice;
    try {
      gasPrice = await web3.eth.getGasPrice();
    } catch (error) {
      console.warn('Failed to get gas price, using default');
      gasPrice = web3.utils.toWei('50', 'gwei');
    }
    
    const txObject = {
      from: fromAddress,
      to: toAddress,
      value: amountWei,
      gas: '21000',
      gasPrice: gasPrice,
      nonce: nonce
    };
    
    try {
      const estimatedGas = await web3.eth.estimateGas(txObject);
      txObject.gas = Math.ceil(Number(estimatedGas) * 1.1).toString();
    } catch (error) {
      console.warn('Gas estimation failed, using default limit');
    }
    
    const signedTx = await web3.eth.accounts.signTransaction(txObject, user.privateKey);
    
    if (!signedTx.rawTransaction) {
      throw new Error('Failed to sign transaction');
    }
    
    const receipt = await Promise.race([
      web3.eth.sendSignedTransaction(signedTx.rawTransaction),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 120000)
      )
    ]) as any;

    return receipt.transactionHash;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Out of requests')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Transaction failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during transaction');
  }
};