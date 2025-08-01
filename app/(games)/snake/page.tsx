// app/snake/page.tsx
'use client';

import Sidebar from '@/app/_components/snake/Sidebar';
import Board from '@/app/_components/snake/Board';
import { useSnakeStore } from '@/app/_store/snakeStore';
import { useEffect } from 'react';

export default function Snake() {
  const initializeGame = useSnakeStore((state) => state.initializeGame);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex h-screen bg-[#0f212e] text-white">
      <div className="w-[320px] border-r border-gray-800 p-4"> 
        <Sidebar />
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center">
        <Board />
      </div>
    </div>
  );
}