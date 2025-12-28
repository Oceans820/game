
import React from 'react';

interface UIOverlayProps {
  narrative: string;
  levelName: string;
  isComplete: boolean;
  onNext: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ narrative, levelName, isComplete, onNext }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-12">
      <div className="flex justify-between items-start">
        <div className="border-l-2 border-white pl-4">
          <h1 className="text-4xl font-light tracking-widest text-white uppercase">{levelName}</h1>
          <p className="mt-2 text-sm text-white/50 tracking-tighter">PROJECT AFEI // SHADOW FOLDING PROTOCOL</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40 uppercase mb-1">State: Monitoring</div>
          <div className="h-1 w-32 bg-white/10 overflow-hidden">
            <div className="h-full bg-white animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {narrative && (
          <div className="bg-black/80 backdrop-blur-md px-8 py-4 border border-white/20 rounded-sm max-w-lg text-center">
            <p className="text-lg italic font-light leading-relaxed text-white">
              “{narrative}”
            </p>
          </div>
        )}
      </div>

      {isComplete && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/90 z-20 transition-all duration-700">
          <div className="text-center">
            <h2 className="text-6xl font-thin tracking-[1em] mb-12 animate-pulse">抵达白昼</h2>
            <button 
              onClick={onNext}
              className="px-12 py-4 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 tracking-widest uppercase text-sm"
            >
              继续前行 →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default UIOverlay;
