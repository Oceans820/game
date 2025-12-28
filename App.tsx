
import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { INITIAL_LEVELS } from './constants';
import { getPoeticDialogue } from './services/geminiService';

const SAVE_KEY = 'afei_shadow_ladder_progress';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number | null>(null);
  const [narrative, setNarrative] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);

  // 初始化：读取存档
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved !== null) {
      const index = parseInt(saved, 10);
      setCurrentLevelIndex(index < INITIAL_LEVELS.length ? index : 0);
    } else {
      setCurrentLevelIndex(0);
    }
  }, []);

  // 进度变化时：写入存档
  useEffect(() => {
    if (currentLevelIndex !== null) {
      localStorage.setItem(SAVE_KEY, currentLevelIndex.toString());
    }
  }, [currentLevelIndex]);

  const currentLevel = currentLevelIndex !== null ? INITIAL_LEVELS[currentLevelIndex] : null;

  const fetchNarrative = useCallback(async () => {
    if (!currentLevel) return;
    setIsLoadingNarrative(true);
    const text = await getPoeticDialogue(currentLevel.name, currentLevel.id);
    setNarrative(text);
    setIsLoadingNarrative(false);
  }, [currentLevel]);

  useEffect(() => {
    if (currentLevelIndex !== null) {
      fetchNarrative();
      setIsLevelComplete(false);
    }
  }, [currentLevelIndex, fetchNarrative]);

  const handleLevelComplete = () => {
    setIsLevelComplete(true);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex !== null) {
      if (currentLevelIndex < INITIAL_LEVELS.length - 1) {
        setCurrentLevelIndex(prev => (prev !== null ? prev + 1 : 0));
        setIsLevelComplete(false);
      } else {
        setNarrative("于是，阿飞在白昼的尽头，看见了自己完整的影。");
        setCurrentLevelIndex(0);
        setIsLevelComplete(false);
      }
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("确定要重置所有记忆片段吗？")) {
      localStorage.removeItem(SAVE_KEY);
      setCurrentLevelIndex(0);
      setIsLevelComplete(false);
    }
  };

  if (currentLevelIndex === null || !currentLevel) {
    return <div className="w-screen h-screen bg-black flex items-center justify-center text-white/20 tracking-widest uppercase text-xs">Synchronizing Shadows...</div>;
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <GameCanvas 
        level={currentLevel} 
        onLevelComplete={handleLevelComplete}
        onNarrativeUpdate={setNarrative}
      />
      <UIOverlay 
        narrative={narrative} 
        instruction={currentLevel.instruction}
        levelName={currentLevel.name}
        isComplete={isLevelComplete}
        onNext={handleNextLevel}
        onReset={handleResetProgress}
      />
    </div>
  );
};

export default App;
