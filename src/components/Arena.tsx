import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Swords, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, UserProgress } from '../App';
import Keyboard from './Keyboard';

interface ArenaProps {
  userProgress: UserProgress;
  setScreen: (screen: Screen) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

interface ArenaLevel {
  name: string;
  minRating: number;
  maxRating: number;
  color: string;
  icon: string;
  difficulty: number;
}

const arenaLevels: ArenaLevel[] = [
  { name: 'Bronze', minRating: 0, maxRating: 1199, color: 'from-orange-700 to-orange-900', icon: '🥉', difficulty: 5 },
  { name: 'Silver', minRating: 1200, maxRating: 1499, color: 'from-gray-400 to-gray-600', icon: '🥈', difficulty: 8 },
  { name: 'Gold', minRating: 1500, maxRating: 1799, color: 'from-yellow-400 to-yellow-600', icon: '🥇', difficulty: 10 },
  { name: 'Diamond', minRating: 1800, maxRating: 9999, color: 'from-cyan-400 to-blue-600', icon: '💎', difficulty: 12 },
];

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

interface Opponent {
  name: string;
  rating: number;
  avatar: string;
}

const generateOpponentName = () => {
  const names = [
    'MathWizard', 'NumberNinja', 'CalcMaster', 'MultiplyKing', 'AlgebraAce',
    'MathGenius', 'QuickMath', 'BrainPower', 'MathStar', 'NumberHero',
    'TimesTablePro', 'MathChampion', 'FastCalculator', 'MathWhiz', 'NumberCrusher'
  ];
  return names[Math.floor(Math.random() * names.length)];
};

const generateOpponent = (userRating: number): Opponent => {
  const ratingVariation = Math.floor(Math.random() * 200) - 100;
  const opponentRating = Math.max(800, Math.min(2200, userRating + ratingVariation));
  
  const avatars = ['🤖', '👾', '🎮', '🦊', '🐯', '🦁', '🐼', '🐨', '🐸', '🦉'];
  
  return {
    name: generateOpponentName(),
    rating: opponentRating,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  };
};

export default function Arena({ userProgress, setScreen, updateProgress }: ArenaProps) {
  const [gameState, setGameState] = useState<'lobby' | 'loading' | 'battle' | 'results'>('lobby');
  const [currentLevel, setCurrentLevel] = useState<ArenaLevel | null>(null);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [currentArenaIndex, setCurrentArenaIndex] = useState(0);
  const totalQuestions = 5;

  const getUserArenaLevel = () => {
    return arenaLevels.find(level => 
      userProgress.arenaRating >= level.minRating && userProgress.arenaRating <= level.maxRating
    ) || arenaLevels[0];
  };

  const generateQuestion = (difficulty: number) => {
    const num1 = Math.floor(Math.random() * difficulty) + 1;
    const num2 = Math.floor(Math.random() * difficulty) + 1;
    
    setCurrentQuestion({
      num1,
      num2,
      answer: num1 * num2,
    });
    setUserAnswer('');
    setFeedback(null);
  };

  const startBattle = (level: ArenaLevel) => {
    setCurrentLevel(level);
    setOpponent(generateOpponent(userProgress.arenaRating));
    setGameState('loading');
    setPlayerScore(0);
    setOpponentScore(0);
    setQuestionsAsked(0);
    
    // Show loading screen for 2.5 seconds
    setTimeout(() => {
      setGameState('battle');
      generateQuestion(level.difficulty);
    }, 2500);
  };

  const simulateOpponentAnswer = () => {
    // Opponent has a chance to answer correctly based on their rating
    const opponentAccuracy = Math.min(95, (opponent!.rating / 2500) * 100);
    const random = Math.random() * 100;
    return random < opponentAccuracy;
  };

  const handleSubmit = () => {
    if (!currentQuestion || userAnswer === '' || !currentLevel) return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setPlayerScore(prev => prev + 1);
    }

    // Simulate opponent's answer
    const opponentCorrect = simulateOpponentAnswer();
    if (opponentCorrect) {
      setOpponentScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (questionsAsked + 1 >= totalQuestions) {
        endBattle();
      } else {
        setQuestionsAsked(prev => prev + 1);
        generateQuestion(currentLevel.difficulty);
      }
    }, 1500);
  };

  const handleNumberClick = (num: string) => {
    if (userAnswer.length < 4) {
      setUserAnswer(userAnswer + num);
    }
  };

  const handleDelete = () => {
    setUserAnswer(userAnswer.slice(0, -1));
  };

  const endBattle = () => {
    setGameState('results');
    
    const won = playerScore > opponentScore;
    const ratingChange = won ? 25 : -15;
    const newRating = Math.max(800, Math.min(2500, userProgress.arenaRating + ratingChange));
    
    updateProgress({
      arenaRating: newRating,
      arenaWins: won ? userProgress.arenaWins + 1 : userProgress.arenaWins,
      arenaLosses: won ? userProgress.arenaLosses : userProgress.arenaLosses + 1,
      totalPoints: userProgress.totalPoints + (playerScore * 20),
    });
  };

  if (gameState === 'loading' && currentLevel && opponent) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-xl w-full text-center"
        >
          {/* Arena Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            {currentLevel.icon}
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-purple-600 mb-8"
          >
            Finding Opponent...
          </motion.h2>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-8 max-w-md mx-auto">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
            />
          </div>

          {/* Opponent Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">You</p>
                <p className="text-2xl mb-2">👤</p>
                <p className="text-purple-600">{userProgress.arenaRating}</p>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Swords className="w-10 h-10 text-purple-600" />
              </motion.div>

              <div className="text-center">
                <p className="text-gray-600 mb-2">Opponent</p>
                <motion.p
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl mb-2"
                >
                  {opponent.avatar}
                </motion.p>
                <p className="text-purple-600">{opponent.rating}</p>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-700 mt-4"
            >
              {opponent.name}
            </motion.p>
          </motion.div>

          {/* Arena Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className={`bg-gradient-to-r ${currentLevel.color} rounded-2xl p-4 mt-6 text-white`}
          >
            <p className="text-sm opacity-90 mb-1">{currentLevel.name} Arena</p>
            <p className="text-xl">First to {Math.ceil(totalQuestions / 2)} wins!</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    const userLevel = getUserArenaLevel();
    
    const handleDragEnd = (event: any, info: any) => {
      const swipeThreshold = 50;
      
      if (info.offset.x > swipeThreshold && currentArenaIndex > 0) {
        // Swipe right - go to previous arena
        setCurrentArenaIndex(prev => prev - 1);
      } else if (info.offset.x < -swipeThreshold && currentArenaIndex < arenaLevels.length - 1) {
        // Swipe left - go to next arena
        setCurrentArenaIndex(prev => prev + 1);
      }
    };
    
    const currentArena = arenaLevels[currentArenaIndex];
    const isUnlocked = userProgress.arenaRating >= currentArena.minRating;
    const isCurrent = userLevel.name === currentArena.name;
    
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto pb-32">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setScreen('home')}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white">Arena Battle</h1>
          <div className="w-12" />
        </div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-purple-600 mb-2">Your Arena Stats</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{userLevel.icon}</span>
                <div>
                  <p className="text-gray-800 text-xl">{userLevel.name} Division</p>
                  <p className="text-gray-600">Rating: {userProgress.arenaRating}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Record</p>
              <p className="text-green-600">{userProgress.arenaWins}W</p>
              <p className="text-red-600">{userProgress.arenaLosses}L</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              {arenaLevels.map((level, index) => (
                <div key={level.name} className="flex flex-col items-center">
                  <span className={`text-2xl ${userLevel.name === level.name ? 'scale-125' : 'opacity-50'}`}>
                    {level.icon}
                  </span>
                  <span className={userLevel.name === level.name ? 'font-semibold' : ''}>
                    {level.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Swipeable Arena Cards */}
        <div className="mb-4">
          <h3 className="text-white text-center mb-6">Swipe to Explore Arenas</h3>
          
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentArenaIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <motion.button
                  onClick={() => isUnlocked && startBattle(currentArena)}
                  disabled={!isUnlocked}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  className={`w-full bg-gradient-to-r ${currentArena.color} rounded-3xl p-8 shadow-2xl transition-all ${
                    isUnlocked 
                      ? 'cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed grayscale'
                  } ${isCurrent ? 'ring-4 ring-yellow-300' : ''}`}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-9xl mb-4"
                    >
                      {currentArena.icon}
                    </motion.div>
                    <h2 className="text-white mb-2">{currentArena.name} Arena</h2>
                    <p className="text-white/90 text-lg">
                      {isUnlocked 
                        ? `Difficulty: ${currentArena.difficulty} | Rating: ${currentArena.minRating}+`
                        : `🔒 Requires ${currentArena.minRating} rating`
                      }
                    </p>
                  </div>
                  
                  {isCurrent && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                      <span className="text-white">Your Current Division</span>
                    </div>
                  )}
                  
                  {isUnlocked && !isCurrent && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                      <span className="text-white">Tap to Battle</span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {arenaLevels.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentArenaIndex(index)}
                className={`rounded-full transition-all ${
                  index === currentArenaIndex 
                    ? 'bg-white w-8 h-3' 
                    : 'bg-white/40 w-3 h-3 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Hint */}
          <div className="flex justify-between items-center mt-6 px-4">
            <button
              onClick={() => currentArenaIndex > 0 && setCurrentArenaIndex(prev => prev - 1)}
              className={`text-white/80 transition-opacity ${
                currentArenaIndex === 0 ? 'opacity-30' : 'hover:text-white'
              }`}
              disabled={currentArenaIndex === 0}
            >
              ← Previous
            </button>
            <p className="text-white/60 text-sm">
              {currentArenaIndex + 1} / {arenaLevels.length}
            </p>
            <button
              onClick={() => currentArenaIndex < arenaLevels.length - 1 && setCurrentArenaIndex(prev => prev + 1)}
              className={`text-white/80 transition-opacity ${
                currentArenaIndex === arenaLevels.length - 1 ? 'opacity-30' : 'hover:text-white'
              }`}
              disabled={currentArenaIndex === arenaLevels.length - 1}
            >
              Next →
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-6 text-center"
        >
          <p className="text-white/90">
            💡 Win battles to increase your rating and unlock higher arenas!
          </p>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'battle' && currentQuestion && opponent && currentLevel) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto">
        {/* Battle Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setGameState('lobby')}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
            <span className="text-white">Question {questionsAsked + 1}/{totalQuestions}</span>
          </div>

          <div className="text-3xl">{currentLevel.icon}</div>
        </div>

        {/* Battle Score */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500 rounded-2xl p-4 text-center text-white shadow-lg">
            <p className="text-sm mb-1">You</p>
            <p className="text-4xl">{playerScore}</p>
          </div>
          
          <div className="flex items-center justify-center">
            <Swords className="w-12 h-12 text-white" />
          </div>
          
          <div className="bg-red-500 rounded-2xl p-4 text-center text-white shadow-lg">
            <p className="text-sm mb-1">{opponent.name}</p>
            <p className="text-4xl">{opponentScore}</p>
          </div>
        </div>

        {/* Opponent Info */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{opponent.avatar}</span>
            <div>
              <p className="text-gray-800">{opponent.name}</p>
              <p className="text-gray-600 text-sm">Rating: {opponent.rating}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm">Arena</p>
            <p className="text-gray-800">{currentLevel.name}</p>
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {feedback === null ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="inline-block"
                  >
                    <span className="text-7xl text-purple-600">
                      {currentQuestion.num1} × {currentQuestion.num2}
                    </span>
                  </motion.div>
                </div>

                {/* Answer Display */}
                <div className="w-full text-center text-5xl p-6 border-4 border-purple-200 rounded-2xl bg-purple-50 mb-6 min-h-[80px] flex items-center justify-center">
                  <span className="text-purple-600">
                    {userAnswer || '?'}
                  </span>
                </div>
              </div>

              {/* Keyboard */}
              <Keyboard
                onNumberClick={handleNumberClick}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                disabled={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                feedback === 'correct'
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : 'bg-gradient-to-br from-red-400 to-rose-500'
              } rounded-3xl p-8 shadow-xl text-center text-white`}
            >
              <div className="text-6xl mb-4">
                {feedback === 'correct' ? '✓' : '✗'}
              </div>
              <h2 className="mb-4">
                {feedback === 'correct' ? 'Correct! 🎯' : 'Wrong!'}
              </h2>
              {feedback === 'incorrect' && (
                <p className="text-xl">Answer: {currentQuestion.answer}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (gameState === 'results' && opponent && currentLevel) {
    const won = playerScore > opponentScore;
    const draw = playerScore === opponentScore;
    const ratingChange = won ? 25 : draw ? 0 : -15;
    
    return (
      <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl w-full"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: won ? 360 : 0 }}
              transition={{ duration: 1 }}
              className="text-8xl mb-4"
            >
              {won ? '🏆' : draw ? '🤝' : '😔'}
            </motion.div>
            <h2 className={`${won ? 'text-green-600' : draw ? 'text-gray-600' : 'text-red-600'} mb-2`}>
              {won ? 'Victory!' : draw ? 'Draw!' : 'Defeat'}
            </h2>
            <p className="text-gray-700">
              {won 
                ? 'Great job! You defeated your opponent!' 
                : draw
                ? 'You tied with your opponent!'
                : 'Keep practicing and try again!'}
            </p>
          </div>

          {/* Battle Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-gray-600 mb-1">You</p>
                <p className="text-green-600 text-4xl">{playerScore}</p>
              </div>
              <div className="flex items-center justify-center text-gray-400 text-2xl">
                VS
              </div>
              <div>
                <p className="text-gray-600 mb-1">{opponent.name}</p>
                <p className="text-red-600 text-4xl">{opponentScore}</p>
              </div>
            </div>
          </div>

          {/* Rating Change */}
          <div className={`rounded-2xl p-6 mb-6 ${
            won 
              ? 'bg-green-50' 
              : draw 
              ? 'bg-gray-50' 
              : 'bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Rating Change</p>
                <p className={`text-3xl ${
                  ratingChange > 0 
                    ? 'text-green-600' 
                    : ratingChange < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {ratingChange > 0 ? '+' : ''}{ratingChange}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 mb-1">New Rating</p>
                <p className="text-purple-600 text-3xl">{userProgress.arenaRating}</p>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-purple-600 text-center mb-2">Points Earned</p>
            <p className="text-purple-600 text-4xl text-center">+{playerScore * 20}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setGameState('lobby')}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Back to Lobby
            </button>
            <button
              onClick={() => startBattle(currentLevel)}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Battle Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}