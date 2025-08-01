'use client';

import Tile from './Tile';
import CombinedDiceAndMultiplierDisplay from './CombinedDiceAndMultiplierDisplay';
import { useSnakeStore } from '@/app/_store/snakeStore';

export default function Board() {
  const { tiles, currentTile, animatingTileId } = useSnakeStore();

  const getTile = (id: number) => tiles.find((t) => t.id === id)!;

  const renderTile = (id: number) => (
    <Tile
      key={id}
      tile={getTile(id)}
      isCurrent={currentTile === id}
      isPassed={currentTile > id}
      showResult={false} 
      isAnimatingGlow={animatingTileId === id}
    />
  );

  return (
    <div
      className="
        grid grid-cols-4 grid-rows-4 gap-2 // Defines a 4x4 grid with 2px gap between items
        // Calculates the total width and height of the grid container:
        // (4 columns/rows * 80px tile width/height) + (3 gaps * 8px gap size)
        w-[calc(80px*4+8px*3)] h-[calc(80px*4+8px*3)]
      "
    >

      <div className="col-start-1 row-start-1">{renderTile(0)}</div>
      <div className="col-start-2 row-start-1">{renderTile(1)}</div>
      <div className="col-start-3 row-start-1">{renderTile(2)}</div>
      <div className="col-start-4 row-start-1">{renderTile(3)}</div>

      <div className="col-start-1 row-start-2">{renderTile(11)}</div>

      <div className="col-start-2 row-start-2 col-span-2 row-span-2">
        <CombinedDiceAndMultiplierDisplay />
      </div>
      <div className="col-start-4 row-start-2">{renderTile(4)}</div>

    
      <div className="col-start-1 row-start-3">{renderTile(10)}</div>
   
      <div className="col-start-4 row-start-3">{renderTile(5)}</div>

      <div className="col-start-1 row-start-4">{renderTile(9)}</div>
      <div className="col-start-2 row-start-4">{renderTile(8)}</div>
      <div className="col-start-3 row-start-4">{renderTile(7)}</div>
      <div className="col-start-4 row-start-4">{renderTile(6)}</div>
    </div>
  );
}