import { Home, User, Swords, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen, PracticeMode } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  setPracticeMode: (mode: PracticeMode) => void;
  onStartPractice: () => void;
}

export default function BottomNav({ currentScreen, setScreen, setPracticeMode, onStartPractice }: BottomNavProps) {
  const navItems = [
    {
      id: 'home' as Screen,
      icon: Home,
      label: 'Learn',
      action: () => setScreen('home'),
    },
    {
      id: 'arena' as Screen,
      icon: Swords,
      label: 'Arena',
      action: () => setScreen('arena'),
    },
    {
      id: 'profile' as Screen,
      icon: BarChart3,
      label: 'Progress',
      action: () => setScreen('profile'),
    },
    {
      id: 'progress' as Screen,
      icon: User,
      label: 'Profile',
      action: () => setScreen('progress'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 safe-area-inset-bottom z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={item.action}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-purple-100 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-7 h-7 mb-1 transition-all ${
                    isActive ? 'fill-purple-600' : ''
                  }`}
                  strokeWidth={2.5}
                />
                <span className={`relative z-10 text-xs ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}