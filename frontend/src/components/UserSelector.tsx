import React from 'react';
import { User } from '../data/users';
import { RefreshCw } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  balance: string | null;
  onRefreshBalance: () => void;
}

export function UserSelector({ 
  users, 
  selectedUser, 
  onUserSelect,
  balance,
  onRefreshBalance
}: UserSelectorProps) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="userSelect" className="block text-sm font-medium text-gray-300 mb-2">
            Select User
          </label>
          <select
            id="userSelect"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none text-white"
            onChange={(e) => {
              const user = users.find(u => u.accountID === e.target.value);
              if (user) onUserSelect(user);
            }}
            value={selectedUser?.accountID || ''}
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.accountID} value={user.accountID}>
                {user.thisUser}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Balance:</span>
                <button
                  onClick={onRefreshBalance}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Refresh Balance"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {balance ? `${parseFloat(balance).toFixed(6)} ETH` : 'Loading...'}
              </div>
              <div className="text-sm text-gray-400 break-all">
                Address: {selectedUser.accountID}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}