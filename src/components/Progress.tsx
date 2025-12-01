import { ArrowLeft, Lock, Settings, Users, Crown, Flame, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen, UserProgress } from '../App';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProgressProps {
  userProgress: UserProgress;
  setScreen: (screen: Screen) => void;
}

// Define all achievements
const achievements = [
  { id: 1, emoji: '🔥', title: 'First Streak', description: 'Practice for 1 day', unlock: (p: UserProgress) => p.streak >= 1, gradient: 'from-orange-400 to-red-500' },
  { id: 2, emoji: '⭐', title: 'Star Student', description: 'Earn 100 points', unlock: (p: UserProgress) => p.totalPoints >= 100, gradient: 'from-yellow-400 to-orange-500' },
  { id: 3, emoji: '🏆', title: 'First Master', description: 'Master your first table', unlock: (p: UserProgress) => p.masteredTables.length >= 1, gradient: 'from-yellow-500 to-yellow-600' },
  { id: 4, emoji: '💯', title: 'Perfect Score', description: 'Get 10/10 correct', unlock: (p: UserProgress) => p.totalCorrect >= 10, gradient: 'from-purple-400 to-pink-500' },
  { id: 5, emoji: '🎯', title: 'Sharp Shooter', description: '80% accuracy overall', unlock: (p: UserProgress) => p.totalAttempts > 0 && (p.totalCorrect / p.totalAttempts) >= 0.8, gradient: 'from-blue-400 to-cyan-500' },
  { id: 6, emoji: '🌟', title: 'Rising Star', description: 'Earn 500 points', unlock: (p: UserProgress) => p.totalPoints >= 500, gradient: 'from-indigo-400 to-purple-500' },
  { id: 7, emoji: '💪', title: 'Dedicated', description: '7 day streak', unlock: (p: UserProgress) => p.streak >= 7, gradient: 'from-pink-400 to-rose-500' },
  { id: 8, emoji: '🚀', title: 'Sky Rocket', description: 'Earn 1000 points', unlock: (p: UserProgress) => p.totalPoints >= 1000, gradient: 'from-cyan-400 to-blue-500' },
  { id: 9, emoji: '🎓', title: 'Scholar', description: 'Master 5 tables', unlock: (p: UserProgress) => p.masteredTables.length >= 5, gradient: 'from-green-400 to-emerald-500' },
  { id: 10, emoji: '👑', title: 'Math Royalty', description: 'Master 10 tables', unlock: (p: UserProgress) => p.masteredTables.length >= 10, gradient: 'from-yellow-400 to-amber-600' },
  { id: 11, emoji: '⚡', title: 'Lightning Fast', description: 'Answer 50 questions', unlock: (p: UserProgress) => p.totalAttempts >= 50, gradient: 'from-yellow-300 to-orange-400' },
  { id: 12, emoji: '🔮', title: 'Math Wizard', description: 'Master all 12 tables', unlock: (p: UserProgress) => p.masteredTables.length >= 12, gradient: 'from-purple-500 to-indigo-600' },
  { id: 13, emoji: '🌈', title: 'Rainbow Streak', description: '14 day streak', unlock: (p: UserProgress) => p.streak >= 14, gradient: 'from-pink-400 via-purple-400 to-indigo-400' },
  { id: 14, emoji: '💎', title: 'Diamond Mind', description: 'Earn 2000 points', unlock: (p: UserProgress) => p.totalPoints >= 2000, gradient: 'from-cyan-300 to-blue-400' },
  { id: 15, emoji: '🎪', title: 'Practice Master', description: 'Answer 100 questions', unlock: (p: UserProgress) => p.totalAttempts >= 100, gradient: 'from-red-400 to-pink-500' },
  { id: 16, emoji: '🧠', title: 'Big Brain', description: '95% accuracy', unlock: (p: UserProgress) => p.totalAttempts > 0 && (p.totalCorrect / p.totalAttempts) >= 0.95, gradient: 'from-indigo-500 to-purple-600' },
  { id: 17, emoji: '🌊', title: 'Unstoppable', description: '30 day streak', unlock: (p: UserProgress) => p.streak >= 30, gradient: 'from-blue-400 to-teal-500' },
  { id: 18, emoji: '🎉', title: 'Party Time', description: 'Earn 5000 points', unlock: (p: UserProgress) => p.totalPoints >= 5000, gradient: 'from-pink-500 to-rose-600' },
];

const timesTableData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Progress({ userProgress, setScreen }: ProgressProps) {
  const [currentView, setCurrentView] = useState<'profile' | 'achievements'>('profile');
  
  // Calculate unlocked achievements
  const unlockedAchievements = achievements.filter(ach => ach.unlock(userProgress));
  const lockedAchievements = achievements.filter(ach => !ach.unlock(userProgress));

  // Profile View
  if (currentView === 'profile') {
    return (
      <motion.div 
        className="min-h-screen bg-white pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Purple Header with Avatar */}
        <motion.div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 pt-8 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setScreen('home')}
                className="text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Settings className="w-6 h-6 text-white" />
            </div>
            
            {/* Avatar */}
            <div className="flex justify-center mb-4 relative">
              <div className="w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY2hhcmFjdGVyJTIwYXZhdGFyfGVufDF8fHx8MTc2NDUwODUwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Game Character Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Flag over the profile picture - bottom left */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-x-[60px] translate-y-[4px] text-2xl z-10">🇮🇷</span>
            </div>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div 
          className="bg-white -mt-4 rounded-t-3xl px-6 pt-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-gray-800 mb-1">Math Student</h2>
            <p className="text-gray-500 text-sm">@mathstudent • Joined December 2024</p>
          </div>

          {/* Stats Row */}
          <motion.div 
            className="grid grid-cols-3 gap-0 mb-4 divide-x divide-gray-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="text-center px-4">
              <p className="text-gray-800 mb-1">{userProgress.streak}</p>
              <p className="text-gray-500 text-xs">Courses</p>
            </div>
            
            <div className="text-center px-4">
              <p className="text-gray-800 text-[16px]">{userProgress.streak}</p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
            
            <div className="text-center px-4">
              <p className="text-gray-800">{userProgress.totalPoints}</p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
          </motion.div>

          <button className="w-full bg-blue-500 text-white py-3 rounded-xl mb-6 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            ADD FRIENDS
          </button>

          {/* Overview Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Overview</h3>
              <button className="text-blue-500 text-sm">VIEW ALL</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <Flame className="w-6 h-6 text-orange-500 mb-2" fill="currentColor" />
                <p className="text-gray-800">{userProgress.streak}</p>
                <p className="text-gray-500 text-sm">Day streak</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <div className="w-6 h-6 mb-2 flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <p className="text-gray-800">{userProgress.totalPoints}</p>
                <p className="text-gray-500 text-sm">Total XP</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <Crown className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-gray-800">Silver</p>
                <p className="text-gray-500 text-sm">Current league</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <Target className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-gray-800">{userProgress.masteredTables.length}</p>
                <p className="text-gray-500 text-sm">Top 3 finishes</p>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Achievements</h3>
              <button 
                onClick={() => setCurrentView('achievements')}
                className="text-blue-500 text-sm"
              >
                VIEW ALL
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {unlockedAchievements.slice(0, 3).map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-br ${ach.gradient} rounded-2xl aspect-square flex items-center justify-center text-4xl shadow-lg`}>
                    {ach.emoji}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    NEW
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Times Tables Progress */}
          <div className="mb-6">
            <h3 className="text-gray-800 mb-4">Achievement Characters</h3>
            <div className="grid grid-cols-4 gap-3">
              {timesTableData.map((num) => {
                const isMastered = userProgress.masteredTables.includes(num);
                const isCurrent = userProgress.currentTable === num;
                
                // Array of cartoon human character images
                const avatars = [
                  "https://images.unsplash.com/photo-1750535135645-005e250ff210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwcGVyc29uJTIwYXZhdGFyfGVufDF8fHx8MTc2NDU4MzQwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1740252117027-4275d3f84385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGNoYXJhY3RlciUyMGF2YXRhcnxlbnwxfHx8fDE3NjQ1ODM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1737505599007-9508154b194f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2hhcmFjdGVyJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2NDU2OTI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1741894785509-d87c84bdc275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwYm95JTIwY2hhcmFjdGVyfGVufDF8fHx8MTc2NDU4MzQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1620568578900-a0cf51e83c38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwZ2lybCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ1ODM0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1740252117027-4275d3f84385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGF2YXRhciUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ0NzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1763732397953-7866a2dd8289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwc3R1ZGVudCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ1ODM0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1631913290783-490324506193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYXRlZCUyMGNoYXJhY3RlciUyMGF2YXRhcnxlbnwxfHx8fDE3NjQ1ODMwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1718057948468-7f4e421be52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY2hhcmFjdGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0NTc1NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1625062422116-7f4470eadc95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwaGVybyUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ1ODMwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1740252117027-4275d3f84385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5ZnVsJTIwYXZhdGFyJTIwY2hhcmFjdGVyfGVufDF8fHx8MTc2NDU4MzQwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  "https://images.unsplash.com/photo-1732811798242-6d31a6164660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwa2lkJTIwY2hhcmFjdGVyfGVufDF8fHx8MTc2NDU4MzQwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                ];
                
                // Background gradients for each character
                const backgrounds = [
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-pink-400 to-pink-600',
                  'from-orange-400 to-orange-600',
                  'from-teal-400 to-teal-600',
                  'from-indigo-400 to-indigo-600',
                  'from-rose-400 to-rose-600',
                  'from-cyan-400 to-cyan-600',
                  'from-emerald-400 to-emerald-600',
                  'from-amber-400 to-amber-600',
                  'from-violet-400 to-violet-600',
                  'from-fuchsia-400 to-fuchsia-600'
                ];
                
                return (
                  <motion.div
                    key={num}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-xl overflow-hidden relative transition-all shadow-lg ${
                      isMastered
                        ? 'ring-4 ring-green-400'
                        : isCurrent
                        ? 'ring-4 ring-purple-400'
                        : 'opacity-50 grayscale'
                    }`}
                  >
                    {/* Colorful Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[num - 1]}`} />
                    
                    {/* Character Image */}
                    <div className="absolute inset-0 flex items-end justify-center pb-1">
                      <ImageWithFallback 
                        src={avatars[num - 1]}
                        alt={`Character ${num}`}
                        className="w-4/5 h-4/5 object-contain"
                      />
                    </div>
                    
                    {/* Number Badge */}
                    <div className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg ${
                      isMastered
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {num}
                    </div>
                    
                    {/* Checkmark for mastered */}
                    {isMastered && (
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Achievements View
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Purple Header */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 pt-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('profile')}
              className="text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white">Achievements</h1>
            <div className="w-6" />
          </div>
          
          {/* Stats */}
          <div className="text-center text-white">
            <p className="text-5xl mb-2">{unlockedAchievements.length}/{achievements.length}</p>
            <p className="text-white/80">Achievements Unlocked</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 max-w-3xl mx-auto">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-4">Unlocked 🎉</h2>
            <div className="grid grid-cols-3 gap-4">
              {unlockedAchievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-br ${ach.gradient} rounded-2xl aspect-square flex items-center justify-center text-5xl shadow-lg`}>
                    {ach.emoji}
                  </div>
                  <p className="text-center text-xs text-gray-700 mt-2">{ach.title}</p>
                  <p className="text-center text-xs text-gray-400">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-4">Locked 🔒</h2>
            <div className="grid grid-cols-3 gap-4">
              {lockedAchievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div className="bg-gray-200 rounded-2xl aspect-square flex items-center justify-center text-5xl shadow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-300/50 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <span className="opacity-30">{ach.emoji}</span>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">{ach.title}</p>
                  <p className="text-center text-xs text-gray-400">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}