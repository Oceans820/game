
import React, { useEffect } from 'react';

interface UIOverlayProps {
  narrative: string;
  instruction: string;
  levelName: string;
  isComplete: boolean;
  onNext: () => void;
  onReset: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ narrative, instruction, levelName, isComplete, onNext, onReset }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete && (e.key === 'Enter' || e.code === 'Enter')) {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, onNext]);

  const getLevelNum = () => {
    if (levelName.includes("Peeling")) return "01";
    if (levelName.includes("Ladder")) return "02";
    if (levelName.includes("Displaced")) return "03";
    if (levelName.includes("Symphony")) return "04";
    if (levelName.includes("Complete")) return "05";
    return "??";
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-12">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div className="border-l-2 border-white pl-4">
          <h1 className="text-xl font-extralight tracking-[0.4em] text-white uppercase">{levelName}</h1>
          <p className="mt-1 text-[8px] text-white/30 tracking-[0.2em] uppercase font-bold">Memory Sequence // {getLevelNum()}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-[9px] text-white/40 uppercase mb-2 font-bold tracking-[0.2em] animate-pulse">Sync Active</div>
            <div className="flex gap-1 justify-end">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-0.5 w-3 ${i <= parseInt(getLevelNum()) ? 'bg-white/60' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          
          {/* Reset Button - Minimalist */}
          <button 
            onClick={onReset}
            className="pointer-events-auto text-[7px] text-white/10 hover:text-white/40 uppercase tracking-[0.3em] transition-colors duration-500 mt-4 border border-white/5 px-2 py-1"
          >
            Reset Memory
          </button>
        </div>
      </div>

      {/* Floating Instruction */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 flex justify-center">
        <div className="bg-white/[0.01] backdrop-blur-md px-8 py-4 rounded-sm border border-white/5 shadow-xl text-center">
          {instruction.split('\n').map((line, i) => (
            <p key={i} className="text-[12px] text-white/50 font-light leading-relaxed tracking-wide mb-0.5 last:mb-0">
              {line.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* Center Narrative */}
      <div className="flex flex-col items-center justify-end mb-24">
        {narrative && (
          <div className="px-12 py-4 max-w-2xl text-center">
            <p className="text-lg italic font-extralight leading-relaxed text-white/80 tracking-widest animate-pulse duration-[5000ms]">
              {narrative}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end opacity-10 pt-4">
        <div className="text-[8px] tracking-[0.8em] uppercase font-light">Folding Shadows</div>
        <div className="text-right text-[8px] tracking-[0.8em] uppercase font-light">Progress Auto-Saved</div>
      </div>

      {/* Completion Screen */}
      {isComplete && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/98 z-20 backdrop-blur-sm transition-opacity duration-1000">
          <div className="text-center px-12 max-w-xl">
            <h2 className="text-4xl font-thin tracking-[0.8em] mb-6 text-white uppercase">抵达白昼</h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-8"></div>
            <p className="text-white/20 mb-12 tracking-[0.4em] text-[9px] uppercase">Proceeding to next memory segment...</p>
            <button 
              onClick={onNext}
              className="group relative px-20 py-5 overflow-hidden border border-white/10 text-white transition-all duration-700 hover:border-white/40"
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              <span className="relative z-10 tracking-[0.6em] uppercase text-[10px] font-light">
                {getLevelNum() === "05" ? "再次轮回 (RESTART)" : "继续前行 (ENTER)"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
