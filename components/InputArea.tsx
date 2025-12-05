import React, { useState } from 'react';

interface InputAreaProps {
  onProcess: (urls: string[]) => void;
  isProcessing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onProcess, isProcessing }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let urls: string[] = [];
    if (mode === 'single') {
      urls = [input.trim()];
    } else {
      urls = input.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);
    }

    onProcess(urls);
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'single' ? 'bg-gray-50 text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Single Link
          </button>
          <button
            onClick={() => setMode('batch')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'batch' ? 'bg-gray-50 text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Batch Mode
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            {mode === 'single' ? (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste Pinterest URL here (e.g., https://pin.it/...)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-red-100 outline-none transition-all text-gray-700 placeholder-gray-400"
              />
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste multiple URLs (one per line)"
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-red-100 outline-none transition-all text-gray-700 placeholder-gray-400 resize-none"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`w-full py-3.5 rounded-full font-semibold text-white transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 ${
              isProcessing || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-red-700 shadow-lg shadow-red-200'
            }`}
          >
            {isProcessing ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Processing...</span>
               </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Media</span>
              </>
            )}
          </button>
          
          <p className="mt-3 text-center text-xs text-gray-400">
            Works with image and video pins. Please respect copyright policies.
          </p>
        </form>
      </div>
    </div>
  );
};
