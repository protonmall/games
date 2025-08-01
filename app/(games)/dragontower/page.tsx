'use client';

import Sidebar from '@/app/_components/dragontower/Sidebar';
import TileGrid from '@/app/_components/dragontower/TileGrid';

export default function DragonTower() {
  return (
    <div
      className="flex h-screen text-white bg-[url('/assets/dragonTower/dark.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="w-[320px] border-r border-gray-700 bg-black/60">
        <Sidebar />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto bg-black/40">
        <div className="w-full max-w-[800px] px-4 py-6 rounded-md">
          <TileGrid />
        </div>
      </div>
    </div>
  );
}
