
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircuitBrainSvg } from "./CircuitBrainSvg";

interface CircuitBrainBackgroundProps {
  className?: string;
  opacity?: number;
  position?: "center" | "top" | "bottom" | "left" | "right";
  scale?: number;
}

export function CircuitBrainBackground({ 
  className = "", 
  opacity = 0.15,
  position = "center",
  scale = 1
}: CircuitBrainBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  // Position styles
  const positionStyles = {
    center: "inset-0 flex items-center justify-center",
    top: "inset-x-0 top-0 flex items-start justify-center pt-20",
    bottom: "inset-x-0 bottom-0 flex items-end justify-center pb-20",
    left: "inset-y-0 left-0 flex items-center justify-start pl-20",
    right: "inset-y-0 right-0 flex items-center justify-end pr-20",
  };
  
  return (
    <div className={`absolute ${positionStyles[position]} overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="w-full max-w-[1500px] h-auto"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity,
          scale: [scale * 0.98, scale * 1.02, scale * 0.98]
        }}
        transition={{ 
          opacity: { duration: 1.5 },
          scale: { duration: 10, repeat: Infinity, repeatType: "reverse" }
        }}
        style={{ opacity }}
      >
        <CircuitBrainSvg />
      </motion.div>
    </div>
  );
}
