import { Crown, Heart, Zap, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../App';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  userProgress: UserProgress;
}

export default function PremiumModal({ isOpen, onClose, onPurchase, userProgress }: PremiumModalProps) {
  if (userProgress.isPremium) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 1000 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Crown Icon */}
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-purple-600 mb-2 text-center">Upgrade to Premium!</h3>
            <p className="text-gray-600 mb-6 text-center">Unlock unlimited learning and exclusive features</p>

            {/* Premium Features */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700">Unlimited Hearts - Never stop learning!</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700">2x Learning Speed Boost</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700">Ad-Free Experience</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700">Premium Badge & Avatar</p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-6">
              <p className="text-center text-sm text-gray-500 mb-3">Choose your plan</p>
              
              {/* Plans */}
              <div className="space-y-3">
                {/* 1 Month */}
                <button
                  onClick={onPurchase}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">1 Month Premium</p>
                      <p className="text-sm opacity-90">Full access for 30 days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$9.99</p>
                    </div>
                  </div>
                </button>

                {/* 3 Months - Popular */}
                <button
                  onClick={onPurchase}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white p-4 rounded-xl hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-2 right-2 bg-white text-orange-600 text-xs px-2 py-1 rounded-full font-bold">
                    POPULAR
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">3 Months Premium</p>
                      <p className="text-sm opacity-90">Save 25%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$22.49</p>
                      <p className="text-xs opacity-75 line-through">$29.97</p>
                    </div>
                  </div>
                </button>

                {/* 1 Year - Best Value */}
                <button
                  onClick={onPurchase}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-xl hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-2 right-2 bg-white text-purple-600 text-xs px-2 py-1 rounded-full font-bold">
                    BEST VALUE
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">1 Year Premium</p>
                      <p className="text-sm opacity-90">Save 50%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$59.99</p>
                      <p className="text-xs opacity-75 line-through">$119.88</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center">
              Demo version - No actual payment required
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
