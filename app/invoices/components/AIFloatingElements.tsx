
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AIFloatingElementsProps {
  className?: string;
}

export function AIFloatingElements({ className = "" }: AIFloatingElementsProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating AI Brain Outline - Center Left */}
      <motion.div
        className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[200px] h-[200px] opacity-[0.08] blur-[5px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: [0.05, 0.08, 0.05],
          y: [-5, 5, -5]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Simplified Brain Silhouette */}
          <path
            d="M100 30C70 30 50 50 50 80C50 95 60 105 60 120C60 140 50 150 50 170C50 190 70 200 100 200C130 200 150 190 150 170C150 150 140 140 140 120C140 105 150 95 150 80C150 50 130 30 100 30Z"
            stroke="#0F2F55"
            strokeWidth="2"
            fill="none"
          />
          {/* Neural Connections */}
          <path
            d="M80 60C70 80 70 100 80 120"
            stroke="#0F2F55"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M120 60C130 80 130 100 120 120"
            stroke="#0F2F55"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M60 80C80 90 120 90 140 80"
            stroke="#0F2F55"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M60 120C80 130 120 130 140 120"
            stroke="#0F2F55"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M80 160C90 150 110 150 120 160"
            stroke="#0F2F55"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Neural Nodes */}
          <circle cx="80" cy="60" r="3" fill="#3B82F6" />
          <circle cx="120" cy="60" r="3" fill="#3B82F6" />
          <circle cx="60" cy="80" r="3" fill="#3B82F6" />
          <circle cx="140" cy="80" r="3" fill="#3B82F6" />
          <circle cx="80" cy="120" r="3" fill="#3B82F6" />
          <circle cx="120" cy="120" r="3" fill="#3B82F6" />
          <circle cx="60" cy="120" r="3" fill="#3B82F6" />
          <circle cx="140" cy="120" r="3" fill="#3B82F6" />
          <circle cx="80" cy="160" r="3" fill="#3B82F6" />
          <circle cx="120" cy="160" r="3" fill="#3B82F6" />
          
          {/* Data Pulse Animation */}
          <motion.circle
            cx="80"
            cy="60"
            r="2"
            fill="#0F2F55"
            animate={{
              cx: [80, 60, 80],
              cy: [60, 80, 120],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          <motion.circle
            cx="120"
            cy="60"
            r="2"
            fill="#0F2F55"
            animate={{
              cx: [120, 140, 120],
              cy: [60, 80, 120],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1
            }}
          />
        </svg>
      </motion.div>
      
      {/* Circuit Board Pattern - Top Right */}
      <motion.div
        className="absolute right-[15%] top-[15%] w-[180px] h-[180px] opacity-[0.06] blur-[4px]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.04, 0.06, 0.04],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Circuit Lines */}
          <path d="M20 20H100V60H180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M20 60H80V100H180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M20 100H60V140H180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M20 140H40V180H180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M180 60V180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M140 20V180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M100 60V180" stroke="#0F2F55" strokeWidth="1.5" />
          <path d="M60 100V180" stroke="#0F2F55" strokeWidth="1.5" />
          
          {/* Circuit Nodes */}
          <circle cx="20" cy="20" r="4" fill="#3B82F6" />
          <circle cx="100" cy="20" r="4" fill="#3B82F6" />
          <circle cx="140" cy="20" r="4" fill="#3B82F6" />
          <circle cx="180" cy="60" r="4" fill="#3B82F6" />
          <circle cx="20" cy="60" r="4" fill="#3B82F6" />
          <circle cx="80" cy="60" r="4" fill="#3B82F6" />
          <circle cx="100" cy="60" r="4" fill="#3B82F6" />
          <circle cx="20" cy="100" r="4" fill="#3B82F6" />
          <circle cx="60" cy="100" r="4" fill="#3B82F6" />
          <circle cx="100" cy="100" r="4" fill="#3B82F6" />
          <circle cx="140" cy="100" r="4" fill="#3B82F6" />
          <circle cx="180" cy="100" r="4" fill="#3B82F6" />
          <circle cx="20" cy="140" r="4" fill="#3B82F6" />
          <circle cx="40" cy="140" r="4" fill="#3B82F6" />
          <circle cx="60" cy="140" r="4" fill="#3B82F6" />
          <circle cx="100" cy="140" r="4" fill="#3B82F6" />
          <circle cx="140" cy="140" r="4" fill="#3B82F6" />
          <circle cx="180" cy="140" r="4" fill="#3B82F6" />
          <circle cx="40" cy="180" r="4" fill="#3B82F6" />
          <circle cx="60" cy="180" r="4" fill="#3B82F6" />
          <circle cx="100" cy="180" r="4" fill="#3B82F6" />
          <circle cx="140" cy="180" r="4" fill="#3B82F6" />
          <circle cx="180" cy="180" r="4" fill="#3B82F6" />
          
          {/* Circuit Data Flow */}
          <motion.circle
            cx="20"
            cy="20"
            r="2"
            fill="#0F2F55"
            animate={{
              cx: [20, 100],
              cy: [20, 20],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4
            }}
          />
          <motion.circle
            cx="100"
            cy="20"
            r="2"
            fill="#0F2F55"
            animate={{
              cx: [100, 100],
              cy: [20, 180],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 2
            }}
          />
        </svg>
      </motion.div>
      
      {/* AI Chip Design - Bottom Right */}
      <motion.div
        className="absolute right-[10%] bottom-[15%] w-[150px] h-[150px] opacity-[0.07] blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.05, 0.07, 0.05],
          scale: [0.98, 1, 0.98]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <svg
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* CPU/AI Chip Outline */}
          <rect x="30" y="30" width="90" height="90" rx="4" stroke="#0F2F55" strokeWidth="2" fill="none" />
          
          {/* Chip Inner Details */}
          <rect x="45" y="45" width="60" height="60" rx="2" stroke="#0F2F55" strokeWidth="1" fill="none" />
          <rect x="55" y="55" width="40" height="40" rx="1" stroke="#3B82F6" strokeWidth="1" fill="none" />
          
          {/* Connection Pins */}
          <line x1="30" y1="40" x2="15" y2="40" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="50" x2="15" y2="50" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="60" x2="15" y2="60" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="70" x2="15" y2="70" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="80" x2="15" y2="80" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="90" x2="15" y2="90" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="100" x2="15" y2="100" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="30" y1="110" x2="15" y2="110" stroke="#0F2F55" strokeWidth="1.5" />
          
          <line x1="120" y1="40" x2="135" y2="40" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="50" x2="135" y2="50" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="60" x2="135" y2="60" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="70" x2="135" y2="70" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="80" x2="135" y2="80" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="90" x2="135" y2="90" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="100" x2="135" y2="100" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="120" y1="110" x2="135" y2="110" stroke="#0F2F55" strokeWidth="1.5" />
          
          <line x1="40" y1="30" x2="40" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="50" y1="30" x2="50" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="60" y1="30" x2="60" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="70" y1="30" x2="70" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="80" y1="30" x2="80" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="90" y1="30" x2="90" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="100" y1="30" x2="100" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="110" y1="30" x2="110" y2="15" stroke="#0F2F55" strokeWidth="1.5" />
          
          <line x1="40" y1="120" x2="40" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="50" y1="120" x2="50" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="60" y1="120" x2="60" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="70" y1="120" x2="70" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="80" y1="120" x2="80" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="90" y1="120" x2="90" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="100" y1="120" x2="100" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          <line x1="110" y1="120" x2="110" y2="135" stroke="#0F2F55" strokeWidth="1.5" />
          
          {/* CPU Core */}
          <text x="65" y="80" fontFamily="monospace" fontSize="8" fill="#3B82F6">AI</text>
          
          {/* Data Flow Animation */}
          <motion.circle
            cx="15"
            cy="60"
            r="2"
            fill="#3B82F6"
            animate={{
              cx: [15, 30, 75, 120, 135],
              cy: [60, 60, 75, 90, 90],
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          <motion.circle
            cx="70"
            cy="15"
            r="2"
            fill="#3B82F6"
            animate={{
              cx: [70, 70, 75],
              cy: [15, 30, 75],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1
            }}
          />
        </svg>
      </motion.div>
      
      {/* Binary Data Streams */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            className="absolute h-px w-full opacity-[0.04]"
            style={{
              top: `${20 + i * 30}%`,
              left: 0,
              background: 'linear-gradient(90deg, transparent, #3B82F6 10%, #3B82F6 90%, transparent)',
              height: '1px'
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 0.04, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatDelay: i * 3,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Vertical Data Streams */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`vstream-${i}`}
            className="absolute w-px h-full opacity-[0.03]"
            style={{
              left: `${30 + i * 40}%`,
              top: 0,
              background: 'linear-gradient(180deg, transparent, #0F2F55 10%, #0F2F55 90%, transparent)',
              width: '1px'
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: [0, 1, 0],
              opacity: [0, 0.03, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatDelay: i * 4 + 2,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Animated Binary Digits */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 10 + 6;
          return (
            <motion.div
              key={`binary-${i}`}
              className="absolute font-mono opacity-0"
              style={{
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                fontSize: size,
                color: Math.random() > 0.5 ? '#0F2F55' : '#3B82F6',
                opacity: 0
              }}
              animate={{
                opacity: [0, 0.1, 0],
                y: [0, -30]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 10,
                ease: "easeInOut"
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
