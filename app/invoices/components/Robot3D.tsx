
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Robot3DProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function Robot3D({ className = "", size = 400, animated = true }: Robot3DProps) {
  const [isClient, setIsClient] = useState(false);
  const robotRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsClient(true);
    
    if (!animated) return;
    
    // Subtle automatic rotation
    const interval = setInterval(() => {
      setRotation({
        x: Math.sin(Date.now() / 3000) * 5,
        y: Math.cos(Date.now() / 4000) * 5
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [animated]);
  
  // Handle mouse move for interactive rotation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!robotRef.current || !animated) return;
    
    const rect = robotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -15;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  if (!isClient) {
    return <div className={className} style={{ width: size, height: size }} />;
  }
  
  return (
    <div 
      ref={robotRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Scene Container */}
      <div 
        className="w-full h-full relative perspective-[1200px]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Robot Container with 3D Rotation */}
        <motion.div
          className="w-full h-full absolute"
          style={{
            transformStyle: "preserve-3d",
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Robot Body - Main Container */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Robot Head */}
            <div
              className="absolute w-[180px] h-[180px] rounded-[20px] top-0 left-1/2 -translate-x-1/2 -translate-y-[60%]"
              style={{ 
                transformStyle: "preserve-3d",
                transform: "translateZ(20px)",
                backgroundColor: "#0F2F55",
                boxShadow: "0 10px 30px rgba(15, 47, 85, 0.4)"
              }}
            >
              {/* White Border/Outline */}
              <div
                className="absolute inset-[8px] rounded-[12px] border-[4px] border-white"
                style={{ transform: "translateZ(1px)" }}
              ></div>
              
              {/* Eyes */}
              <div className="absolute top-[50px] left-[40px] w-[30px] h-[30px] rounded-full bg-white"></div>
              <div className="absolute top-[50px] right-[40px] w-[30px] h-[30px] rounded-full bg-white"></div>
              
              {/* Smile */}
              <div 
                className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-[80px] h-[30px] bg-transparent border-b-[6px] border-white rounded-b-[15px]"
                style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}
              ></div>
              
              {/* Microphone/Button */}
              <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 w-[20px] h-[10px] bg-white rounded-[4px]"></div>
            </div>
            
            {/* Antenna */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[100%]" style={{ transformStyle: "preserve-3d" }}>
              <div 
                className="w-[8px] h-[30px]"
                style={{ 
                  transform: "translateZ(20px)",
                  backgroundColor: "#0F2F55"
                }}
              ></div>
              <div 
                className="w-[24px] h-[24px] rounded-full absolute top-[-24px] left-1/2 -translate-x-1/2"
                style={{ 
                  transform: "translateZ(20px)",
                  backgroundColor: "#0F2F55",
                  boxShadow: "0 5px 15px rgba(15, 47, 85, 0.4)"
                }}
              ></div>
              
              {/* Antenna Glow */}
              <motion.div
                className="w-[30px] h-[30px] rounded-full absolute top-[-27px] left-1/2 -translate-x-1/2"
                style={{ 
                  filter: "blur(5px)",
                  backgroundColor: "rgba(59, 130, 246, 0.3)"
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
            </div>
            
            {/* Headphones */}
            <div 
              className="w-[220px] h-[40px] absolute top-[-30px] left-1/2 -translate-x-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Left Headphone */}
              <div 
                className="absolute left-[-30px] w-[30px] h-[60px] rounded-l-[15px]"
                style={{ 
                  transform: "translateZ(10px)",
                  backgroundColor: "#0F2F55"
                }}
              ></div>
              
              {/* Right Headphone */}
              <div 
                className="absolute right-[-30px] w-[30px] h-[60px] rounded-r-[15px]"
                style={{ 
                  transform: "translateZ(10px)",
                  backgroundColor: "#0F2F55"
                }}
              ></div>
            </div>
            
            {/* Data Pulses */}
            {animated && (
              <>
                <motion.div
                  className="absolute w-[300px] h-[300px] rounded-full border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    transform: "translateZ(-10px)",
                    borderColor: "rgba(59, 130, 246, 0.2)"
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                <motion.div
                  className="absolute w-[300px] h-[300px] rounded-full border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    transform: "translateZ(-20px)",
                    borderColor: "rgba(15, 47, 85, 0.2)"
                  }}
                  animate={{
                    scale: [1.2, 1.7, 1.2],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                ></motion.div>
              </>
            )}
            
            {/* Neural Network Connections */}
            {animated && (
              <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: "translateZ(-30px)" }}>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-[8px] h-[8px] rounded-full"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      filter: "blur(2px)",
                      backgroundColor: "rgba(59, 130, 246, 0.8)"
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Floating Binary Data */}
          {animated && (
            <div className="absolute inset-0" style={{ transform: "translateZ(-50px)" }}>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-[10px] font-mono"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    color: "rgba(15, 47, 85, 0.6)"
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -20 - Math.random() * 30]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  {Math.random() > 0.5 ? "1" : "0"}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Glow Effects */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ 
          filter: "blur(40px)",
          background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(15,47,85,0.1) 50%, rgba(0,0,0,0) 70%)"
        }}
      ></div>
    </div>
  );
}
