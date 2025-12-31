import React, { useState, useEffect } from 'react';
import { DifficultyConfig } from '../types';
import { AlertIcon } from './Icons';
import { Translation } from '../data';

interface CustomDifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: DifficultyConfig) => void;
  initialConfig: DifficultyConfig;
  texts: Translation['customModal'];
}

const CustomDifficultyModal: React.FC<CustomDifficultyModalProps> = ({ isOpen, onClose, onSubmit, initialConfig, texts }) => {
  // Use strings to manage input state precisely (avoids leading zeros, allows empty state)
  const [rows, setRows] = useState(initialConfig.rows.toString());
  const [cols, setCols] = useState(initialConfig.cols.toString());
  const [mines, setMines] = useState(initialConfig.mines.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRows(initialConfig.rows.toString());
      setCols(initialConfig.cols.toString());
      setMines(initialConfig.mines.toString());
      setError(null);
    }
  }, [isOpen, initialConfig]);

  // Real-time validation to clear error when fixed
  useEffect(() => {
    const r = parseInt(rows) || 0;
    const c = parseInt(cols) || 0;
    
    if (error === texts.errors.maxSize && r <= 50 && c <= 50) {
        setError(null);
    }
  }, [rows, cols, error, texts]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Remove leading zeros for integers, but allow empty string
    if (val.length > 1 && val.startsWith('0')) {
      val = val.replace(/^0+/, '');
    }
    
    // If the string becomes empty due to strip (e.g. input was "0"), keep it empty
    if (val === "0") val = "";

    setter(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const r = parseInt(rows) || 0;
    const c = parseInt(cols) || 0;
    const m = parseInt(mines) || 0;
    
    // Validation
    if (r < 5 || c < 5) {
      setError(texts.errors.minSize);
      return;
    }
    if (r > 50 || c > 50) {
      setError(texts.errors.maxSize);
      return;
    }
    const totalCells = r * c;
    if (m < 1) {
      setError(texts.errors.minMines);
      return;
    }
    if (m >= totalCells) {
      setError(texts.errors.maxMines.replace('{total}', totalCells.toString()));
      return;
    }

    onSubmit({ rows: r, cols: c, mines: m });
  };

  if (!isOpen) return null;

  // Calculate max mines dynamically for display
  const currentRows = parseInt(rows) || 0;
  const currentCols = parseInt(cols) || 0;
  const maxMines = (currentRows * currentCols) - 1;

  // Helper to determine input style based on validity
  const getInputClass = (val: string, max: number, min: number) => {
      const num = parseInt(val);
      const isInvalid = isNaN(num) || num < min || num > max;
      return `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
          isInvalid && val !== "" ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' : 'border-gray-300 bg-gray-50 focus:border-indigo-500'
      }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{texts.title}</h2>
        
        {/* Added noValidate to disable browser native validation pop-ups */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cols" className="block text-sm font-medium text-gray-700">{texts.width}</label>
              <input
                type="number"
                id="cols"
                value={cols}
                onChange={handleInputChange(setCols)}
                className={getInputClass(cols, 50, 5)}
                min="5"
                max="50"
                placeholder="9"
              />
              {parseInt(cols) > 50 && (
                  <p className="text-xs text-red-500">{texts.maxWidth}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="rows" className="block text-sm font-medium text-gray-700">{texts.height}</label>
              <input
                type="number"
                id="rows"
                value={rows}
                onChange={handleInputChange(setRows)}
                className={getInputClass(rows, 50, 5)}
                min="5"
                max="50"
                placeholder="9"
              />
               {parseInt(rows) > 50 && (
                  <p className="text-xs text-red-500">{texts.maxHeight}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="mines" className="block text-sm font-medium text-gray-700">{texts.mines}</label>
            <input
              type="number"
              id="mines"
              value={mines}
              onChange={handleInputChange(setMines)}
              className={getInputClass(mines, maxMines > 0 ? maxMines : 9999, 1)}
              min="1"
            />
            <p className="text-xs text-gray-500 text-right">{texts.max}: {maxMines > 0 ? maxMines : '?'}</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm animate-pulse">
                <AlertIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {texts.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {texts.start}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomDifficultyModal;