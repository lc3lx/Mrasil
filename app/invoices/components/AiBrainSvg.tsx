
import React from "react";
import { motion } from "framer-motion";

interface AiBrainSvgProps {
  className?: string;
}

export function AiBrainSvg({ className = "" }: AiBrainSvgProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <motion.svg
        viewBox="0 0 1000 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {/* Brain Outer Shape */}
        <path
          d="M500 150C380 150 300 190 260 270C220 350 210 410 230 470C250 530 280 580 270 640C260 700 240 760 260 800C280 840 360 850 420 840C480 830 520 790 540 730C560 670 560 620 580 560C600 500 620 450 600 390C580 330 550 290 530 240C510 190 490 150 500 150Z"
          fill="#0F2F55"
          fillOpacity="0.04"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M500 150C620 150 700 190 740 270C780 350 790 410 770 470C750 530 720 580 730 640C740 700 760 760 740 800C720 840 640 850 580 840C520 830 480 790 460 730C440 670 440 620 420 560C400 500 380 450 400 390C420 330 450 290 470 240C490 190 510 150 500 150Z"
          fill="#0F2F55"
          fillOpacity="0.04"
          stroke="#0F2F55"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Neural Connections */}
        <g opacity="0.7">
          {/* Left Hemisphere Connections */}
          <path
            d="M340 280C320 320 310 360 320 400C330 440 350 470 340 510C330 550 310 580 320 620C330 660 360 690 400 700"
            stroke="#0F2F55"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
          
          <path
            d="M370 230C350 270 340 320 360 370C380 420 410 450 390 500C370 550 340 590 350 640C360 690 400 730 450 730"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0 0"
          />
          
          {/* Right Hemisphere Connections */}
          <path
            d="M660 280C680 320 690 360 680 400C670 440 650 470 660 510C670 550 690 580 680 620C670 660 640 690 600 700"
            stroke="#0F2F55"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
          
          <path
            d="M630 230C650 270 660 320 640 370C620 420 590 450 610 500C630 550 660 590 650 640C640 690 600 730 550 730"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0 0"
          />
        </g>
        
        {/* Connecting Bridges Between Hemispheres */}
        <path
          d="M380 250C420 240 480 240 500 250C520 260 580 260 620 250"
          stroke="#0F2F55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        <path
          d="M360 350C400 340 470 340 500 350C530 360 600 360 640 350"
          stroke="#0F2F55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        <path
          d="M340 450C390 440 460 440 500 450C540 460 610 460 660 450"
          stroke="#0F2F55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        <path
          d="M330 550C380 540 460 540 500 550C540 560 620 560 670 550"
          stroke="#0F2F55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        <path
          d="M340 650C390 640 460 640 500 650C540 660 610 660 660 650"
          stroke="#0F2F55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Neural Nodes */}
        <g>
          <circle cx="340" cy="280" r="8" fill="#3B82F6" />
          <circle cx="320" cy="400" r="8" fill="#3B82F6" />
          <circle cx="340" cy="510" r="8" fill="#3B82F6" />
          <circle cx="320" cy="620" r="8" fill="#3B82F6" />
          <circle cx="400" cy="700" r="8" fill="#3B82F6" />
          
          <circle cx="660" cy="280" r="8" fill="#3B82F6" />
          <circle cx="680" cy="400" r="8" fill="#3B82F6" />
          <circle cx="660" cy="510" r="8" fill="#3B82F6" />
          <circle cx="680" cy="620" r="8" fill="#3B82F6" />
          <circle cx="600" cy="700" r="8" fill="#3B82F6" />
          
          {/* Nodes at connection points */}
          <circle cx="500" cy="250" r="6" fill="#3B82F6" />
          <circle cx="500" cy="350" r="6" fill="#3B82F6" />
          <circle cx="500" cy="450" r="6" fill="#3B82F6" />
          <circle cx="500" cy="550" r="6" fill="#3B82F6" />
          <circle cx="500" cy="650" r="6" fill="#3B82F6" />
        </g>
        
        {/* Animated Neural Pulse Effects */}
        <motion.circle
          cx="340"
          cy="280"
          r="12"
          fill="#3B82F6"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            r: [8, 16, 8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5
          }}
        />
        
        <motion.circle
          cx="660"
          cy="280"
          r="12"
          fill="#3B82F6"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            r: [8, 16, 8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            delay: 1.5
          }}
        />
        
        {/* Data Flow Animation */}
        <motion.circle
          cx="340"
          cy="280"
          r="4"
          fill="#0F2F55"
          animate={{
            cx: [340, 320, 340, 320, 400],
            cy: [280, 400, 510, 620, 700],
            opacity: [0, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        
        <motion.circle
          cx="660"
          cy="280"
          r="4"
          fill="#0F2F55"
          animate={{
            cx: [660, 680, 660, 680, 600],
            cy: [280, 400, 510, 620, 700],
            opacity: [0, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 1.5
          }}
        />
        
        {/* "AI" Text in the center of the brain */}
        <g>
          {/* "A" Letter */}
          <path
            d="M420 380L500 280L580 380H540L500 320L460 380H420Z"
            fill="#3B82F6"
            fillOpacity="0.2"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="460"
            y1="340"
            x2="540"
            y2="340"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* "I" Letter */}
          <line
            x1="500"
            y1="420"
            x2="500"
            y2="520"
            stroke="#0F2F55"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <line
            x1="460"
            y1="420"
            x2="540"
            y2="420"
            stroke="#0F2F55"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="460"
            y1="520"
            x2="540"
            y2="520"
            stroke="#0F2F55"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
        
        {/* Circuit Elements */}
        <g opacity="0.6">
          {/* Left Circuit Connections */}
          <path
            d="M260 280L310 280"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M240 350L300 350"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M230 420L290 420"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M230 490L290 490"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M240 560L300 560"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M260 630L310 630"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Right Circuit Connections */}
          <path
            d="M740 280L690 280"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M760 350L700 350"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M770 420L710 420"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M770 490L710 490"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M760 560L700 560"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M740 630L690 630"
            stroke="#0F2F55"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        
        {/* Binary Data Elements */}
        <g opacity="0.4" style={{ fontFamily: "monospace" }}>
          <text x="270" y="260" fill="#0F2F55" fontSize="12">10101</text>
          <text x="250" y="330" fill="#0F2F55" fontSize="12">01001</text>
          <text x="240" y="400" fill="#0F2F55" fontSize="12">11010</text>
          <text x="240" y="470" fill="#0F2F55" fontSize="12">00110</text>
          <text x="250" y="540" fill="#0F2F55" fontSize="12">10001</text>
          <text x="270" y="610" fill="#0F2F55" fontSize="12">01101</text>
          
          <text x="690" y="260" fill="#0F2F55" fontSize="12">10101</text>
          <text x="710" y="330" fill="#0F2F55" fontSize="12">01001</text>
          <text x="720" y="400" fill="#0F2F55" fontSize="12">11010</text>
          <text x="720" y="470" fill="#0F2F55" fontSize="12">00110</text>
          <text x="710" y="540" fill="#0F2F55" fontSize="12">10001</text>
          <text x="690" y="610" fill="#0F2F55" fontSize="12">01101</text>
        </g>
        
        {/* Animated Pulse Glow around "AI" */}
        <motion.circle
          cx="500"
          cy="400"
          r="180"
          fill="url(#ai-glow)"
          opacity="0.15"
          animate={{
            opacity: [0.1, 0.2, 0.1],
            r: [180, 190, 180]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Gradient Definitions */}
        <defs>
          <radialGradient id="ai-glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
