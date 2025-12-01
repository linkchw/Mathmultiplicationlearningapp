import { motion } from 'motion/react';
import { Delete } from 'lucide-react';

interface KeyboardProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function Keyboard({ onNumberClick, onDelete, onSubmit, disabled = false }: KeyboardProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl mb-24 relative z-50 pointer-events-auto touch-auto">
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {numbers.slice(0, 9).map((num) => (
          <motion.button
            key={num}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onNumberClick(num)}
            disabled={false}
            className="bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-600 text-3xl h-16 rounded-2xl transition-all shadow-sm cursor-pointer pointer-events-auto"
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Bottom Row: 0, Delete, Submit */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onNumberClick('0')}
          disabled={false}
          className="bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-600 text-3xl h-16 rounded-2xl transition-all shadow-sm cursor-pointer pointer-events-auto"
        >
          0
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          disabled={false}
          className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 h-16 rounded-2xl transition-all flex items-center justify-center shadow-sm cursor-pointer pointer-events-auto"
        >
          <Delete className="w-8 h-8" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={disabled}
          className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white h-16 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer pointer-events-auto"
        >
          ✓
        </motion.button>
      </div>
    </div>
  );
}
