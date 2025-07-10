
import React from "react";
import { motion } from "framer-motion";

interface CircuitBrainGraphicProps {
  className?: string;
  color?: string;
}

export function CircuitBrainGraphic({ 
  className = "", 
  color = "#3B82F6" 
}: CircuitBrainGraphicProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Brain Circuit Outline */}
        <g>
          {/* Left Hemisphere */}
          <path
            d="M400 60C350 60 310 80 280 110C250 140 230 180 220 220C210 260 200 300 180 330C160 360 130 380 120 420C110 460 120 500 140 530C160 560 190 570 230 580C270 590 310 580 340 560C370 540 390 510 400 480"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          {/* Right Hemisphere */}
          <path
            d="M400 60C450 60 490 80 520 110C550 140 570 180 580 220C590 260 600 300 620 330C640 360 670 380 680 420C690 460 680 500 660 530C640 560 610 570 570 580C530 590 490 580 460 560C430 540 410 510 400 480"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          {/* Bottom Connections */}
          <path
            d="M230 580C260 600 290 610 320 520"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          <path
            d="M570 580C540 600 510 610 480 520"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          <path
            d="M320 520C340 540 360 540 380 520"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          <path
            d="M480 520C460 540 440 540 420 520"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
          
          <path
            d="M380 520C390 530 410 530 420 520"
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
        </g>
        
        {/* Circuit Connections - Left Hemisphere */}
        <g>
          {/* Upper Left Quadrant */}
          <path
            d="M220 220C200 200 180 190 160 200C140 210 130 230 140 250C150 270 170 280 190 270"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M280 110C260 90 240 80 220 90C200 100 190 120 200 140C210 160 230 170 250 160"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M280 110C300 130 310 150 300 170C290 190 270 200 250 190"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M250 190C230 180 210 180 200 200C190 220 200 240 220 250"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          {/* Lower Left Quadrant */}
          <path
            d="M180 330C160 350 150 370 160 390C170 410 190 420 210 410"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M120 420C100 440 90 460 100 480C110 500 130 510 150 500"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M140 530C160 550 180 560 200 550C220 540 230 520 220 500"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M190 270C210 290 220 310 210 330"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M210 410C230 430 240 450 230 470C220 490 200 500 180 490"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M150 500C170 520 190 530 210 520C230 510 240 490 230 470"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </g>
        
        {/* Circuit Connections - Right Hemisphere */}
        <g>
          {/* Upper Right Quadrant */}
          <path
            d="M580 220C600 200 620 190 640 200C660 210 670 230 660 250C650 270 630 280 610 270"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M520 110C540 90 560 80 580 90C600 100 610 120 600 140C590 160 570 170 550 160"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M520 110C500 130 490 150 500 170C510 190 530 200 550 190"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M550 190C570 180 590 180 600 200C610 220 600 240 580 250"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          {/* Lower Right Quadrant */}
          <path
            d="M620 330C640 350 650 370 640 390C630 410 610 420 590 410"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M680 420C700 440 710 460 700 480C690 500 670 510 650 500"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M660 530C640 550 620 560 600 550C580 540 570 520 580 500"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M610 270C590 290 580 310 590 330"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M590 410C570 430 560 450 570 470C580 490 600 500 620 490"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M650 500C630 520 610 530 590 520C570 510 560 490 570 470"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </g>
        
        {/* Additional Circuit Paths */}
        <g>
          <path
            d="M280 110C300 90 320 80 340 90C360 100 370 120 360 140"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M520 110C500 90 480 80 460 90C440 100 430 120 440 140"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M360 140C350 160 330 170 310 160"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M440 140C450 160 470 170 490 160"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M220 220C240 200 260 190 280 200C300 210 310 230 300 250"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M580 220C560 200 540 190 520 200C500 210 490 230 500 250"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M300 250C290 270 270 280 250 270"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M500 250C510 270 530 280 550 270"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </g>
        
        {/* Center Processor/Chip */}
        <g>
          <rect
            x="370"
            y="310"
            width="60"
            height="60"
            stroke={color}
            strokeWidth="3"
            fill={`${color}33`} // 20% opacity
          />
          
          <rect
            x="380"
            y="320"
            width="40"
            height="40"
            fill={`${color}66`} // 40% opacity
          />
          
          {/* Connection pins */}
          <line x1="370" y1="330" x2="350" y2="330" stroke={color} strokeWidth="2" />
          <line x1="370" y1="350" x2="350" y2="350" stroke={color} strokeWidth="2" />
          
          <line x1="430" y1="330" x2="450" y2="330" stroke={color} strokeWidth="2" />
          <line x1="430" y1="350" x2="450" y2="350" stroke={color} strokeWidth="2" />
          
          <line x1="390" y1="310" x2="390" y2="290" stroke={color} strokeWidth="2" />
          <line x1="410" y1="310" x2="410" y2="290" stroke={color} strokeWidth="2" />
          
          <line x1="390" y1="370" x2="390" y2="390" stroke={color} strokeWidth="2" />
          <line x1="410" y1="370" x2="410" y2="390" stroke={color} strokeWidth="2" />
        </g>
        
        {/* Connection Points */}
        <g>
          {/* Left Hemisphere Connection Points */}
          <circle cx="280" cy="110" r="5" fill={color} />
          <circle cx="220" cy="220" r="5" fill={color} />
          <circle cx="180" cy="330" r="5" fill={color} />
          <circle cx="120" cy="420" r="5" fill={color} />
          <circle cx="140" cy="530" r="5" fill={color} />
          <circle cx="230" cy="580" r="5" fill={color} />
          <circle cx="320" cy="520" r="5" fill={color} />
          <circle cx="380" cy="520" r="5" fill={color} />
          
          <circle cx="160" cy="200" r="5" fill={color} />
          <circle cx="220" cy="90" r="5" fill={color} />
          <circle cx="250" cy="190" r="5" fill={color} />
          <circle cx="190" cy="270" r="5" fill={color} />
          <circle cx="210" cy="410" r="5" fill={color} />
          <circle cx="150" cy="500" r="5" fill={color} />
          <circle cx="180" cy="490" r="5" fill={color} />
          <circle cx="210" cy="330" r="5" fill={color} />
          <circle cx="230" cy="470" r="5" fill={color} />
          
          <circle cx="310" cy="160" r="5" fill={color} />
          <circle cx="360" cy="140" r="5" fill={color} />
          <circle cx="340" cy="90" r="5" fill={color} />
          <circle cx="300" cy="250" r="5" fill={color} />
          <circle cx="280" cy="200" r="5" fill={color} />
          <circle cx="250" cy="270" r="5" fill={color} />
          
          {/* Right Hemisphere Connection Points */}
          <circle cx="520" cy="110" r="5" fill={color} />
          <circle cx="580" cy="220" r="5" fill={color} />
          <circle cx="620" cy="330" r="5" fill={color} />
          <circle cx="680" cy="420" r="5" fill={color} />
          <circle cx="660" cy="530" r="5" fill={color} />
          <circle cx="570" cy="580" r="5" fill={color} />
          <circle cx="480" cy="520" r="5" fill={color} />
          <circle cx="420" cy="520" r="5" fill={color} />
          
          <circle cx="640" cy="200" r="5" fill={color} />
          <circle cx="580" cy="90" r="5" fill={color} />
          <circle cx="550" cy="190" r="5" fill={color} />
          <circle cx="610" cy="270" r="5" fill={color} />
          <circle cx="590" cy="410" r="5" fill={color} />
          <circle cx="650" cy="500" r="5" fill={color} />
          <circle cx="620" cy="490" r="5" fill={color} />
          <circle cx="590" cy="330" r="5" fill={color} />
          <circle cx="570" cy="470" r="5" fill={color} />
          
          <circle cx="490" cy="160" r="5" fill={color} />
          <circle cx="440" cy="140" r="5" fill={color} />
          <circle cx="460" cy="90" r="5" fill={color} />
          <circle cx="500" cy="250" r="5" fill={color} />
          <circle cx="520" cy="200" r="5" fill={color} />
          <circle cx="550" cy="270" r="5" fill={color} />
        </g>
        
        {/* Animated Data Flow Points */}
        <motion.circle
          cx="280"
          cy="110"
          r="6"
          fill="white"
          animate={{
            opacity: [0, 0.7, 0],
            r: [3, 7, 3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 0
          }}
        />
        
        <motion.circle
          cx="520"
          cy="110"
          r="6"
          fill="white"
          animate={{
            opacity: [0, 0.7, 0],
            r: [3, 7, 3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="140"
          cy="530"
          r="6"
          fill="white"
          animate={{
            opacity: [0, 0.7, 0],
            r: [3, 7, 3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 1
          }}
        />
        
        <motion.circle
          cx="660"
          cy="530"
          r="6"
          fill="white"
          animate={{
            opacity: [0, 0.7, 0],
            r: [3, 7, 3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 1.5
          }}
        />
        
        <motion.circle
          cx="400"
          cy="340"
          r="8"
          fill="white"
          animate={{
            opacity: [0, 0.8, 0],
            r: [4, 10, 4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
        
        {/* Data Flow Animations */}
        <motion.circle
          cx="280"
          cy="110"
          r="3"
          fill="white"
          animate={{
            cx: [280, 250, 220, 190, 160],
            cy: [110, 150, 190, 230, 200],
            opacity: [0, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4
          }}
        />
        
        <motion.circle
          cx="520"
          cy="110"
          r="3"
          fill="white"
          animate={{
            cx: [520, 550, 580, 610, 640],
            cy: [110, 150, 190, 230, 200],
            opacity: [0, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 0.5
          }}
        />
        
        <motion.circle
          cx="140"
          cy="530"
          r="3"
          fill="white"
          animate={{
            cx: [140, 170, 200, 230, 260, 290, 320, 350],
            cy: [530, 520, 510, 500, 490, 480, 470, 380],
            opacity: [0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
        
        <motion.circle
          cx="660"
          cy="530"
          r="3"
          fill="white"
          animate={{
            cx: [660, 630, 600, 570, 540, 510, 480, 450],
            cy: [530, 520, 510, 500, 490, 480, 470, 380],
            opacity: [0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 1.5
          }}
        />
      </svg>
    </div>
  );
}
