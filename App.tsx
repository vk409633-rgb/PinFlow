import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { MediaCard } from './components/MediaCard';
import { PinData } from './types';
import { fetchPinData } from './services/pinterestService';

const App: React.FC = () => {
  const [pins, setPins] = useState<PinData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessUrls = async (urls: string[]) => {
    setIsProcessing(true);
    
    // Create initial placeholder items
    const newItems: PinData[] = urls.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      originalUrl: url,
      mediaUrl: null,
      mediaType: 'unknown',
      description: '',
      status: 'loading'
    }));

    setPins(prev => [...newItems, ...prev]);

    // Process each URL
    // We do this concurrently but without blocking the UI
    // In a real huge batch, we might want to throttle this (e.g. p-limit)
    // but for client-side fetches, the browser will handle limits naturally (though too many might timeout).
    
    await Promise.allSettled(newItems.map(async (item) => {
      try {
        const result = await fetchPinData(item.originalUrl);
        
        setPins(currentPins => currentPins.map(p => {
          if (p.id === item.id) {
            return {
              ...p,
              ...result,
              status: 'success'
            } as PinData;
          }
          return p;
        }));

      } catch (error: any) {
        setPins(currentPins => currentPins.map(p => {
          if (p.id === item.id) {
            return {
              ...p,
              status: 'error',
              errorMessage: error.message
            };
          }
          return p;
        }));
      }
    }));

    setIsProcessing(false);
  };

  const handleUpdatePin = useCallback((id: string, updates: Partial<PinData>) => {
    setPins(currentPins => currentPins.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);

  const clearAll = () => {
      if(window.confirm('Are you sure you want to clear all results?')) {
          setPins([]);
      }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-secondary">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Download Pinterest Media <span className="text-primary">Instantly</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Save images and videos in high quality. Upload batch links to process multiple pins at once. 
            Use our AI tools to generate captions and tags.
          </p>
        </div>

        <InputArea onProcess={handleProcessUrls} isProcessing={isProcessing} />

        {pins.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Results <span className="text-gray-400 font-normal text-lg ml-2">({pins.length})</span>
              </h3>
              <button 
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pins.map(pin => (
                <MediaCard 
                  key={pin.id} 
                  pin={pin} 
                  onUpdate={handleUpdatePin}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} PinFlow. Not affiliated with Pinterest.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
