import React from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StepBackIcon, 
  StepForwardIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from './Icons';
import { Translation } from '../data';

interface ReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentIndex: number;
  totalSteps: number;
  onSeek: (index: number) => void;
  isGodMode: boolean;
  onToggleGodMode: () => void;
  onClose: () => void;
  texts: Translation['replay'];
}

const ReplayControls: React.FC<ReplayControlsProps> = ({
  isPlaying,
  onPlayPause,
  currentIndex,
  totalSteps,
  onSeek,
  isGodMode,
  onToggleGodMode,
  onClose,
  texts
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-slide-up z-40">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono w-12 text-right">{currentIndex}</span>
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentIndex}
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-xs text-gray-500 font-mono w-12">{totalSteps - 1}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
            <button
                onClick={onToggleGodMode}
                className={`p-2 rounded-lg transition-colors ${isGodMode ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={texts.toggleGodMode}
            >
                {isGodMode ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4">
                <button 
                    onClick={() => onSeek(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-30"
                >
                    <StepBackIcon className="w-6 h-6" />
                </button>

                <button 
                    onClick={onPlayPause}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>

                <button 
                    onClick={() => onSeek(Math.min(totalSteps - 1, currentIndex + 1))}
                    disabled={currentIndex === totalSteps - 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-30"
                >
                    <StepForwardIcon className="w-6 h-6" />
                </button>
            </div>

            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                {texts.exit}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReplayControls;