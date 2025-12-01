import { Bell, Sparkles } from 'lucide-react';

interface PremiumButtonProps {
  onClick: () => void;
}

export default function PremiumButton({ onClick }: PremiumButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 premium-float-button group"
      style={{ zIndex: 999 }}
      aria-label="Get Premium"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
      
      {/* Main button */}
      <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
        </div>
        
        {/* Bell icon with ringing animation */}
        <Bell className="w-7 h-7 text-white premium-ring-animation" />
        
        {/* Premium dot indicator */}
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">!</span>
        </div>
      </div>
    </button>
  );
}