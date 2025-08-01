
import { motion } from "framer-motion";

interface MarasilLogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export function MarasilLogo({ 
  width = 120, 
  height = 48, 
  showText = true, 
  className = "",
  animate = false 
}: MarasilLogoProps) {
  const wingVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.5, yoyo: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className={`inline-flex items-center ${className}`}
      style={{ width, height }}
      whileHover={animate ? "hover" : undefined}
    >
      <svg 
        viewBox="0 0 600 250" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Wings */}
        <motion.g variants={wingVariants}>
          {/* Left Wing */}
          <path d="M10 140 C20 100 70 80 140 120 C200 150 230 160 250 170 C240 160 230 150 170 120 C120 95 70 75 30 120 C20 130 15 135 10 140Z" fill="#002147" />
          <path d="M30 150 C40 115 80 100 150 135 C200 160 230 170 250 180 C240 170 230 160 180 135 C130 110 80 95 40 130 C35 140 32 145 30 150Z" fill="#002147" />
          <path d="M50 160 C60 130 90 120 160 150 C200 170 230 180 250 190 C240 180 230 170 190 150 C140 125 90 115 60 140 C55 150 52 155 50 160Z" fill="#002147" />
          <path d="M70 170 C80 145 100 140 170 165 C200 180 230 190 250 200 C240 190 230 180 200 165 C150 140 100 135 80 150 C75 160 72 165 70 170Z" fill="#002147" />
          
          {/* Light blue overlays for left wing */}
          <path d="M20 140 C30 105 75 85 145 125 C205 155 235 165 255 175" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M40 150 C50 120 85 105 155 140 C205 165 235 175 255 185" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M60 160 C70 135 95 125 165 155 C205 175 235 185 255 195" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M80 170 C90 150 105 145 175 170 C205 185 235 195 255 205" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          
          {/* Right Wing */}
          <path d="M590 140 C580 100 530 80 460 120 C400 150 370 160 350 170 C360 160 370 150 430 120 C480 95 530 75 570 120 C580 130 585 135 590 140Z" fill="#002147" />
          <path d="M570 150 C560 115 520 100 450 135 C400 160 370 170 350 180 C360 170 370 160 420 135 C470 110 520 95 560 130 C565 140 568 145 570 150Z" fill="#002147" />
          <path d="M550 160 C540 130 510 120 440 150 C400 170 370 180 350 190 C360 180 370 170 410 150 C460 125 510 115 540 140 C545 150 548 155 550 160Z" fill="#002147" />
          <path d="M530 170 C520 145 500 140 430 165 C400 180 370 190 350 200 C360 190 370 180 400 165 C450 140 500 135 520 150 C525 160 528 165 530 170Z" fill="#002147" />
          
          {/* Light blue overlays for right wing */}
          <path d="M580 140 C570 105 525 85 455 125 C395 155 365 165 345 175" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M560 150 C550 120 515 105 445 140 C395 165 365 175 345 185" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M540 160 C530 135 505 125 435 155 C395 175 365 185 345 195" stroke="#7FB3D5" strokeWidth="2" fill="none" />
          <path d="M520 170 C510 150 495 145 425 170 C395 185 365 195 345 205" stroke="#7FB3D5" strokeWidth="2" fill="none" />
        </motion.g>
        
        {/* Center Circle */}
        <circle cx="300" cy="170" r="60" fill="#002147" />
        
        {/* M letter */}
        <path d="M278 140 C278 200, 300 180, 300 180 C300 180, 322 200, 322 140" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" />
        
        {/* MARASIL Text */}
        {showText && (
          <g transform="translate(200, 250)">
            <text x="0" y="0" fontFamily="Arial, sans-serif" fontSize="50" fontWeight="bold" fill="#002147">MARAsiL</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
