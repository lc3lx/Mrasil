
import React from "react";
import { motion } from "framer-motion";

interface CircuitBrainSvgProps {
  className?: string;
}

export function CircuitBrainSvg({ className = "" }: CircuitBrainSvgProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <motion.svg
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Robot Head - Outer Frame */}
        <motion.path
          d="M600 400C600 300 560 220 500 180C440 140 360 120 300 120C240 120 160 140 100 180C40 220 0 300 0 400V550C0 630 80 680 200 680H400C520 680 600 630 600 550V400Z"
          fill="#0F2F55"
          fillOpacity="0.03"
          stroke="#0F2F55"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Inner White Border */}
        <motion.path
          d="M550 400C550 310 520 240 470 210C420 180 360 160 300 160C240 160 180 180 130 210C80 240 50 310 50 400V540C50 600 100 630 200 630H400C500 630 550 600 550 540V400Z"
          fill="none"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Inner Face */}
        <motion.path
          d="M500 400C500 330 480 270 440 240C400 210 350 190 300 190C250 190 200 210 160 240C120 270 100 330 100 400V520C100 560 130 580 200 580H400C470 580 500 560 500 520V400Z"
          fill="#0F2F55"
          fillOpacity="0.02"
          stroke="#0F2F55"
          strokeWidth="2"
          strokeOpacity="0.15"
        />
        
        {/* Left Ear/Headphone */}
        <motion.path
          d="M0 400C0 370 20 350 50 350V450C20 450 0 430 0 400Z"
          fill="#0F2F55"
          fillOpacity="0.06"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        {/* Right Ear/Headphone */}
        <motion.path
          d="M600 400C600 370 580 350 550 350V450C580 450 600 430 600 400Z"
          fill="#0F2F55"
          fillOpacity="0.06"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        {/* Antenna */}
        <motion.rect
          x="280"
          y="80"
          width="40"
          height="60"
          fill="#0F2F55"
          fillOpacity="0.1"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        <motion.circle
          cx="300"
          cy="50"
          r="30"
          fill="#0F2F55"
          fillOpacity="0.1"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        {/* Left Eye */}
        <motion.ellipse
          cx="200"
          cy="350"
          rx="50"
          ry="60"
          fill="#0F2F55"
          fillOpacity="0.05"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        {/* Right Eye */}
        <motion.ellipse
          cx="400"
          cy="350"
          rx="50"
          ry="60"
          fill="#0F2F55"
          fillOpacity="0.05"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeOpacity="0.3"
        />
        
        {/* Smile */}
        <motion.path
          d="M200 450C240 500 360 500 400 450"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
        
        {/* Microphone/Mouth Piece */}
        <motion.rect
          x="275"
          y="550"
          width="50"
          height="30"
          rx="10"
          fill="#0F2F55"
          fillOpacity="0.05"
          stroke="#0F2F55"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        
        {/* Circuit Patterns - Horizontal Lines */}
        <path d="M100 250H200" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M100 300H180" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M100 350H160" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M100 400H170" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M100 450H150" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M100 500H180" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        <path d="M500 250H400" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M500 300H420" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M500 350H440" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M500 400H430" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M500 450H450" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M500 500H420" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        {/* Circuit Patterns - Vertical and Angular Lines */}
        <path d="M150 250V300" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M180 300V350" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M160 350V400" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M170 400V450" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M150 450V500" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        <path d="M450 250V300" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M420 300V350" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M440 350V400" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M430 400V450" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M450 450V500" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        {/* Diagonal Connections */}
        <path d="M150 250L180 300" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M180 300L160 350" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M160 350L170 400" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M170 400L150 450" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        <path d="M450 250L420 300" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M420 300L440 350" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M440 350L430 400" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        <path d="M430 400L450 450" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.3" />
        
        {/* Connection Points / Nodes */}
        <circle cx="150" cy="250" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="180" cy="300" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="160" cy="350" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="170" cy="400" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="150" cy="450" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="180" cy="500" r="4" fill="#3B82F6" fillOpacity="0.4" />
        
        <circle cx="450" cy="250" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="420" cy="300" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="440" cy="350" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="430" cy="400" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="450" cy="450" r="4" fill="#3B82F6" fillOpacity="0.4" />
        <circle cx="420" cy="500" r="4" fill="#3B82F6" fillOpacity="0.4" />
        
        {/* AI Text */}
        <g opacity="0.5">
          {/* "A" Letter */}
          <path
            d="M220 270L280 380H160L220 270Z"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.5"
          />
          <line
            x1="190"
            y1="340"
            x2="250"
            y2="340"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          
          {/* "I" Letter */}
          <line
            x1="380"
            y1="270"
            x2="380"
            y2="380"
            stroke="#3B82F6"
            strokeWidth="12"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <line
            x1="350"
            y1="270"
            x2="410"
            y2="270"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <line
            x1="350"
            y1="380"
            x2="410"
            y2="380"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        </g>
        
        {/* Glowing Points */}
        <motion.circle
          cx="300"
          cy="50"
          r="15"
          fill="url(#glow1)"
          animate={{
            opacity: [0.4, 1, 0.4],
            r: [10, 20, 10]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.circle
          cx="200"
          cy="350"
          r="15"
          fill="url(#glow1)"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            r: [10, 15, 10]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="400"
          cy="350"
          r="15"
          fill="url(#glow1)"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            r: [10, 15, 10]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        {/* Data Flow Animation */}
        <motion.circle
          cx="300"
          cy="50"
          r="5"
          fill="#FFFFFF"
          animate={{
            y: [0, 40, 80],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        
        <motion.circle
          cx="150"
          cy="250"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [150, 180, 160, 170, 150, 180],
            cy: [250, 300, 350, 400, 450, 500],
            opacity: [0, 0.8, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
        
        <motion.circle
          cx="450"
          cy="250"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [450, 420, 440, 430, 450, 420],
            cy: [250, 300, 350, 400, 450, 500],
            opacity: [0, 0.8, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 1,
            delay: 2
          }}
        />
        
        {/* Horizontal Data Flow */}
        <motion.circle
          cx="180"
          cy="300"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [180, 300, 420],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
        
        <motion.circle
          cx="160"
          cy="350"
          r="3"
          fill="#FFFFFF"
          animate={{
            cx: [160, 300, 440],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            delay: 1
          }}
        />
        
        {/* Binary Data */}
        <text x="120" y="240" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">10101</text>
        <text x="120" y="290" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">01001</text>
        <text x="120" y="340" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">11010</text>
        <text x="120" y="390" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">00110</text>
        <text x="120" y="440" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">10001</text>
        
        <text x="460" y="240" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">10101</text>
        <text x="460" y="290" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">01001</text>
        <text x="460" y="340" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">11010</text>
        <text x="460" y="390" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">00110</text>
        <text x="460" y="440" fill="#0F2F55" fontSize="8" opacity="0.5" fontFamily="monospace">10001</text>
        
        {/* Gradients for Glows */}
        <defs>
          <radialGradient id="glow1" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
