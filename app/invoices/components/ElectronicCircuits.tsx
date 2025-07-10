
import { motion } from "framer-motion";
import React from "react";

interface ElectronicCircuitsProps {
  className?: string;
}

export function ElectronicCircuits({ className = "" }: ElectronicCircuitsProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Horizontal Traces */}
        <path d="M100 200H600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 300H800" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 400H500" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 500H700" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 600H900" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 700H600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 800H800" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M100 900H700" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        <path d="M1820 200H1320" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 300H1120" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 400H1420" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 500H1220" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 600H1020" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 700H1320" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 800H1120" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1820 900H1220" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        {/* Vertical Traces */}
        <path d="M200 100V400" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M300 100V600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M400 100V900" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M500 100V700" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M600 100V500" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M700 100V800" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        <path d="M1720 100V400" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1620 100V600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1520 100V900" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1420 100V700" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1320 100V500" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1220 100V800" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        {/* Diagonal Traces */}
        <path d="M500 200L600 300" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M600 300L700 400" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M700 400L800 500" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M800 500L900 600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        <path d="M1420 200L1320 300" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1320 300L1220 400" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1220 400L1120 500" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1120 500L1020 600" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        {/* Connection Points */}
        <circle cx="200" cy="200" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="300" cy="300" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="400" cy="400" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="500" cy="500" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="600" cy="600" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="700" cy="700" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="800" cy="800" r="4" fill="#3B82F6" fillOpacity="0.4" />
        
        <circle cx="1720" cy="200" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1620" cy="300" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1520" cy="400" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1420" cy="500" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1320" cy="600" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1220" cy="700" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="1120" cy="800" r="4" fill="#3B82F6" fillOpacity="0.4" />
        
        {/* Resistors */}
        <g transform="translate(500, 300)">
          <rect x="-15" y="-7.5" width="30" height="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-35" y1="0" x2="-15" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="15" y1="0" x2="35" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        <g transform="translate(1420, 300)">
          <rect x="-15" y="-7.5" width="30" height="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-35" y1="0" x2="-15" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="15" y1="0" x2="35" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        <g transform="translate(700, 600)">
          <rect x="-15" y="-7.5" width="30" height="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-35" y1="0" x2="-15" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="15" y1="0" x2="35" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        <g transform="translate(1220, 600)">
          <rect x="-15" y="-7.5" width="30" height="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-35" y1="0" x2="-15" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="15" y1="0" x2="35" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        {/* Capacitors */}
        <g transform="translate(400, 700)">
          <line x1="-20" y1="0" x2="-5" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="-5" y1="-15" x2="-5" y2="15" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="5" y1="-15" x2="5" y2="15" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="5" y1="0" x2="20" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        <g transform="translate(1520, 700)">
          <line x1="-20" y1="0" x2="-5" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="-5" y1="-15" x2="-5" y2="15" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="5" y1="-15" x2="5" y2="15" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="5" y1="0" x2="20" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        {/* Transistors */}
        <g transform="translate(600, 400)">
          <circle cx="0" cy="0" r="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-15" y1="0" x2="-30" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="0" y1="-15" x2="0" y2="-30" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="10.6" y1="10.6" x2="21.2" y2="21.2" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        <g transform="translate(1320, 400)">
          <circle cx="0" cy="0" r="15" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="-15" y1="0" x2="-30" y2="0" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="0" y1="-15" x2="0" y2="-30" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="10.6" y1="10.6" x2="21.2" y2="21.2" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        </g>
        
        {/* ICs/Chips */}
        <g transform="translate(300, 500)">
          <rect x="-30" y="-20" width="60" height="40" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" rx="2" />
          <line x1="-20" y1="-20" x2="-20" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="-20" x2="-10" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="0" y1="-20" x2="0" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="-20" x2="10" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="20" y1="-20" x2="20" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-20" y1="20" x2="-20" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="20" x2="-10" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="0" y1="20" x2="0" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="20" x2="10" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="20" y1="20" x2="20" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <circle cx="-20" cy="0" r="3" fill="#3B82F6" fillOpacity="0.4" />
        </g>
        
        <g transform="translate(1620, 500)">
          <rect x="-30" y="-20" width="60" height="40" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.3" rx="2" />
          <line x1="-20" y1="-20" x2="-20" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="-20" x2="-10" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="0" y1="-20" x2="0" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="-20" x2="10" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="20" y1="-20" x2="20" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-20" y1="20" x2="-20" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="20" x2="-10" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="0" y1="20" x2="0" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="20" x2="10" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="20" y1="20" x2="20" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <circle cx="-20" cy="0" r="3" fill="#3B82F6" fillOpacity="0.4" />
        </g>
        
        {/* CPU/Complex Chip */}
        <g transform="translate(960, 540)">
          <rect x="-60" y="-60" width="120" height="120" fill="#0F2F55" fillOpacity="0.1" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.3" rx="5" />
          
          {/* Pin connections on all sides */}
          {/* Top */}
          <line x1="-50" y1="-60" x2="-50" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-30" y1="-60" x2="-30" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="-60" x2="-10" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="-60" x2="10" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="30" y1="-60" x2="30" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="50" y1="-60" x2="50" y2="-80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          
          {/* Bottom */}
          <line x1="-50" y1="60" x2="-50" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-30" y1="60" x2="-30" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-10" y1="60" x2="-10" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="60" x2="10" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="30" y1="60" x2="30" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="50" y1="60" x2="50" y2="80" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          
          {/* Left */}
          <line x1="-60" y1="-50" x2="-80" y2="-50" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-60" y1="-30" x2="-80" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-60" y1="-10" x2="-80" y2="-10" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-60" y1="10" x2="-80" y2="10" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-60" y1="30" x2="-80" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-60" y1="50" x2="-80" y2="50" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          
          {/* Right */}
          <line x1="60" y1="-50" x2="80" y2="-50" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="60" y1="-30" x2="80" y2="-30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="60" y1="-10" x2="80" y2="-10" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="60" y1="10" x2="80" y2="10" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="60" y1="30" x2="80" y2="30" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="60" y1="50" x2="80" y2="50" stroke="#0F2F55" strokeWidth="1.5" strokeOpacity="0.25" />
          
          {/* Inner circuit patterns */}
          <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="#0F2F55" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#0F2F55" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="-20" y="-20" width="40" height="40" fill="#0F2F55" fillOpacity="0.05" stroke="#0F2F55" strokeWidth="1" strokeOpacity="0.2" />
          
          <text x="-15" y="5" fill="#3B82F6" fontSize="16" fontFamily="monospace" opacity="0.5">AI</text>
          
          <circle cx="-40" cy="-40" r="3" fill="#3B82F6" fillOpacity="0.4" />
          <circle cx="40" cy="-40" r="3" fill="#3B82F6" fillOpacity="0.4" />
          <circle cx="-40" cy="40" r="3" fill="#3B82F6" fillOpacity="0.4" />
          <circle cx="40" cy="40" r="3" fill="#3B82F6" fillOpacity="0.4" />
        </g>
        
        {/* Connect central CPU to other components */}
        <path d="M880 540H800" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M1040 540H1120" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M960 460V400" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M960 620V700" stroke="#0F2F55" strokeWidth="2" strokeOpacity="0.25" />
        
        {/* Animated Data Flow Points */}
        <motion.circle
          cx="200"
          cy="200"
          r="6"
          fill="#3B82F6"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            r: [4, 6, 4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.circle
          cx="1720"
          cy="200"
          r="6"
          fill="#3B82F6"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            r: [4, 6, 4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="960"
          cy="540"
          r="8"
          fill="#3B82F6"
          animate={{
            opacity: [0.2, 0.7, 0.2],
            r: [6, 10, 6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Animated Data Flow */}
        <motion.circle
          cx="960"
          cy="540"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [960, 900, 850, 800],
            cy: [540, 540, 540, 540],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
        
        <motion.circle
          cx="960"
          cy="540"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [960, 1020, 1070, 1120],
            cy: [540, 540, 540, 540],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="960"
          cy="540"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [960, 960, 960, 960],
            cy: [540, 500, 450, 400],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            delay: 1
          }}
        />
        
        <motion.circle
          cx="960"
          cy="540"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [960, 960, 960, 960],
            cy: [540, 580, 630, 700],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            delay: 1.5
          }}
        />
      </svg>
    </div>
  );
}
