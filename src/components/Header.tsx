import React from 'react';
import { GameStatus } from '../types';
import { ClockIcon, FlagIcon, RefreshIcon } from './Icons';
import { Translation } from '../data';

interface HeaderProps {
  minesLeft: number | string;
  timer: number;
  gameStatus: GameStatus;
  onReset: () => void;
  texts: Translation['header'];
}

const Header: React.FC<HeaderProps> = ({ minesLeft, timer, gameStatus, onReset, texts }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between w-full max-w-2xl border-b-4 border-gray-100 mx-auto">
      
      {/* Mine Counter */}
      <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
        <div className="bg-red-500 p-1.5 rounded-full text-white shadow-sm">
           <FlagIcon className="w-4 h-4" />
        </div>
        <span className="text-xl font-mono font-bold text-red-600 min-w-[2ch] text-center">
          {minesLeft}
        </span>
      </div>

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className="group relative p-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        title={texts.resetTooltip}
      >
        <RefreshIcon className={`w-6 h-6 transition-transform duration-500 ${gameStatus === 'playing' ? 'group-hover:rotate-180' : ''}`} />
      </button>

      {/* Timer */}
      <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
        <span className="text-xl font-mono font-bold text-blue-600 min-w-[5ch] text-center">
          {formatTime(timer)}
        </span>
        <div className="bg-blue-500 p-1.5 rounded-full text-white shadow-sm">
           <ClockIcon className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;