import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
  const containerClasses = fullPage
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full min-h-[300px]";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-transparent border-t-black border-r-gray-200"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Inner Ring */}
        <motion.div
          className="absolute w-10 h-10 rounded-full border-2 border-transparent border-b-black border-l-gray-100"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Center Logo Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-black" />
      </div>
      
      {/* Brand Label */}
      <motion.p
        className="mt-6 font-display text-xs tracking-[0.25em] text-black font-extrabold uppercase"
        initial={{ opacity: 0, letterSpacing: "0.1em" }}
        animate={{ opacity: [0.4, 1, 0.4], letterSpacing: "0.25em" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ElectroNova
      </motion.p>
    </div>
  );
};

export default Loader;
