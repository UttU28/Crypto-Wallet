import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface TransactionStatusProps {
  hash?: string;
  error?: string;
}

export function TransactionStatus({ hash, error }: TransactionStatusProps) {
  if (!hash && !error) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {hash && (
        <div className="text-center text-green-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Transaction Sent!</h3>
          <p className="text-sm text-gray-400 break-all">
            Hash: {hash}
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block"
          >
            View on Etherscan ↗
          </a>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-400">
          <XCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Transaction Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}