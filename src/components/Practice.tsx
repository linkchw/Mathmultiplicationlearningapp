import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Clock, Heart, Play, Crown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, UserProgress, PracticeMode } from '../App';
import Keyboard from './Keyboard';

interface PracticeProps {
  userProgress: UserProgress;
  setScreen: (screen: Screen) => void;
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

export default function Practice({ userProgress, setScreen, practiceMode, setPracticeMode, updateProgress }: PracticeProps) {
  const [gameMode, setGameMode] = useState<PracticeMode>(practiceMode);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timedScore, setTimedScore] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const totalQuestions = 10;

  const goBackHome = () => {
    setPracticeMode('select');
    setScreen('home');
  };

  const generateQuestion = () => {
    // Generate random 10-digit numbers
    const num1 = Math.floor(Math.random() * 9000000000) + 1000000000;
    const num2 = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    setCurrentQuestion({
      num1,
      num2,
      answer: num1 * num2,
    });
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    setGameMode(practiceMode);
  }, [practiceMode]);

  useEffect(() => {
    if (gameMode !== 'select') {
      generateQuestion();
    }
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'timed' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameMode === 'timed' && timeRemaining === 0) {
      completeTimedMode();
    }
  }, [gameMode, timeRemaining]);

  // Ad timer effect
  useEffect(() => {
    if (showAdModal && adTimer > 0) {
      const timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showAdModal && adTimer === 0) {
      // Ad completed, give heart
      setHearts(prev => prev + 1);
      setShowAdModal(false);
      setAdTimer(5);
    }
  }, [showAdModal, adTimer]);

  const handleWatchAd = () => {
    setShowAdModal(true);
    setAdTimer(5);
  };

  const handleGetPremium = () => {
    setShowPremiumModal(true);
  };

  const handlePurchasePremium = () => {
    updateProgress({ isPremium: true });
    setShowPremiumModal(false);
    // Optionally give full hearts
    setHearts(5);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!currentQuestion || userAnswer === '') return;

    // Use BigInt for large number comparison
    const userAnswerBigInt = BigInt(userAnswer);
    const correctAnswerBigInt = BigInt(currentQuestion.answer);
    const isCorrect = userAnswerBigInt === correctAnswerBigInt;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    updateProgress({
      totalCorrect: userProgress.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: userProgress.totalAttempts + 1,
    });

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      if (gameMode === 'timed') {
        setTimedScore(prev => prev + 1);
      }
    } else if (gameMode === 'level') {
      // Lose a heart for wrong answer in level mode
      setHearts(prev => prev - 1);
    }

    setTimeout(() => {
      // Check if lost all hearts in level mode
      if (gameMode === 'level' && hearts - (isCorrect ? 0 : 1) <= 0) {
        // Lost the level
        return;
      }

      if (gameMode === 'timed') {
        generateQuestion();
      } else {
        if (questionsCompleted + 1 >= totalQuestions) {
          completeLesson();
        } else {
          setQuestionsCompleted(prev => prev + 1);
          generateQuestion();
        }
      }
    }, 1500);
  };

  const handleKeyboardNumber = (num: string) => {
    setUserAnswer(prev => prev + num);
  };

  const handleKeyboardDelete = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleKeyboardSubmit = () => {
    handleSubmit();
  };

  const completeLesson = () => {
    const pointsEarned = correctAnswers * 10;
    
    updateProgress({
      totalPoints: userProgress.totalPoints + pointsEarned,
    });

    // In level mode, unlock next level if completed successfully
    if (gameMode === 'level' && hearts > 0) {
      if (!userProgress.masteredTables.includes(userProgress.currentTable)) {
        const newMastered = [...userProgress.masteredTables, userProgress.currentTable];
        const nextTable = userProgress.currentTable < 12 ? userProgress.currentTable + 1 : 12;
        updateProgress({
          masteredTables: newMastered,
          currentTable: nextTable,
        });
      }
    } else if (gameMode !== 'level') {
      // Old logic for daily challenge mode
      if (correctAnswers >= 8 && !userProgress.masteredTables.includes(userProgress.currentTable)) {
        const newMastered = [...userProgress.masteredTables, userProgress.currentTable];
        const nextTable = userProgress.currentTable < 12 ? userProgress.currentTable + 1 : 12;
        updateProgress({
          masteredTables: newMastered,
          currentTable: nextTable,
        });
      }
    }
  };

  const completeTimedMode = () => {
    const pointsEarned = timedScore * 5;
    updateProgress({
      totalPoints: userProgress.totalPoints + pointsEarned,
    });
  };

  const progress = (questionsCompleted / totalQuestions) * 100;

  // Lost screen (ran out of hearts)
  if (gameMode === 'level' && hearts <= 0) {
    return (
      <>
        <div className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-xl w-full max-w-lg"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-8xl mb-4"
            >
              😔
            </motion.div>
            <h2 className="text-red-600 mb-2">Out of Hearts!</h2>
            <p className="text-gray-700 mb-6">
              Choose a plan to continue learning
            </p>

            {/* Free Option - Watch Ad */}
            <button
              onClick={handleWatchAd}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 mb-6"
            >
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>Watch Ad (Free)</span>
                  <Heart className="w-5 h-5" fill="currentColor" />
                </div>
                <p className="text-white/80 text-sm">Get 1 heart in 5 seconds</p>
              </div>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or get Premium</span>
              </div>
            </div>

            {/* Premium Plans */}
            <div className="space-y-3 mb-6">
              {/* 1 Month Plan */}
              <button
                onClick={handleGetPremium}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5" />
                      <span>1 Month</span>
                    </div>
                    <p className="text-white/80 text-sm">Unlimited hearts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">$4.99</p>
                    <p className="text-white/60 text-xs">per month</p>
                  </div>
                </div>
              </button>

              {/* 3 Month Plan - Most Popular */}
              <button
                onClick={handleGetPremium}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white p-4 rounded-xl hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-xl">
                  Popular
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5" />
                      <span>3 Months</span>
                    </div>
                    <p className="text-white/80 text-sm">Save 20%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">$11.99</p>
                    <p className="text-white/60 text-xs line-through">$14.97</p>
                  </div>
                </div>
              </button>

              {/* 6 Month Plan */}
              <button
                onClick={handleGetPremium}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5" />
                      <span>6 Months</span>
                    </div>
                    <p className="text-white/80 text-sm">Save 30%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">$20.99</p>
                    <p className="text-white/60 text-xs line-through">$29.94</p>
                  </div>
                </div>
              </button>

              {/* 1 Year Plan - Best Value */}
              <button
                onClick={handleGetPremium}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Best Value
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5" />
                      <span>1 Year</span>
                    </div>
                    <p className="text-white/80 text-sm">Save 50%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">$29.99</p>
                    <p className="text-white/60 text-xs line-through">$59.88</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={goBackHome}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>

        {/* Ad Modal */}
        <AnimatePresence>
          {showAdModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
              onClick={(e) => {
                if (e.target === e.currentTarget && adTimer > 0) {
                  setShowAdModal(false);
                  setAdTimer(5);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              >
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-purple-600 mb-4">Watching Ad...</h3>
                
                {/* Simulated Ad Content */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
                  <div className="text-5xl mb-3">🎮</div>
                  <p className="text-gray-800 mb-2">Super Fun Math Game!</p>
                  <p className="text-gray-600 text-sm">Download now and play!</p>
                </div>

                {/* Timer Circle */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#8B5CF6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (adTimer / 5)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-purple-600 text-3xl">{adTimer}</span>
                  </div>
                </div>

                <p className="text-gray-600">
                  {adTimer > 0 ? 'Please wait...' : 'Ad complete! +1 ❤️'}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Modal */}
        <AnimatePresence>
          {showPremiumModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowPremiumModal(false);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              >
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-purple-600 mb-2">Go Premium!</h3>
                <p className="text-gray-600 mb-6">Unlock unlimited hearts and learn without limits</p>

                {/* Premium Features */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-white" fill="currentColor" />
                      </div>
                      <p className="text-gray-700">Unlimited Hearts</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700">No Ads</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700">Premium Badge</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">One-time payment</p>
                  <p className="text-purple-600 text-4xl">$4.99</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePurchasePremium}
                    className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Purchase Premium</span>
                  </button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Results screen for level mode (won)
  if (gameMode === 'level' && questionsCompleted >= totalQuestions) {
    const pointsEarned = correctAnswers * 10;
    const levelUnlocked = !userProgress.masteredTables.includes(userProgress.currentTable);
    
    return (
      <div className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-xl w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>
          <h2 className="text-green-600 mb-4">Level Complete!</h2>
          <p className="text-gray-700 mb-6">
            You mastered the {userProgress.currentTable}× table with {hearts} {hearts === 1 ? 'heart' : 'hearts'} remaining!
          </p>
          
          <div className="bg-green-50 rounded-2xl p-6 mb-6">
            <p className="text-green-600 mb-2">Score</p>
            <p className="text-green-600 text-3xl">{correctAnswers}/{totalQuestions} Correct</p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: hearts }).map((_, i) => (
                <Heart key={i} className="w-6 h-6 text-red-500" fill="currentColor" />
              ))}
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-purple-600 mb-2">Points Earned</p>
            <p className="text-purple-600 text-5xl">+{pointsEarned}</p>
          </div>

          {levelUnlocked && userProgress.currentTable < 12 && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 mb-6 text-white">
              <p className="text-2xl mb-2">🎉 New Level Unlocked! 🎉</p>
              <p>Level {userProgress.currentTable + 1} is now available!</p>
            </div>
          )}

          <button
            onClick={goBackHome}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Results screen for daily challenge mode
  if (gameMode !== 'level' && gameMode !== 'timed' && questionsCompleted >= totalQuestions) {
    const pointsEarned = correctAnswers * 10;
    const tableMastered = correctAnswers >= 8 && !userProgress.masteredTables.includes(userProgress.currentTable);
    
    return (
      <div className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-xl w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="text-8xl mb-4"
          >
            {correctAnswers >= 8 ? '🎉' : '💪'}
          </motion.div>
          <h2 className="text-purple-600 mb-4">Practice Complete!</h2>
          <p className="text-gray-700 mb-6">
            You got {correctAnswers} out of {totalQuestions} correct
          </p>
          
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-purple-600 mb-2">Points Earned</p>
            <p className="text-purple-600 text-5xl">+{pointsEarned}</p>
          </div>

          {tableMastered && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 mb-6 text-white">
              <p className="text-2xl mb-2">🏆 Table Mastered! 🏆</p>
              <p>You've mastered the {userProgress.currentTable}× table!</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={goBackHome}
              className="flex-1 bg-gray-800 text-white py-5 rounded-xl hover:bg-gray-900 transition-all text-lg shadow-lg border-2 border-gray-700 mb-24"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => {
                setQuestionsCompleted(0);
                setCorrectAnswers(0);
                generateQuestion();
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Practice Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results screen for timed mode
  if (gameMode === 'timed' && timeRemaining === 0) {
    const pointsEarned = timedScore * 5;
    
    return (
      <div className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 text-center shadow-xl w-full"
        >
          <div className="text-8xl mb-4">⚡</div>
          <h2 className="text-purple-600 mb-4">Time's Up!</h2>
          
          <div className="bg-orange-50 rounded-2xl p-6 mb-6">
            <p className="text-orange-600 mb-2">Questions Answered</p>
            <p className="text-orange-600 text-5xl">{timedScore}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-purple-600 mb-2">Points Earned</p>
            <p className="text-purple-600 text-5xl">+{pointsEarned}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={goBackHome}
              className="flex-1 bg-gray-800 text-white py-5 rounded-xl hover:bg-gray-900 transition-all text-lg shadow-lg border-2 border-gray-700"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => {
                setGameMode('timed');
                setTimeRemaining(30);
                setTimedScore(0);
                setQuestionsCompleted(0);
                setCorrectAnswers(0);
                generateQuestion();
              }}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // Mode selection screen
  if (gameMode === 'select') {
    return (
      <div className="min-h-screen p-6 max-w-2xl mx-auto flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-purple-600 mb-4">Choose Practice Mode</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setGameMode('level')}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white">💚 Level Mode</h3>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Heart key={i} className="w-5 h-5 text-white" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-white/80">Master the {userProgress.currentTable}× table with 5 hearts</p>
              <p className="text-white/80 mt-2">Complete all questions to unlock the next level!</p>
            </button>

            <button
              onClick={() => setGameMode('timed')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl hover:shadow-lg transition-all text-left"
            >
              <h3 className="text-white mb-2">⚡ Timed Challenge (30s)</h3>
              <p className="text-white/80">Answer as many as you can in 30 seconds!</p>
              <p className="text-white/80 mt-2">Earn: 5 points per correct answer</p>
            </button>

            <button
              onClick={goBackHome}
              className="w-full bg-gray-800 text-white py-5 rounded-xl hover:bg-gray-900 transition-all text-lg shadow-lg border-2 border-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goBackHome}
          className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-4">
          {gameMode === 'level' && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-6 h-6 ${i < hearts ? 'text-red-500' : 'text-gray-400'}`} 
                  fill={i < hearts ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          )}
          
          {gameMode === 'timed' ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white text-xl">{timeRemaining}s</span>
            </div>
          ) : gameMode !== 'level' && (
            <div className="flex-1 mx-4 max-w-xs">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white">
              {gameMode === 'timed' ? `${timedScore} correct` : `${questionsCompleted}/${totalQuestions}`}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {feedback === null ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-gray-600 text-center mb-8">What is...</h3>
            
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="inline-block"
              >
                <div className="flex flex-col items-end text-3xl text-purple-600 font-mono">
                  <div className="mb-2">{currentQuestion.num1}</div>
                  <div className="flex items-center gap-2">
                    <span>×</span>
                    <span>{currentQuestion.num2}</span>
                  </div>
                  <div className="w-full border-b-4 border-purple-600 mt-2"></div>
                </div>
              </motion.div>
            </div>

            {/* Answer Display */}
            <div className="mb-8">
              <div className="w-full text-center text-4xl p-6 border-4 border-purple-200 rounded-2xl bg-purple-50 min-h-[100px] flex items-center justify-center overflow-x-auto">
                <span className="text-purple-600">
                  {userAnswer || '?'}
                </span>
              </div>
            </div>

            {/* On-Screen Keyboard */}
            <Keyboard
              onNumberClick={handleKeyboardNumber}
              onDelete={handleKeyboardDelete}
              onSubmit={handleKeyboardSubmit}
              disabled={userAnswer === ''}
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
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              {feedback === 'correct' ? (
                <Check className="w-24 h-24 mx-auto" strokeWidth={3} />
              ) : (
                <X className="w-24 h-24 mx-auto" strokeWidth={3} />
              )}
            </motion.div>

            <h2 className="mb-4">
              {feedback === 'correct' ? 'Correct! 🎉' : 'Not quite'}
            </h2>

            {feedback === 'incorrect' && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-xl mb-2">
                  {currentQuestion.num1} × {currentQuestion.num2} = {currentQuestion.answer}
                </p>
                <p className="text-white/80">
                  Think of it as {currentQuestion.num1} groups of {currentQuestion.num2}
                </p>
              </div>
            )}

            {feedback === 'correct' && (
              <p className="text-xl">+{gameMode === 'timed' ? 5 : 10} points</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding for fixed navigation */}
      <div className="h-24" />
    </div>
  );
}