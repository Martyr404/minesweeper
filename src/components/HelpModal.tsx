import React from 'react';
import { FlagIcon } from './Icons';
import { Translation } from '../data';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  texts: Translation['helpModal'];
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, texts }) => {
  if (!isOpen) return null;

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
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{texts.goalTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {texts.goalDesc}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
               <div className="w-8 h-8 bg-gray-200 border-b-4 border-r-4 border-gray-400 border-t border-l border-white shadow-sm flex items-center justify-center text-blue-500 font-bold">1</div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{texts.numbersTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {texts.numbersDesc}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-red-500">
               <FlagIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{texts.flagsTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {texts.flagsDesc}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
        >
          {texts.button}
        </button>
      </div>
    </div>
  );
};

export default HelpModal;