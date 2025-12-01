import { useState, useEffect } from 'react';
import Home from './components/Home';
import Practice from './components/Practice';
import Progress from './components/Progress';
import Arena from './components/Arena';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import PremiumButton from './components/PremiumButton';
import PremiumModal from './components/PremiumModal';

export type Screen = 'home' | 'practice' | 'progress' | 'arena' | 'profile';
export type PracticeMode = 'select' | 'level' | 'timed';

export interface UserProgress {
  totalPoints: number;
  streak: number;
  lastPracticeDate: string;
  masteredTables: number[];
  currentTable: number;
  totalCorrect: number;
  totalAttempts: number;
  arenaRating: number;
  arenaWins: number;
  arenaLosses: number;
  isPremium: boolean;
  hearts: number;
}

const defaultProgress: UserProgress = {
  totalPoints: 0,
  streak: 0,
  lastPracticeDate: '',
  masteredTables: [],
  currentTable: 1,
  totalCorrect: 0,
  totalAttempts: 0,
  arenaRating: 1000,
  arenaWins: 0,
  arenaLosses: 0,
  isPremium: false,
  hearts: 5,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('select');
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mathAppProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserProgress(parsed);
      
      // Check if streak should be reset
      const today = new Date().toDateString();
      const lastDate = new Date(parsed.lastPracticeDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate !== today && lastDate !== yesterday) {
        setUserProgress(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mathAppProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({ ...prev, ...updates }));
  };

  const handlePurchasePremium = () => {
    updateProgress({ isPremium: true, hearts: 999 });
    setShowPremiumModal(false);
  };

  const handleStartPractice = () => {
    const today = new Date().toDateString();
    const lastDate = userProgress.lastPracticeDate ? new Date(userProgress.lastPracticeDate).toDateString() : '';
    
    if (lastDate !== today) {
      updateProgress({
        streak: lastDate === new Date(Date.now() - 86400000).toDateString() ? userProgress.streak + 1 : 1,
        lastPracticeDate: new Date().toISOString(),
      });
    }
    
    setPracticeMode('select');
    setCurrentScreen('practice');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home userProgress={userProgress} setScreen={setCurrentScreen} setPracticeMode={setPracticeMode} updateProgress={updateProgress} onStartPractice={handleStartPractice} />;
      case 'practice':
        return <Practice userProgress={userProgress} setScreen={setCurrentScreen} practiceMode={practiceMode} setPracticeMode={setPracticeMode} updateProgress={updateProgress} />;
      case 'progress':
        return <Progress userProgress={userProgress} setScreen={setCurrentScreen} />;
      case 'arena':
        return <Arena userProgress={userProgress} setScreen={setCurrentScreen} updateProgress={updateProgress} />;
      case 'profile':
        return <Profile userProgress={userProgress} setScreen={setCurrentScreen} />;
      default:
        return <Home userProgress={userProgress} setScreen={setCurrentScreen} setPracticeMode={setPracticeMode} updateProgress={updateProgress} onStartPractice={handleStartPractice} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      {renderScreen()}
      
      {/* Premium Button - Only show on home screen if not premium */}
      {!userProgress.isPremium && currentScreen === 'home' && (
        <PremiumButton onClick={() => setShowPremiumModal(true)} />
      )}
      
      <BottomNav 
        currentScreen={currentScreen}
        setScreen={setCurrentScreen}
        setPracticeMode={setPracticeMode}
        onStartPractice={handleStartPractice}
      />
      
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePurchasePremium}
        userProgress={userProgress}
      />
    </div>
  );
}