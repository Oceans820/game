
import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { INITIAL_LEVELS } from './constants';
import { getPoeticDialogue } from './services/geminiService';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [narrative, setNarrative] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);

  const currentLevel = INITIAL_LEVELS[currentLevelIndex];

  const fetchNarrative = useCallback(async () => {
    setIsLoadingNarrative(true);
    const text = await getPoeticDialogue(currentLevel.name, currentLevel.id);
    setNarrative(text);
    setIsLoadingNarrative(false);
  }, [currentLevel]);

  useEffect(() => {
    fetchNarrative();
    setIsLevelComplete(false);
  }, [fetchNarrative]);

  const handleLevelComplete = () => {
    setIsLevelComplete(true);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < INITIAL_LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setIsLevelComplete(false);
    } else {
      // Reached the end
      setNarrative("于是，阿飞在白昼的尽头，看见了自己完整的影。");
      setCurrentLevelIndex(0);
      setIsLevelComplete(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <GameCanvas 
        level={currentLevel} 
        onLevelComplete={handleLevelComplete}
        onNarrativeUpdate={setNarrative}
      />
      <UIOverlay 
        narrative={narrative} 
        levelName={currentLevel.name}
        isComplete={isLevelComplete}
        onNext={handleNextLevel}
      />
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-white/20 m-8 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/20 m-8 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/20 m-8 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-white/20 m-8 pointer-events-none" />
    </div>
  );
};

export default App;
