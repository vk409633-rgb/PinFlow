import React, { useState, useRef } from 'react';
import { PinData } from '../types';
import { analyzeImage } from '../services/geminiService';
import { fetchMediaBlob } from '../services/pinterestService';

interface MediaCardProps {
  pin: PinData;
  onUpdate: (id: string, updates: Partial<PinData>) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ pin, onUpdate }) => {
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent play toggle if overlapping
    if (!pin.mediaUrl) return;
    setDownloading(true);
    try {
      const blob = pin.blob || await fetchMediaBlob(pin.mediaUrl);
      
      // Update blob in state if we just fetched it
      if (!pin.blob) {
          onUpdate(pin.id, { blob });
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Extract filename from URL or default
      const ext = pin.mediaType === 'video' ? '.mp4' : '.jpg';
      a.download = `pinflow-${pin.id.slice(0, 8)}${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download media.");
    } finally {
      setDownloading(false);
    }
  };

  const handleAiAnalysis = async () => {
    if (!pin.mediaUrl) return;
    if (pin.aiMetadata && !pin.aiMetadata.isLoading) return; // Already analyzed

    onUpdate(pin.id, { aiMetadata: { title: '', caption: '', hashtags: [], isLoading: true } });

    try {
      // Need blob for AI
      const blob = pin.blob || await fetchMediaBlob(pin.mediaUrl);
      if (!pin.blob) {
         onUpdate(pin.id, { blob });
      }

      const analysis = await analyzeImage(blob);
      
      onUpdate(pin.id, {
        aiMetadata: {
          ...analysis,
          isLoading: false
        }
      });
    } catch (err) {
       console.error(err);
       onUpdate(pin.id, { aiMetadata: undefined }); // Reset on failure
       alert("AI Analysis failed. Please try again.");
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
            setShowControls(true);
        }
    }
  };

  if (pin.status === 'loading') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse h-80 flex flex-col">
        <div className="bg-gray-200 h-48 rounded-lg mb-4 w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (pin.status === 'error') {
    return (
      <div className="bg-red-50 rounded-xl border border-red-100 p-4 h-full flex flex-col justify-center items-center text-center">
        <div className="text-red-400 mb-2">
           <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-red-800 font-medium text-sm truncate w-full px-2" title={pin.originalUrl}>{pin.originalUrl}</p>
        <p className="text-red-600 text-xs mt-1">{pin.errorMessage || 'Failed to load'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div 
        className="relative group bg-gray-100 aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={pin.mediaType === 'video' ? togglePlay : undefined}
      >
        {pin.mediaType === 'video' ? (
          <>
            <video 
                ref={videoRef}
                src={pin.mediaUrl!} 
                controls={showControls}
                className="w-full h-full object-cover" 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                    setIsPlaying(false);
                    setShowControls(false); // Hide controls on end to show big play button again
                }}
                playsInline
            />
            {!isPlaying && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/10 z-10"
                >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform hover:scale-110 group-hover:bg-white">
                        <svg className="w-8 h-8 text-gray-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}
          </>
        ) : (
          <img 
            src={pin.mediaUrl!} 
            alt={pin.description} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        )}
        
        {/* Overlay Action Buttons */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="flex justify-end">
                 <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="pointer-events-auto bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2 hover:bg-gray-50"
                 >
                    {downloading ? (
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    )}
                    Save
                </button>
            </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2" title={pin.description}>
          {pin.description}
        </h3>
        
        {pin.aiMetadata ? (
            <div className="mt-auto pt-3 border-t border-gray-100">
              {pin.aiMetadata.isLoading ? (
                 <div className="space-y-2">
                   <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                   <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                 </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-indigo-600">{pin.aiMetadata.title}</p>
                  <p className="text-xs text-gray-600 italic">"{pin.aiMetadata.caption}"</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pin.aiMetadata.hashtags.map(tag => (
                      <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
        ) : (
             pin.mediaType === 'image' && (
                <button 
                  onClick={handleAiAnalysis}
                  className="mt-auto w-full py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21.79 11.75l-2.04-1.17c-.12-.07-.22-.17-.29-.29l-1.17-2.04c-.38-.66-1.34-.66-1.72 0l-1.17 2.04c-.07.12-.17.22-.29.29l-2.04 1.17c-.66.38-.66 1.34 0 1.72l2.04 1.17c.12.07.22.17.29.29l1.17 2.04c.38.66 1.34.66 1.72 0l1.17-2.04c.07-.12.17-.22.29-.29l2.04-1.17c.66-.38.66-1.34 0-1.72zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-3.5-3c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5z"/></svg>
                  Generate AI Tags & Caption
                </button>
             )
        )}
      </div>
    </div>
  );
};