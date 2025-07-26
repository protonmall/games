'use client';
import { useCasesStore } from '@/app/_store/casesStore';
import React from 'react';

const TransactionHistory = () => {
  const history = useCasesStore((s) => s.history);

  return (
    <div className="w-full max-w-xl text-sm text-gray-300 mt-6">
      <h2 className="font-semibold mb-2">Transaction History</h2>
      <div className="border border-gray-700 rounded p-2 max-h-60 overflow-y-auto space-y-1">
        {history.length === 0 && <div className="text-gray-500">No transactions yet</div>}
        {history.map((tx) => (
          <div key={tx.id} className="flex justify-between">
            <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
            <span>Bet: {tx.bet.toFixed(2)}</span>
            <span>Mult: {tx.multiplier}x</span>
            <span>Payout: {tx.payout.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
