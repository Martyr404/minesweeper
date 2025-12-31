import React, { memo } from 'react';
import { CellData } from '../types';
import { FlagIcon, MineIcon } from './Icons';

interface CellProps {
  data: CellData;
  onClick: (row: number, col: number) => void;
  onContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
  gameStatus: string;
  isGodMode?: boolean;
}

const getNumberColor = (count: number) => {
  switch (count) {
    case 1: return 'text-blue-500';
    case 2: return 'text-emerald-600';
    case 3: return 'text-red-500';
    case 4: return 'text-purple-600';
    case 5: return 'text-orange-600';
    case 6: return 'text-teal-600';
    case 7: return 'text-indigo-600';
    case 8: return 'text-gray-500';
    default: return 'text-gray-700';
  }
};

const Cell: React.FC<CellProps> = ({ data, onClick, onContextMenu, gameStatus, isGodMode }) => {
  const { row, col, isMine, isRevealed, isFlagged, neighborCount } = data;

  const handleClick = () => {
    if (gameStatus !== 'won' && gameStatus !== 'lost') {
      onClick(row, col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'won' && gameStatus !== 'lost') {
      onContextMenu(e, row, col);
    }
  };

  // Base style for all cells
  const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold transition-all duration-100 ease-out select-none cursor-pointer";

  // Unrevealed style (Raised effect)
  const unrevealedClasses = "bg-gray-200 hover:bg-gray-300 border-b-4 border-r-4 border-gray-400 border-t border-l border-white shadow-sm active:border-b-0 active:border-r-0 active:border-t-4 active:border-l-4 active:border-gray-400 active:shadow-inner";

  // Revealed style (Depressed/Flat effect)
  const revealedClasses = "bg-gray-100 border border-gray-200 shadow-inner cursor-default";

  // Flagged style
  const flaggedClasses = "text-red-500";

  // Mine style (Exploded)
  const mineClasses = isRevealed && isMine ? "bg-red-500 text-white border-none shadow-inner animate-pulse" : "";

  // God Mode Ghost Mine (Unrevealed Mine)
  const godModeMineClasses = (isGodMode && isMine && !isRevealed && !isFlagged) ? "bg-gray-200 border-b-4 border-r-4 border-gray-400 border-t border-l border-white shadow-sm opacity-90" : "";

  let content = null;
  if (isFlagged) {
    content = <FlagIcon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />;
  } else if (isRevealed) {
    if (isMine) {
      content = <MineIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${!isFlagged ? 'animate-bounce-short' : ''}`} />;
    } else if (neighborCount > 0) {
      content = neighborCount;
    }
  } else if (isGodMode && isMine) {
    content = <MineIcon className="w-5 h-5 text-gray-400 opacity-50" />;
  }

  // Combine classes based on state
  let currentClasses = baseClasses;
  if (!isRevealed) {
    currentClasses += ` ${unrevealedClasses}`;
  } else {
    currentClasses += ` ${revealedClasses}`;
  }

  if (isFlagged) currentClasses += ` ${flaggedClasses}`;
  if (isMine && isRevealed) currentClasses = `${baseClasses} ${mineClasses}`;
  if (isGodMode && isMine && !isRevealed && !isFlagged) currentClasses += ` ${godModeMineClasses}`;

  return (
    <div
      className={currentClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      role="button"
      aria-label={`Cell at row ${row}, col ${col}`}
    >
      <span className={isRevealed && !isMine ? getNumberColor(neighborCount) : ''}>
        {content}
      </span>
    </div>
  );
};

export default memo(Cell);
