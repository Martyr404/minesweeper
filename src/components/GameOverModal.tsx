import React from 'react';
import { GameStatus } from '../types';
import { TrophyIcon, SkullIcon, EyeIcon, RepeatIcon, XIcon } from './Icons';
import { Translation } from '../data';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  onRestart: () => void;
  onRetryLevel: () => void;
  onReview: () => void;
  timeTaken: number;
  texts: Translation['gameOver'];
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose, status, onRestart, onRetryLevel, onReview, timeTaken, texts }) => {
  if (!isOpen) return null;

  const isWin = status === 'won';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all animate-scale-in border-4 border-white ring-4 ring-black/5">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title={texts.close}
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center ${isWin ? 'bg-yellow-100 text-yellow-500' : 'bg-red-100 text-red-500'}`}>
          {isWin ? <TrophyIcon className="w-10 h-10" /> : <SkullIcon className="w-10 h-10" />}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {isWin ? texts.won : texts.lost}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isWin 
            ? texts.wonMessage.replace('{time}', timeTaken.toString())
            : texts.lostMessage}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
             <button
              onClick={onReview}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              title={texts.review}
            >
              <EyeIcon className="w-5 h-5" />
              <span>{texts.review}</span>
            </button>
            <button
              onClick={onRetryLevel}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              title={texts.retry}
            >
              <RepeatIcon className="w-5 h-5" />
              <span>{texts.retry}</span>
            </button>
          </div>

          <button
            onClick={onRestart}
            className={`
              w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95
              ${isWin 
                ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200' 
                : 'bg-red-500 hover:bg-red-600 shadow-red-200'}
            `}
          >
            {texts.newGame}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;