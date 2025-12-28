
import React, { useEffect } from 'react';

interface UIOverlayProps {
  narrative: string;
  instruction: string;
  levelName: string;
  isComplete: boolean;
  onNext: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ narrative, instruction, levelName, isComplete, onNext }) => {
  // Listen for Enter key when level is complete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete && (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter')) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, onNext]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-12">
      {/* Header - Balanced Top Layout */}
      <div className="flex justify-between items-start w-full">
        {/* Left: Level Title */}
        <div className="border-l-2 border-white pl-4">
          <h1 className="text-2xl font-extralight tracking-[0.4em] text-white uppercase">{levelName}</h1>
          <p className="mt-1 text-[9px] text-white/30 tracking-[0.2em] uppercase">Memory Sequence // 0{levelName.split(' ')[0]}</p>
        </div>

        {/* Right: Status */}
        <div className="text-right">
          <div className="text-[10px] text-white/40 uppercase mb-2 font-bold tracking-[0.2em]">Sync Active</div>
          <div className="flex gap-1 justify-end">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-0.5 w-4 ${i < 4 ? 'bg-white/60' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Instruction - Optimized for horizontal flow to prevent stacking */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex justify-center">
        <div className="bg-white/[0.02] backdrop-blur-xl px-10 py-6 rounded-sm border border-white/5 shadow-2xl text-center">
          {instruction.split('\n').map((line, i) => (
            <p key={i} className="text-[13px] text-white/70 font-light leading-relaxed tracking-[0.05em] mb-1 last:mb-0">
              {line.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* Center Narrative - Poetic focus */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {narrative && (
          <div className="bg-black/20 px-16 py-12 max-w-4xl text-center transition-opacity duration-1000">
            <p className="text-2xl italic font-extralight leading-loose text-white/90 tracking-widest animate-pulse duration-[4000ms]">
              {narrative}
            </p>
          </div>
        )}
      </div>

      {/* Footer - Minimalist branding */}
      <div className="flex justify-between items-end opacity-20 border-t border-white/5 pt-4">
        <div className="text-[9px] tracking-[0.8em] uppercase font-light">
          Folding Shadows
        </div>
        <div className="text-right text-[9px] tracking-[0.8em] uppercase font-light">
          Into Daylight
        </div>
      </div>

      {/* Completion Screen */}
      {isComplete && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/98 z-20 transition-all duration-1000 backdrop-blur-sm">
          <div className="text-center px-12 max-w-xl">
            <h2 className="text-5xl font-thin tracking-[0.8em] mb-8 text-white uppercase leading-tight">抵达白昼</h2>
            <div className="w-16 h-px bg-white/20 mx-auto mb-10"></div>
            <p className="text-white/30 mb-16 tracking-[0.4em] text-[10px] uppercase">Transitioning to next memory segment...</p>
            <button 
              onClick={onNext}
              className="group relative px-24 py-6 overflow-hidden border border-white/10 text-white transition-all duration-700 hover:border-white/40"
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              <span className="relative z-10 tracking-[0.8em] uppercase text-xs font-light">
                继续前行 (ENTER)
              </span>
            </button>
            <p className="mt-4 text-[9px] text-white/20 tracking-widest uppercase animate-pulse">Press Enter to Proceed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
