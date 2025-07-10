
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ElectronicCircuits } from "./ElectronicCircuits";

interface CircuitBackgroundElementProps {
  className?: string;
  opacity?: number;
}

export function CircuitBackgroundElement({ 
  className = "", 
  opacity = 0.12 
}: CircuitBackgroundElementProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 1.5 }}
      >
        <ElectronicCircuits />
      </motion.div>
    </div>
  );
}
