import React from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const Loading = ({ size = 'medium', fullScreen = false }) => {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48
  };

  const dotSize = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`loading-container ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <motion.div
        className="loading-dots"
        style={{ gap: dotSize / 4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="loading-dot"
            style={{ width: dotSize / 3, height: dotSize / 3 }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;
