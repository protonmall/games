'use client';

import { Tile as TileType, useSnakeStore } from '@/app/_store/snakeStore';
import { motion } from 'framer-motion';

type Props = {
  tile?: TileType;
  isCurrent: boolean;
  isPassed: boolean;
  showResult: boolean;
  isAnimatingGlow: boolean;
};

const START_TILE_IMAGE_PATH = '/assets/snake/play.svg';
const SNAKE_TILE_IMAGE_PATH = '/assets/snake/snake.svg';


export default function Tile({ tile, isCurrent, isPassed, showResult, isAnimatingGlow }: Props) {
  const currentTileId = useSnakeStore((state) => state.currentTile);
  const status = useSnakeStore((state) => state.status);

  const showStartImage = tile && tile.id === 0 && currentTileId === 0 && status === 'idle';

  if (!tile) {
    return (
      <motion.div
        layout
        className="w-20 h-20 rounded-md bg-[#2f4553] border border-[#213743] shadow-inner"
      />
    );
  }

  const getTileStyle = () => {
    const base = 'transition-all duration-150 ease-in-out';
    let styleClasses = '';

    if (isAnimatingGlow) {
      styleClasses += ` bg-[#0fd66d] text-white shadow-[0_0_10px_2px_#0fd66d] animate-pulse-glow`;
    } else if (isCurrent && tile.isSnake) {
      styleClasses += ` bg-[#911b1b] text-white shadow-[0_0_6px_#911b1b]`;
    } else if (isCurrent) {
      styleClasses += ` bg-[#0fd66d] text-white shadow-[0_0_10px_2px_#0fd66d]`;
    } else if (tile.revealed && tile.isSnake) {
      styleClasses += ` bg-[#911b1b] text-white shadow-[0_0_6px_#911b1b]`;
    } else {
      styleClasses += ` bg-[#2f4553] text-gray-400`;
    }

    return `${base} ${styleClasses}`;
  };

  const applyInlineBoxShadow = !isAnimatingGlow && !isCurrent && !(tile.revealed && tile.isSnake);

  return (
    <motion.div
      layout
      transition={{ duration: 0.15 }}
      className={`
        w-20 h-20 rounded-md flex items-center justify-center text-sm font-bold
        border border-[#213743]
        ${getTileStyle()}
        active:translate-y-[4px]
        active:shadow-none
        cursor-pointer
      `}
      style={{
        boxShadow: applyInlineBoxShadow ? '0 4px 0 rgba(33, 55, 67, 0.4)' : undefined,
      }}
    >
      {showStartImage ? (
        <img src={START_TILE_IMAGE_PATH} alt="Start" className="w-10 h-10 object-contain" />
      ) : tile.isSnake ? (
        <img src={SNAKE_TILE_IMAGE_PATH} alt="Snake" className="w-10 h-10 object-contain" />
      ) : tile.multiplier ? (
        `${tile.multiplier.toFixed(2)}x`
      ) : (
        ''
      )}
    </motion.div>
  );
}