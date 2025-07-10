import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface MarasilRobotProps {
  className?: string;
  size?: number;
  animated?: boolean;
  interactive?: boolean;
}

export function MarasilRobot({
  className = "",
  size = 400,
  animated = true,
  interactive = false,
}: MarasilRobotProps) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  // Simple state-based animation instead of complex motion hooks
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [eyePosition, setEyePosition] = useState({
    leftX: 100,
    rightX: 200,
    y: 150,
  });
  const [eyeBlink, setEyeBlink] = useState(1); // For blinking animation (1 = open, 0 = closed)
  const [antennaRotation, setAntennaRotation] = useState(0);

  // Update all animation values in a single effect
  useEffect(() => {
    if (!interactive) {
      // Reset to default positions when not interactive
      setRotation({ x: 0, y: 0 });
      setEyePosition({ leftX: 100, rightX: 200, y: 150 });
      setAntennaRotation(0);
      return;
    }

    // Calculate rotation based on mouse position
    const rotX = (mousePosition.y / 300) * 15 * -1; // Invert Y axis
    const rotY = (mousePosition.x / 300) * 15;

    // Calculate eye positions - enhance movement with non-linear response
    // Apply a subtle easing function to make eye movement more natural
    const easeX =
      Math.sign(mousePosition.x) *
      Math.pow(Math.abs(mousePosition.x / 300), 0.8) *
      8;
    const easeY =
      Math.sign(mousePosition.y) *
      Math.pow(Math.abs(mousePosition.y / 300), 0.8) *
      6;

    const leftEyeX = 100 + easeX;
    const rightEyeX = 200 + easeX;
    const eyesY = 150 + easeY;

    // Calculate antenna rotation - more responsive
    const antRot = (mousePosition.x / 300) * 7;

    // Update all states
    setRotation({ x: rotX, y: rotY });
    setEyePosition({
      leftX: leftEyeX,
      rightX: rightEyeX,
      y: eyesY,
    });
    setAntennaRotation(antRot);
  }, [mousePosition, interactive]);

  // Mouse move handler
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!interactive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setMousePosition({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
    });
  };

  // Random blinking effect
  useEffect(() => {
    if (!animated) return;

    // Random blink interval between 2-6 seconds
    const getRandomBlinkDelay = () =>
      Math.random() * 4000 + 2000;

    let blinkTimeout: NodeJS.Timeout;

    const blink = () => {
      // Close eyes
      setEyeBlink(0);

      // Open eyes after 150ms
      setTimeout(() => {
        setEyeBlink(1);

        // Schedule next blink
        blinkTimeout = setTimeout(blink, getRandomBlinkDelay());
      }, 150);
    };

    // Initial blink after a delay
    blinkTimeout = setTimeout(blink, getRandomBlinkDelay());

    return () => {
      clearTimeout(blinkTimeout);
    };
  }, [animated]);

  // Global mouse move handler
  useEffect(() => {
    setIsClient(true);

    if (!interactive) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setMousePosition({
        x: e.clientX - centerX,
        y: e.clientY - centerY,
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleGlobalMouseMove,
      );
    };
  }, [interactive]);

  // Reset when mouse leaves
  const handleMouseLeave = () => {
    if (!interactive) return;
    setMousePosition({ x: 0, y: 0 });
  };

  // Viewbox dimensions
  const viewBoxWidth = 300;
  const viewBoxHeight = 300;

  // Server-side rendering fallback
  if (!isClient) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  // Prepare smile path based on rotation
  let smilePath = "M115 210 C125 225, 175 225, 185 210";
  if (interactive && Math.abs(rotation.y) > 3) {
    smilePath = "M115 205 C125 215, 175 215, 185 205";
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main robot container */}
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 0.5,
        }}
        style={{
          width: size,
          height: size,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Headphones - Left */}
          <motion.path
            d="M30 150 C10 150, 0 130, 0 110 C0 90, 10 70, 30 70 Z"
            fill="#0F2F55"
            initial={
              animated ? { x: -20, opacity: 0 } : undefined
            }
            animate={
              animated
                ? {
                    x: 0,
                    opacity: 1,
                    translateX: interactive
                      ? rotation.y * -0.2
                      : 0,
                  }
                : undefined
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Headphones - Right */}
          <motion.path
            d="M270 150 C290 150, 300 130, 300 110 C300 90, 290 70, 270 70 Z"
            fill="#0F2F55"
            initial={
              animated ? { x: 20, opacity: 0 } : undefined
            }
            animate={
              animated
                ? {
                    x: 0,
                    opacity: 1,
                    translateX: interactive
                      ? rotation.y * 0.2
                      : 0,
                  }
                : undefined
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Main Head Outline */}
          <motion.path
            d="M270 110 C270 60, 220 20, 150 20 C80 20, 30 60, 30 110 L30 230 C30 270, 70 290, 150 290 C230 290, 270 270, 270 230 Z"
            fill="#0F2F55"
            initial={
              animated ? { scale: 0.9, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.5 }}
          />

          {/* Inner White Border */}
          <motion.path
            d="M250 110 C250 70, 210 40, 150 40 C90 40, 50 70, 50 110 L50 230 C50 260, 80 270, 150 270 C220 270, 250 260, 250 230 Z"
            fill="white"
            initial={
              animated ? { scale: 0.9, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.5, delay: 0.1 }}
          />

          {/* Inner Face */}
          <motion.path
            d="M230 110 C230 80, 200 60, 150 60 C100 60, 70 80, 70 110 L70 230 C70 250, 90 250, 150 250 C210 250, 230 250, 230 230 Z"
            fill="#0F2F55"
            initial={
              animated ? { scale: 0.9, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Antenna Base with rotation */}
          <motion.rect
            x="140"
            y="10"
            width="20"
            height="30"
            fill="#0F2F55"
            initial={
              animated ? { y: -20, opacity: 0 } : undefined
            }
            animate={
              animated
                ? {
                    y: 10,
                    opacity: 1,
                    rotate: antennaRotation,
                    transformOrigin: "150px 25px",
                  }
                : undefined
            }
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          {/* Antenna Circle with rotation */}
          <motion.circle
            cx="150"
            cy="0"
            r="15"
            fill="#0F2F55"
            initial={
              animated ? { y: -20, opacity: 0 } : undefined
            }
            animate={
              animated
                ? {
                    y: 0,
                    opacity: 1,
                    rotate: antennaRotation,
                    transformOrigin: "150px 25px",
                    translateY: interactive
                      ? rotation.x * -0.2
                      : 0,
                  }
                : undefined
            }
            transition={{ duration: 0.5, delay: 0.4 }}
          />

          {/* Left Eye Socket */}
          <motion.ellipse
            animate={{
              cx: eyePosition.leftX,
              cy: eyePosition.y,
              ry: 30 * eyeBlink, // Scale height for blinking
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            rx="25"
            ry="30"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.5 }}
          />

          {/* Right Eye Socket */}
          <motion.ellipse
            animate={{
              cx: eyePosition.rightX,
              cy: eyePosition.y,
              ry: 30 * eyeBlink, // Scale height for blinking
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            rx="25"
            ry="30"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.5 }}
          />

          {/* Left Eye Iris */}
          <motion.circle
            animate={{
              cx: eyePosition.leftX,
              cy: eyePosition.y,
              r: 15 * eyeBlink, // Scale for blinking
              opacity: eyeBlink * 0.8 + 0.2, // Reduce opacity slightly during blink
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="15"
            fill="#3B82F6"
            fillOpacity="0.2"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.53 }}
          />

          {/* Right Eye Iris */}
          <motion.circle
            animate={{
              cx: eyePosition.rightX,
              cy: eyePosition.y,
              r: 15 * eyeBlink, // Scale for blinking
              opacity: eyeBlink * 0.8 + 0.2, // Reduce opacity slightly during blink
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="15"
            fill="#3B82F6"
            fillOpacity="0.2"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.53 }}
          />

          {/* Left Pupil */}
          <motion.circle
            animate={{
              cx: eyePosition.leftX,
              cy: eyePosition.y,
              r: 10 * eyeBlink, // Scale for blinking
              opacity: eyeBlink * 0.9 + 0.1, // Reduce opacity slightly during blink
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="10"
            fill="#0F2F55"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.55 }}
          />

          {/* Right Pupil */}
          <motion.circle
            animate={{
              cx: eyePosition.rightX,
              cy: eyePosition.y,
              r: 10 * eyeBlink, // Scale for blinking
              opacity: eyeBlink * 0.9 + 0.1, // Reduce opacity slightly during blink
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="10"
            fill="#0F2F55"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.55 }}
          />

          {/* Left Eye Light Reflection */}
          <motion.circle
            animate={{
              cx: eyePosition.leftX + 5,
              cy: eyePosition.y - 5,
              r: 4 * eyeBlink,
              opacity: eyeBlink,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="4"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.6 }}
          />

          {/* Right Eye Light Reflection */}
          <motion.circle
            animate={{
              cx: eyePosition.rightX + 5,
              cy: eyePosition.y - 5,
              r: 4 * eyeBlink,
              opacity: eyeBlink,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="4"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 1 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.6 }}
          />

          {/* Small Secondary Light Reflection - Left */}
          <motion.circle
            animate={{
              cx: eyePosition.leftX - 6,
              cy: eyePosition.y + 6,
              r: 2 * eyeBlink,
              opacity: eyeBlink * 0.7,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="2"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 0.7 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.65 }}
          />

          {/* Small Secondary Light Reflection - Right */}
          <motion.circle
            animate={{
              cx: eyePosition.rightX - 6,
              cy: eyePosition.y + 6,
              r: 2 * eyeBlink,
              opacity: eyeBlink * 0.7,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="2"
            fill="white"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 0.7 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.65 }}
          />

          {/* Additional Eye Elements - Digital Circuitry Pattern in Iris (Left) */}
          <motion.circle
            animate={{
              cx: eyePosition.leftX,
              cy: eyePosition.y,
              r: 12 * eyeBlink,
              opacity: eyeBlink * 0.15,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="12"
            stroke="#3B82F6"
            strokeWidth="0.5"
            fill="none"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 0.15 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.58 }}
          />

          {/* Additional Eye Elements - Digital Circuitry Pattern in Iris (Right) */}
          <motion.circle
            animate={{
              cx: eyePosition.rightX,
              cy: eyePosition.y,
              r: 12 * eyeBlink,
              opacity: eyeBlink * 0.15,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            r="12"
            stroke="#3B82F6"
            strokeWidth="0.5"
            fill="none"
            initial={
              animated ? { scale: 0, opacity: 0 } : undefined
            }
            animate={
              animated ? { scale: 1, opacity: 0.15 } : undefined
            }
            transition={{ duration: 0.3, delay: 0.58 }}
          />

          {/* Smile */}
          <motion.path
            d={smilePath}
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            initial={
              animated
                ? { pathLength: 0, opacity: 0 }
                : undefined
            }
            animate={
              animated
                ? { pathLength: 1, opacity: 1 }
                : undefined
            }
            transition={{ duration: 0.5, delay: 0.6 }}
          />

          {/* Microphone/Button */}
          <motion.rect
            x="135"
            y="240"
            width="30"
            height="15"
            rx="5"
            fill="white"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={{ duration: 0.3, delay: 0.7 }}
          />

          {/* Signal Pulse Animation */}
          {animated && (
            <motion.circle
              cx="150"
              cy="0"
              r="20"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.5, 0.8],
                rotate: antennaRotation,
                transformOrigin: "150px 25px",
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          )}
        </svg>
      </motion.div>

      {/* Subtle glow effect */}
      {animated && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(15,47,85,0.05) 50%, rgba(0,0,0,0) 70%)",
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Binary data particles - only visible when animated and interactive */}
      {animated && interactive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[10px] font-mono"
              style={{
                top: `${30 + i * 10}%`,
                left: `${10 + i * 20}%`,
                color: "rgba(15, 47, 85, 0.6)",
              }}
              animate={{
                opacity: [0, 0.7, 0],
                y: [0, -20],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {i % 2 === 0 ? "1" : "0"}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}