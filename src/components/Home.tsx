import { Play, BarChart3, Flame, Swords, Lock, Star, CheckCircle, Heart, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen, UserProgress, PracticeMode } from '../App';

interface HomeProps {
  userProgress: UserProgress;
  setScreen: (screen: Screen) => void;
  setPracticeMode: (mode: PracticeMode) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  onStartPractice?: () => void;
}

export default function Home({ userProgress, setScreen, setPracticeMode, updateProgress, onStartPractice }: HomeProps) {
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
    setScreen('practice');
  };

  // Use external handler if provided, otherwise use internal
  if (onStartPractice) {
    // Component is being used with bottom nav, don't render anything
  }

  const accuracy = userProgress.totalAttempts > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalAttempts) * 100)
    : 0;

  const getLevelStatus = (tableNumber: number) => {
    if (userProgress.masteredTables.includes(tableNumber)) {
      return 'mastered';
    } else if (tableNumber === userProgress.currentTable) {
      return 'current';
    } else if (tableNumber < userProgress.currentTable) {
      return 'unlocked';
    } else {
      return 'locked';
    }
  };

  const levelPath = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="min-h-screen pb-24">
      {/* Top Stats Bar - Duolingo Style */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-4">
          {/* Flame Streak */}
          <div className="flex items-center justify-center gap-1">
            <Flame 
              className={`w-5 h-5 ${userProgress.streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} 
              fill={userProgress.streak > 0 ? "currentColor" : "none"} 
            />
            <span className={`${userProgress.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
              {userProgress.streak}
            </span>
          </div>

          {/* Hearts */}
          <div className="flex items-center justify-center gap-1">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            <span className="text-red-500">5</span>
          </div>

          {/* Trophy - Mastered Tables */}
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span className="text-yellow-600">{userProgress.masteredTables.length}</span>
          </div>

          {/* Points */}
          <div className="flex items-center justify-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-xs">★</span>
            </div>
            <span className="text-orange-500">{userProgress.totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 text-4xl">✕</div>
              <div className="absolute top-8 right-6 text-3xl">×</div>
              <div className="absolute bottom-4 left-8 text-5xl">×</div>
              <div className="absolute bottom-2 right-4 text-3xl">✕</div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center gap-3 mb-3"
              >
                <span className="text-5xl">🏆</span>
                <div>
                  <h1 className="text-white text-4xl">MathMaster</h1>
                </div>
                <span className="text-5xl">🎯</span>
              </motion.div>
              
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <p className="text-white/90 text-lg">Master Times Tables & Compete!</p>
              </motion.div>
              
              {/* Quick Stats Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-3"
              >
                <p className="text-white text-sm">
                  Level {userProgress.currentTable} • {userProgress.masteredTables.length}/12 Mastered
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Level Path - Duolingo Style */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-600">Learning Path</h3>
            <p className="text-gray-600 text-sm">{userProgress.masteredTables.length}/12 Complete</p>
          </div>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2" />
            
            {/* Levels */}
            <div className="relative space-y-4">
              {levelPath.map((tableNum, index) => {
                const status = getLevelStatus(tableNum);
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div
                    key={tableNum}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    <button
                      onClick={() => {
                        if (status !== 'locked') {
                          updateProgress({ currentTable: tableNum });
                          setPracticeMode('level');
                          setScreen('practice');
                        }
                      }}
                      disabled={status === 'locked'}
                      className={`flex items-center gap-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'} ${
                        status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {/* Level Circle */}
                      <motion.div
                        whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                        whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          status === 'mastered'
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                            : status === 'current'
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-purple-300'
                            : status === 'unlocked'
                            ? 'bg-gradient-to-br from-blue-400 to-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {status === 'mastered' ? (
                          <CheckCircle className="w-8 h-8 text-white" />
                        ) : status === 'current' ? (
                          <Star className="w-8 h-8 text-white" fill="currentColor" />
                        ) : status === 'locked' ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : (
                          <span className="text-white text-xl">{tableNum}</span>
                        )}
                      </motion.div>
                      
                      {/* Level Info */}
                      <div className={`${isLeft ? 'text-left' : 'text-right'} ${status === 'locked' ? 'opacity-50' : ''}`}>
                        <p className={`${
                          status === 'mastered' ? 'text-green-600' :
                          status === 'current' ? 'text-purple-600' :
                          status === 'unlocked' ? 'text-blue-600' :
                          'text-gray-500'
                        }`}>
                          Level {tableNum}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {status === 'mastered' ? '✓ Mastered' :
                           status === 'current' ? 'Current' :
                           status === 'unlocked' ? 'Available' :
                           '🔒 Locked'}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-around text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
                <span className="text-gray-600">Mastered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300" />
                <span className="text-gray-600">Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}