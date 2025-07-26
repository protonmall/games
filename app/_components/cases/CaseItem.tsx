'use client';
import React from 'react';

interface CaseItemProps {
  value: number;
  isWinner: boolean;
}

const CaseItem: React.FC<CaseItemProps> = ({ value, isWinner }) => {
  return (
    <div
      className={`w-20 h-20 rounded-lg flex items-center justify-center text-white text-sm font-semibold 
        transition-transform duration-300 
        ${isWinner ? 'bg-yellow-400 text-black animate-glow bounce' : 'bg-gray-800'}`}
    >
      {value}x
    </div>
  );
};

export default CaseItem;
