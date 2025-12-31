import React from 'react';
import { DifficultyLevel } from '../types';
import { Translation } from '../data';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onChange: (difficulty: DifficultyLevel) => void;
  texts: Translation['difficulty'];
}

const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Expert', 'Custom'];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onChange, texts }) => {
  return (
    <div className="flex flex-wrap bg-gray-200 p-1 rounded-xl mb-6 shadow-inner w-full max-w-lg mx-auto overflow-hidden">
      {difficulties.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`
            flex-1 py-2 px-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 whitespace-nowrap
            ${currentDifficulty === level 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50'}
          `}
        >
          {texts[level]}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;