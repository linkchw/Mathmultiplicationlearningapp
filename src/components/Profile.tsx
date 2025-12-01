import { useState, useEffect } from 'react';
import { Screen } from '../App';
import { UserProgress } from '../App';
import { Trophy, Lock, Clock, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileProps {
  userProgress: UserProgress;
  setScreen: (screen: Screen) => void;
}

type League = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' | 'Legend' | 'Mythic' | 'Immortal';

export default function Profile({ userProgress }: ProfileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 32 });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const leagues: { name: League; color: string; bg: string; gradient: string; range: string; locked: boolean }[] = [
    { 
      name: 'Bronze', 
      color: 'text-orange-700', 
      bg: 'bg-orange-100', 
      gradient: 'from-orange-400 to-orange-700',
      range: '1000-1199',
      locked: false
    },
    { 
      name: 'Silver', 
      color: 'text-gray-500', 
      bg: 'bg-gray-200', 
      gradient: 'from-gray-300 to-gray-600',
      range: '1200-1399',
      locked: true
    },
    { 
      name: 'Gold', 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-100', 
      gradient: 'from-yellow-400 to-yellow-600',
      range: '1400-1599',
      locked: true
    },
    { 
      name: 'Platinum', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100', 
      gradient: 'from-emerald-400 to-emerald-700',
      range: '1600-1799',
      locked: true
    },
    { 
      name: 'Diamond', 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-100', 
      gradient: 'from-cyan-400 to-blue-600',
      range: '1800-1999',
      locked: true
    },
    { 
      name: 'Master', 
      color: 'text-purple-600', 
      bg: 'bg-purple-100', 
      gradient: 'from-purple-500 to-purple-800',
      range: '2000-2199',
      locked: true
    },
    { 
      name: 'Grandmaster', 
      color: 'text-pink-600', 
      bg: 'bg-pink-100', 
      gradient: 'from-pink-500 to-rose-700',
      range: '2200-2399',
      locked: true
    },
    { 
      name: 'Legend', 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      gradient: 'from-red-500 to-rose-800',
      range: '2400-2599',
      locked: true
    },
    { 
      name: 'Mythic', 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100', 
      gradient: 'from-indigo-500 to-indigo-900',
      range: '2600-2799',
      locked: true
    },
    { 
      name: 'Immortal', 
      color: 'text-amber-600', 
      bg: 'bg-amber-100', 
      gradient: 'from-amber-400 to-yellow-700',
      range: '2800+',
      locked: true
    },
  ];

  const selectedLeague = leagues[currentIndex];

  // Generate leaderboard based on selected league
  const generateLeaderboard = (league: League) => {
    const avatars = ['🦊', '🐯', '🦁', '🐼', '🐨', '🦉', '🐸', '🦄', '🐲', '🦅', '🐵', '🐻', '🐷', '🐮', '🐔', '🐺', '🦒', '🐘', '🐧', '🦎'];
    const names = [
      'MathWizard', 'NumberNinja', 'CalcMaster', 'MultiplyKing', 'AlgebraAce',
      'MathGenius', 'QuickMath', 'BrainPower', 'MathStar', 'NumberHero',
      'CalcPro', 'MathHero', 'QuizMaster', 'BrainStorm', 'MathChamp',
      'NumLegend', 'MathKnight', 'CalcGuru', 'NumWhiz', 'MathPro'
    ];
    const flags = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇪🇸', '🇮🇹', '🇯🇵', '🇰🇷', '🇧🇷', '🇲🇽', '🇮🇳', '🇨🇳', '🇷🇺', '🇸🇪', '🇳🇴', '🇵🇱', '🇹🇷', '🇦🇷'];

    // Define point ranges for each league
    const pointRanges: Record<League, { min: number; max: number }> = {
      Bronze: { min: 1000, max: 1199 },
      Silver: { min: 1200, max: 1399 },
      Gold: { min: 1400, max: 1599 },
      Platinum: { min: 1600, max: 1799 },
      Diamond: { min: 1800, max: 1999 },
      Master: { min: 2000, max: 2199 },
      Grandmaster: { min: 2200, max: 2399 },
      Legend: { min: 2400, max: 2599 },
      Mythic: { min: 2600, max: 2799 },
      Immortal: { min: 2800, max: 3500 },
    };

    const range = pointRanges[league];
    
    const players = names.map((name, index) => ({
      name,
      avatar: avatars[index],
      flag: flags[index],
      points: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
      isUser: index === 7 // MathStar is current user
    }));

    // Sort by points and return top 20
    return players
      .sort((a, b) => b.points - a.points)
      .slice(0, 20)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }));
  };

  const leaderboard = generateLeaderboard(selectedLeague.name);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    const offset = e.targetTouches[0].clientX - touchStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < leagues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - startX;
    setDragOffset(offset);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const distance = startX - e.clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < leagues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      setStartX(0);
    }
  };

  return (
    <motion.div 
      className="min-h-screen p-6 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* League Swipeable Tabs */}
        <motion.div 
          className="bg-white rounded-t-2xl p-3 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div 
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            onTouchStart={(e) => {
              const target = e.currentTarget;
              target.dataset.isDragging = 'true';
              target.dataset.startX = e.touches[0].pageX.toString();
              target.dataset.scrollLeft = target.scrollLeft.toString();
            }}
            onTouchMove={(e) => {
              const target = e.currentTarget;
              if (target.dataset.isDragging !== 'true') return;
              
              const x = e.touches[0].pageX;
              const startX = parseFloat(target.dataset.startX || '0');
              const scrollLeft = parseFloat(target.dataset.scrollLeft || '0');
              const walk = (startX - x) * 2; // *2 for faster scrolling
              target.scrollLeft = scrollLeft + walk;
            }}
            onTouchEnd={(e) => {
              const target = e.currentTarget;
              target.dataset.isDragging = 'false';
            }}
          >
            <div 
              className="flex gap-2"
            >
              {leagues.map((league) => (
                <div
                  key={league.name}
                  className="w-20 flex-shrink-0 flex flex-col items-center snap-center"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                    league.locked
                      ? 'bg-gray-100'
                      : `bg-gradient-to-br ${league.gradient}`
                  }`}>
                    {league.locked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Trophy className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h2 className={`text-xs mb-0.5 ${league.locked ? 'text-gray-400' : league.color}`}>
                    {league.name}
                  </h2>
                  <p className={`text-[10px] ${league.locked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {league.range}
                  </p>
                  {league.locked && (
                    <div className="mt-1 bg-gray-100 rounded-full px-2 py-0.5">
                      <p className="text-[9px] text-gray-500">🔒</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {!selectedLeague.locked && (
          <motion.div 
            className="bg-white rounded-b-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header */}
            <div className="bg-white p-4 text-purple-600">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">{selectedLeague.name} League</h2>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
                </div>
              </div>
              <p className="text-xs text-purple-500">Top 5 advance to the next league!</p>
            </div>
            
            {/* Players List */}
            <div className="p-4">
              {/* Promotion Zone - Top 5 */}
              <div className="mb-6">
                <div className="space-y-1">
                  {leaderboard.slice(0, 5).map((player, index) => {
                    // Trophy colors and backgrounds for top 3
                    let trophyBg = '';
                    let trophyTop = '';
                    if (player.rank === 1) {
                      trophyBg = 'bg-yellow-400';
                      trophyTop = 'bg-yellow-500';
                    } else if (player.rank === 2) {
                      trophyBg = 'bg-gray-300';
                      trophyTop = 'bg-gray-400';
                    } else if (player.rank === 3) {
                      trophyBg = 'bg-orange-400';
                      trophyTop = 'bg-orange-500';
                    }
                    
                    return (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                          player.isUser 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-green-50'
                        }`}
                      >
                        {/* Trophy or Rank Number */}
                        {player.rank <= 3 ? (
                          <div className="w-6 flex-shrink-0 flex justify-center">
                            <div className="relative w-5 h-6 flex flex-col items-center">
                              {/* Trophy Top */}
                              <div className={`w-4 h-2 ${trophyTop} rounded-t-sm`}></div>
                              {/* Trophy Cup */}
                              <div className={`w-5 h-3 ${trophyBg} rounded-b flex items-center justify-center`}>
                                <span className="text-[8px] text-white">{player.rank}</span>
                              </div>
                              {/* Trophy Base */}
                              <div className="w-3 h-1 bg-blue-200 rounded-sm"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-6 text-center flex-shrink-0">
                            <span className="text-sm text-gray-600">{player.rank}</span>
                          </div>
                        )}
                        
                        {/* Avatar Circle */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-xl">{player.avatar}</span>
                          </div>
                        </div>
                        
                        {/* Name + Flag */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm truncate">{player.name}</p>
                            <span className="text-sm flex-shrink-0">{player.flag}</span>
                          </div>
                        </div>
                        
                        {/* XP Points */}
                        <div className="flex-shrink-0">
                          <p className="text-sm text-orange-600">{player.points} XP</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Safe Zone - Middle Players (6-15) */}
              {leaderboard.slice(5, 15).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Promotion Zone</span>
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="space-y-1">
                    {leaderboard.slice(5, 15).map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                          player.isUser 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-gray-50'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-6 text-center flex-shrink-0">
                          <span className="text-sm text-gray-600">{player.rank}</span>
                        </div>
                        
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{player.avatar}</span>
                        </div>
                        
                        {/* Name + Flag */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm truncate">{player.name}</p>
                            <span className="text-sm flex-shrink-0">{player.flag}</span>
                          </div>
                        </div>
                        
                        {/* XP */}
                        <div className="flex-shrink-0">
                          <p className="text-sm text-orange-600">{player.points} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demotion Zone - Bottom 5 (16-20) */}
              {leaderboard.slice(15, 20).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
                      <ArrowDown className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-600">Demotion Zone</span>
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="space-y-1">
                    {leaderboard.slice(15, 20).map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                          player.isUser 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-red-50'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-6 text-center flex-shrink-0">
                          <span className="text-sm text-gray-600">{player.rank}</span>
                        </div>
                        
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-300 to-red-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{player.avatar}</span>
                        </div>
                        
                        {/* Name + Flag */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm truncate">{player.name}</p>
                            <span className="text-sm flex-shrink-0">{player.flag}</span>
                          </div>
                        </div>
                        
                        {/* XP */}
                        <div className="flex-shrink-0">
                          <p className="text-sm text-orange-600">{player.points} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Locked Message */}
        {selectedLeague.locked && (
          <div className="bg-white rounded-b-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-800 mb-2">League Locked</h3>
            <p className="text-gray-600 text-sm">
              Win more battles to unlock this league!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}