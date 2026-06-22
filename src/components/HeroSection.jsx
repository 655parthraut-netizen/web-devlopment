import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 lg:py-24">
        <div className="space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Premium electronics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-gray-900 leading-[1.15]"
          >
            Gear up with the best electronics
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg"
          >
            Mice, keyboards, monitors, and more — curated for performance, comfort, and clean design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <button onClick={() => navigate('/products')} className="btn-primary rounded-lg">
              Shop now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('/product/p2')} className="btn-secondary rounded-lg">
              View keyboards
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"
              alt="Wireless mouse"
              className="rounded-2xl object-cover aspect-square shadow-sm border border-gray-100"
            />
            <img
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop"
              alt="Mechanical keyboard"
              className="rounded-2xl object-cover aspect-square shadow-sm border border-gray-100 mt-8"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
