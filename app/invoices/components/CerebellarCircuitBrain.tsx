import React from "react";
import { motion } from "framer-motion";

interface CerebellarCircuitBrainProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function CerebellarCircuitBrain({
  className = "",
  primaryColor = "var(--marasil-primary)",
  secondaryColor = "var(--marasil-secondary)",
  accentColor = "var(--marasil-accent)"
}: CerebellarCircuitBrainProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox="0 0 1000 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Cerebellum Main Structure */}
        <g opacity="0.8">
          {/* Cerebrum - Upper Brain */}
          <path
            d="M500 100C380 100 280 150 200 220C170 240 150 270 140 300C130 330 120 370 120 400C120 450 150 500 200 530C250 560 330 570 400 560C440 555 480 540 500 520"
            stroke={primaryColor}
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M500 100C620 100 720 150 800 220C830 240 850 270 860 300C870 330 880 370 880 400C880 450 850 500 800 530C750 560 670 570 600 560C560 555 520 540 500 520"
            stroke={primaryColor}
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          
          {/* Cerebellum - Lower Brain */}
          <path
            d="M350 560C300 580 260 610 240 650C220 690 220 740 240 780C260 820 300 850 350 860C400 870 460 860 500 830"
            stroke={primaryColor}
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M650 560C700 580 740 610 760 650C780 690 780 740 760 780C740 820 700 850 650 860C600 870 540 860 500 830"
            stroke={primaryColor}
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          
          {/* Brain Stem */}
          <path
            d="M500 520V830"
            stroke={primaryColor}
            strokeWidth="3"
            strokeOpacity="0.4"
            fill="none"
          />
          
          {/* Cerebellar Foldings - Left */}
          <path
            d="M240 650C230 660 220 670 215 685C210 700 210 715 215 730C220 745 230 755 240 760"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M240 760C230 770 225 780 223 795C221 810 223 825 230 835C237 845 247 850 260 850"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M350 860C330 865 315 865 305 855C295 845 290 830 295 815C300 800 310 790 325 785"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          
          {/* Cerebellar Foldings - Right */}
          <path
            d="M760 650C770 660 780 670 785 685C790 700 790 715 785 730C780 745 770 755 760 760"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M760 760C770 770 775 780 777 795C779 810 777 825 770 835C763 845 753 850 740 850"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M650 860C670 865 685 865 695 855C705 845 710 830 705 815C700 800 690 790 675 785"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
        </g>
        
        {/* Circuit Board Patterns - Throughout Brain */}
        <g opacity="0.7">
          {/* Left Hemisphere Circuits */}
          {/* Horizontal Circuits */}
          <path d="M150 250H300" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M200 300H350" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M250 350H400" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M200 400H350" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M150 450H300" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Cerebellum Left Circuits */}
          <path d="M250 650H350" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M270 700H370" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M290 750H390" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M310 800H410" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Vertical Circuits */}
          <path d="M200 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M250 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M300 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M350 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Cerebellum Vertical */}
          <path d="M300 650V800" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M350 650V800" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Right Hemisphere Circuits */}
          {/* Horizontal Circuits */}
          <path d="M850 250H700" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M800 300H650" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M750 350H600" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M800 400H650" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M850 450H700" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Cerebellum Right Circuits */}
          <path d="M750 650H650" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M730 700H630" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M710 750H610" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M690 800H590" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Vertical Circuits */}
          <path d="M800 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M750 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M700 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M650 250V450" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Cerebellum Vertical */}
          <path d="M700 650V800" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M650 650V800" stroke={secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
        </g>
        
        {/* Microchips/Circuit Components */}
        <g>
          {/* Main Central Processor */}
          <rect
            x="450"
            y="350"
            width="100"
            height="100"
            rx="5"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          
          <rect
            x="460"
            y="360"
            width="80"
            height="80"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.2"
            stroke={secondaryColor}
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          
          {/* Pins */}
          <line x1="450" y1="370" x2="430" y2="370" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="450" y1="390" x2="430" y2="390" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="450" y1="410" x2="430" y2="410" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="450" y1="430" x2="430" y2="430" stroke={secondaryColor} strokeWidth="1.5" />
          
          <line x1="550" y1="370" x2="570" y2="370" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="550" y1="390" x2="570" y2="390" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="550" y1="410" x2="570" y2="410" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="550" y1="430" x2="570" y2="430" stroke={secondaryColor} strokeWidth="1.5" />
          
          <line x1="470" y1="350" x2="470" y2="330" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="490" y1="350" x2="490" y2="330" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="510" y1="350" x2="510" y2="330" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="530" y1="350" x2="530" y2="330" stroke={secondaryColor} strokeWidth="1.5" />
          
          <line x1="470" y1="450" x2="470" y2="470" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="490" y1="450" x2="490" y2="470" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="510" y1="450" x2="510" y2="470" stroke={secondaryColor} strokeWidth="1.5" />
          <line x1="530" y1="450" x2="530" y2="470" stroke={secondaryColor} strokeWidth="1.5" />
          
          {/* Central AI Label */}
          <text
            x="500"
            y="400"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={secondaryColor}
            fontSize="24"
            fontWeight="bold"
            opacity="0.7"
          >
            AI
          </text>
          
          {/* Left Hemisphere Chips */}
          <rect
            x="250"
            y="280"
            width="60"
            height="40"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          
          <rect
            x="180"
            y="350"
            width="50"
            height="30"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          
          <rect
            x="300"
            y="680"
            width="40"
            height="60"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          
          {/* Right Hemisphere Chips */}
          <rect
            x="690"
            y="280"
            width="60"
            height="40"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          
          <rect
            x="770"
            y="350"
            width="50"
            height="30"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          
          <rect
            x="660"
            y="680"
            width="40"
            height="60"
            rx="3"
            fill={primaryColor}
            fillOpacity="0.15"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </g>
        
        {/* Neural Connections - Thin Lines Connecting Everything */}
        <g opacity="0.6">
          {/* Connect Central Processor to Hemispheres */}
          <path
            d="M450 370C420 360 390 350 360 360C330 370 300 390 280 420"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M450 430C420 440 390 450 360 440C330 430 300 410 280 380"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M550 370C580 360 610 350 640 360C670 370 700 390 720 420"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M550 430C580 440 610 450 640 440C670 430 700 410 720 380"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          {/* Connect to Cerebellum */}
          <path
            d="M490 450C480 500 470 550 430 600C390 650 320 680 280 700"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M510 450C520 500 530 550 570 600C610 650 680 680 720 700"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          {/* Connect Chips */}
          <path
            d="M310 300C350 310 390 320 430 370"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M230 350C280 360 330 370 430 390"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M690 300C650 310 610 320 570 370"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M770 350C720 360 670 370 570 390"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M340 710C370 680 400 650 470 470"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          
          <path
            d="M660 710C630 680 600 650 530 470"
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
        </g>
        
        {/* Connection Points - Neurons */}
        <g>
          {/* Cerebrum Neurons */}
          <circle cx="200" cy="250" r="3" fill={secondaryColor} />
          <circle cx="250" cy="250" r="3" fill={secondaryColor} />
          <circle cx="300" cy="250" r="3" fill={secondaryColor} />
          <circle cx="350" cy="250" r="3" fill={secondaryColor} />
          
          <circle cx="200" cy="300" r="3" fill={secondaryColor} />
          <circle cx="250" cy="300" r="3" fill={secondaryColor} />
          <circle cx="300" cy="300" r="3" fill={secondaryColor} />
          <circle cx="350" cy="300" r="3" fill={secondaryColor} />
          
          <circle cx="200" cy="350" r="3" fill={secondaryColor} />
          <circle cx="250" cy="350" r="3" fill={secondaryColor} />
          <circle cx="300" cy="350" r="3" fill={secondaryColor} />
          <circle cx="350" cy="350" r="3" fill={secondaryColor} />
          
          <circle cx="200" cy="400" r="3" fill={secondaryColor} />
          <circle cx="250" cy="400" r="3" fill={secondaryColor} />
          <circle cx="300" cy="400" r="3" fill={secondaryColor} />
          <circle cx="350" cy="400" r="3" fill={secondaryColor} />
          
          <circle cx="200" cy="450" r="3" fill={secondaryColor} />
          <circle cx="250" cy="450" r="3" fill={secondaryColor} />
          <circle cx="300" cy="450" r="3" fill={secondaryColor} />
          <circle cx="350" cy="450" r="3" fill={secondaryColor} />
          
          <circle cx="800" cy="250" r="3" fill={secondaryColor} />
          <circle cx="750" cy="250" r="3" fill={secondaryColor} />
          <circle cx="700" cy="250" r="3" fill={secondaryColor} />
          <circle cx="650" cy="250" r="3" fill={secondaryColor} />
          
          <circle cx="800" cy="300" r="3" fill={secondaryColor} />
          <circle cx="750" cy="300" r="3" fill={secondaryColor} />
          <circle cx="700" cy="300" r="3" fill={secondaryColor} />
          <circle cx="650" cy="300" r="3" fill={secondaryColor} />
          
          <circle cx="800" cy="350" r="3" fill={secondaryColor} />
          <circle cx="750" cy="350" r="3" fill={secondaryColor} />
          <circle cx="700" cy="350" r="3" fill={secondaryColor} />
          <circle cx="650" cy="350" r="3" fill={secondaryColor} />
          
          <circle cx="800" cy="400" r="3" fill={secondaryColor} />
          <circle cx="750" cy="400" r="3" fill={secondaryColor} />
          <circle cx="700" cy="400" r="3" fill={secondaryColor} />
          <circle cx="650" cy="400" r="3" fill={secondaryColor} />
          
          <circle cx="800" cy="450" r="3" fill={secondaryColor} />
          <circle cx="750" cy="450" r="3" fill={secondaryColor} />
          <circle cx="700" cy="450" r="3" fill={secondaryColor} />
          <circle cx="650" cy="450" r="3" fill={secondaryColor} />
          
          {/* Cerebellum Neurons */}
          <circle cx="250" cy="650" r="3" fill={secondaryColor} />
          <circle cx="300" cy="650" r="3" fill={secondaryColor} />
          <circle cx="350" cy="650" r="3" fill={secondaryColor} />
          
          <circle cx="270" cy="700" r="3" fill={secondaryColor} />
          <circle cx="320" cy="700" r="3" fill={secondaryColor} />
          <circle cx="370" cy="700" r="3" fill={secondaryColor} />
          
          <circle cx="290" cy="750" r="3" fill={secondaryColor} />
          <circle cx="340" cy="750" r="3" fill={secondaryColor} />
          <circle cx="390" cy="750" r="3" fill={secondaryColor} />
          
          <circle cx="310" cy="800" r="3" fill={secondaryColor} />
          <circle cx="360" cy="800" r="3" fill={secondaryColor} />
          <circle cx="410" cy="800" r="3" fill={secondaryColor} />
          
          <circle cx="750" cy="650" r="3" fill={secondaryColor} />
          <circle cx="700" cy="650" r="3" fill={secondaryColor} />
          <circle cx="650" cy="650" r="3" fill={secondaryColor} />
          
          <circle cx="730" cy="700" r="3" fill={secondaryColor} />
          <circle cx="680" cy="700" r="3" fill={secondaryColor} />
          <circle cx="630" cy="700" r="3" fill={secondaryColor} />
          
          <circle cx="710" cy="750" r="3" fill={secondaryColor} />
          <circle cx="660" cy="750" r="3" fill={secondaryColor} />
          <circle cx="610" cy="750" r="3" fill={secondaryColor} />
          
          <circle cx="690" cy="800" r="3" fill={secondaryColor} />
          <circle cx="640" cy="800" r="3" fill={secondaryColor} />
          <circle cx="590" cy="800" r="3" fill={secondaryColor} />
          
          {/* Processor Connection Points */}
          <circle cx="430" cy="370" r="3" fill={secondaryColor} />
          <circle cx="430" cy="390" r="3" fill={secondaryColor} />
          <circle cx="430" cy="410" r="3" fill={secondaryColor} />
          <circle cx="430" cy="430" r="3" fill={secondaryColor} />
          
          <circle cx="570" cy="370" r="3" fill={secondaryColor} />
          <circle cx="570" cy="390" r="3" fill={secondaryColor} />
          <circle cx="570" cy="410" r="3" fill={secondaryColor} />
          <circle cx="570" cy="430" r="3" fill={secondaryColor} />
          
          <circle cx="470" cy="330" r="3" fill={secondaryColor} />
          <circle cx="490" cy="330" r="3" fill={secondaryColor} />
          <circle cx="510" cy="330" r="3" fill={secondaryColor} />
          <circle cx="530" cy="330" r="3" fill={secondaryColor} />
          
          <circle cx="470" cy="470" r="3" fill={secondaryColor} />
          <circle cx="490" cy="470" r="3" fill={secondaryColor} />
          <circle cx="510" cy="470" r="3" fill={secondaryColor} />
          <circle cx="530" cy="470" r="3" fill={secondaryColor} />
          
          {/* Important Junction Points */}
          <circle cx="280" cy="420" r="4" fill={accentColor} />
          <circle cx="280" cy="380" r="4" fill={accentColor} />
          <circle cx="720" cy="420" r="4" fill={accentColor} />
          <circle cx="720" cy="380" r="4" fill={accentColor} />
          <circle cx="280" cy="700" r="4" fill={accentColor} />
          <circle cx="720" cy="700" r="4" fill={accentColor} />
        </g>
        
        {/* Animated Data Flow Elements */}
        <g>
          {/* Pulse Animation for Main Processor */}
          <motion.circle
            cx="500"
            cy="400"
            r="45"
            fill={secondaryColor}
            fillOpacity="0.05"
            animate={{
              r: [45, 50, 45],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Data Flow Animation - Left Hemisphere */}
          <motion.circle
            cx="200"
            cy="250"
            r="2"
            fill="white"
            animate={{
              cx: [200, 250, 300, 350, 400, 450],
              cy: [250, 270, 300, 330, 350, 370],
              opacity: [0, 0.8, 0.8, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          
          {/* Data Flow Animation - Right Hemisphere */}
          <motion.circle
            cx="800"
            cy="250"
            r="2"
            fill="white"
            animate={{
              cx: [800, 750, 700, 650, 600, 550],
              cy: [250, 270, 300, 330, 350, 370],
              opacity: [0, 0.8, 0.8, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 1
            }}
          />
          
          {/* Data Flow Animation - To Cerebellum Left */}
          <motion.circle
            cx="490"
            cy="450"
            r="2"
            fill="white"
            animate={{
              cx: [490, 470, 450, 430, 410, 390, 370, 350, 330, 310],
              cy: [450, 480, 510, 540, 570, 600, 630, 660, 690, 720],
              opacity: [0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 2
            }}
          />
          
          {/* Data Flow Animation - To Cerebellum Right */}
          <motion.circle
            cx="510"
            cy="450"
            r="2"
            fill="white"
            animate={{
              cx: [510, 530, 550, 570, 590, 610, 630, 650, 670, 690],
              cy: [450, 480, 510, 540, 570, 600, 630, 660, 690, 720],
              opacity: [0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 3
            }}
          />
          
          {/* Glowing Connection Points */}
          <motion.circle
            cx="280"
            cy="420"
            r="6"
            fill={accentColor}
            animate={{
              r: [4, 6, 4],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.circle
            cx="720"
            cy="420"
            r="6"
            fill={accentColor}
            animate={{
              r: [4, 6, 4],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
          
          <motion.circle
            cx="280"
            cy="700"
            r="6"
            fill={accentColor}
            animate={{
              r: [4, 6, 4],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          <motion.circle
            cx="720"
            cy="700"
            r="6"
            fill={accentColor}
            animate={{
              r: [4, 6, 4],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.5
            }}
          />
        </g>
        
        {/* Binary Code Text Elements */}
        <g opacity="0.3">
          <text x="260" y="285" fill={primaryColor} fontSize="6" fontFamily="monospace">10110101</text>
          <text x="190" y="355" fill={primaryColor} fontSize="6" fontFamily="monospace">01011010</text>
          <text x="310" y="685" fill={primaryColor} fontSize="6" fontFamily="monospace">11001100</text>
          
          <text x="700" y="285" fill={primaryColor} fontSize="6" fontFamily="monospace">10110101</text>
          <text x="780" y="355" fill={primaryColor} fontSize="6" fontFamily="monospace">01011010</text>
          <text x="670" y="685" fill={primaryColor} fontSize="6" fontFamily="monospace">11001100</text>
          
          <text x="465" y="390" fill={primaryColor} fontSize="8" fontFamily="monospace">10110101</text>
          <text x="465" y="405" fill={primaryColor} fontSize="8" fontFamily="monospace">01011010</text>
        </g>
      </svg>
    </div>
  );
}
