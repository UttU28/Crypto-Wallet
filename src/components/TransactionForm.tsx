import React, { useState } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (toAddress: string, amount: string) => Promise<void>;
  loading: boolean;
}

export function TransactionForm({ onSubmit, loading }: TransactionFormProps) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !amount) return;
    await onSubmit(toAddress, amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="toAddress" className="block text-sm font-medium text-gray-300 mb-1">
          Recipient Address
        </label>
        <input
          id="toAddress"
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
          Amount (ETH)
        </label>
        <input
          id="amount"
          type="number"
          step="0.000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none text-white placeholder-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !toAddress || !amount}
        className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <SendHorizontal className="w-5 h-5" />
            <span>Send ETH</span>
          </>
        )}
      </button>
    </form>
  );
}