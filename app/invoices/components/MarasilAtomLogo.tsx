import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface MarasilAtomLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  rotationSpeed?: number;
}

// Helper to get electron position on ellipse
function getEllipsePoint(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angleDeg: number
) {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

export function MarasilAtomLogo({
  className = "",
  size = 400,
  animated = true,
  rotationSpeed = 20, // Default whole logo rotation speed in seconds (no longer used)
}: MarasilAtomLogoProps) {
  const [isClient, setIsClient] = useState(false);

  // Viewbox dimensions
  const viewBoxSize = 300;

  // Electron angles (for animation)
  const [angles, setAngles] = useState([0, 120, 240]);
  // هون في خطأ: لازم تعطي useRef قيمة ابتدائية (مثلاً null)، مش تتركها فاضية
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    function animate(time: number) {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      // 60 deg/sec
      setAngles((prev) => prev.map((a, i) => (a + 60 * dt) % 360));
      requestRef.current = requestAnimationFrame(animate);
    }
    if (animated) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animated]);

  // Server-side rendering fallback
  if (!isClient) {
    return <div className={className} style={{ width: size, height: size }} />;
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Main 3D container - static with 3D perspective */}
      <motion.div
        initial={{
          rotateX: 10, // Slight tilt on X axis for better 3D effect
        }}
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          transform: "translateZ(0)",
          rotateX: "10deg", // Fixed tilt for 3D appearance
        }}
        className="relative"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Orbit 1 - Horizontal ellipse */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 0 } : undefined}
            animate={
              animated
                ? { opacity: 1, rotate: 360, transformOrigin: "center" }
                : undefined
            }
            transition={{
              opacity: { duration: 0.5 },
              rotate: { duration: 0, repeat: Infinity, ease: "linear" },
            }}
            style={{
              transform: "perspective(600px) rotateX(24deg) rotateZ(0deg)",
              transformOrigin: "center",
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.4}
              ry={viewBoxSize * 0.17}
              stroke="url(#ring-gradient)"
              strokeWidth={10}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              }}
            />
            {/* Electron 1 - animated position */}
            {isClient &&
              (() => {
                const { x, y } = getEllipsePoint(
                  viewBoxSize / 2,
                  viewBoxSize / 2,
                  viewBoxSize * 0.4,
                  viewBoxSize * 0.18,
                  angles[0]
                );
                return (
                  <circle cx={x} cy={y} r={viewBoxSize * 0.06} fill="#2ecc71" />
                );
              })()}
          </motion.g>

          {/* Orbit 2 - 60deg */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 60 } : undefined}
            animate={
              animated
                ? { opacity: 1, rotate: 420, transformOrigin: "center" }
                : undefined
            }
            transition={{
              opacity: { duration: 0.5 },
              rotate: { duration: 0, repeat: Infinity, ease: "linear" },
            }}
            style={{
              transform: "perspective(600px) rotateX(-24deg) rotateZ(120deg)",
              transformOrigin: "center",
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.38}
              ry={viewBoxSize * 0.17}
              stroke="url(#ring-gradient)"
              strokeWidth={10}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              }}
            />
            {/* Electron 2 - animated position */}
            {isClient &&
              (() => {
                const { x, y } = getEllipsePoint(
                  viewBoxSize / 2,
                  viewBoxSize / 2,
                  viewBoxSize * 0.38,
                  viewBoxSize * 0.17,
                  angles[1]
                );
                return (
                  <circle cx={x} cy={y} r={viewBoxSize * 0.06} fill="#3498db" />
                );
              })()}
          </motion.g>

          {/* Orbit 3 - 120deg */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 120 } : undefined}
            animate={
              animated
                ? { opacity: 1, rotate: 480, transformOrigin: "center" }
                : undefined
            }
            transition={{
              opacity: { duration: 0.5 },
              rotate: { duration: 0, repeat: Infinity, ease: "linear" },
            }}
            style={{
              transform: "perspective(600px) rotateY(24deg) rotateZ(240deg)",
              transformOrigin: "center",
            }}
          >
            <ellipse
              cx={viewBoxSize / 1.9}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.38}
              ry={viewBoxSize * 0.17}
              stroke="url(#ring-gradient)"
              strokeWidth={10}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              }}
            />
            {/* Electron 3 - animated position */}
            {isClient &&
              (() => {
                const { x, y } = getEllipsePoint(
                  viewBoxSize / 2,
                  viewBoxSize / 2,
                  viewBoxSize * 0.38,
                  viewBoxSize * 0.17,
                  angles[2]
                );
                return (
                  <circle cx={x} cy={y} r={viewBoxSize * 0.06} fill="#e74c3c" />
                );
              })()}
          </motion.g>

          {/* Central nucleus sphere with 3D effect - NO ROTATION */}
          <motion.g
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center",
            }}
          >
            {/* Outer glow for 3D effect */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.24}
              fill="url(#nucleus-gradient)"
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 0.6 } : undefined}
              transition={{ duration: 0.5 }}
              style={{
                filter: "blur(10px)",
              }}
            />

            {/* Main nucleus */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.22}
              fill="url(#sphere-gradient)"
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5 }}
              style={{
                filter: "drop-shadow(0 10px 15px rgba(15, 47, 85, 0.6))",
              }}
            />

            {/* Letter M in the center - with 3D effect */}
            <motion.path
              d="M120 175 L120 125 L150 155 L180 125 L180 175"
              stroke="white"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
              animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
              }}
            />

            {/* في نهاية الـSVG قبل </svg> */}
            <defs>
              <linearGradient
                id="ring-gradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#0F2F55" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3BD6F6" stopOpacity="0.9" />
              </linearGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="12"
                  flood-color="#0F2F55"
                  flood-opacity="0.18"
                />
              </filter>
            </defs>
          </motion.g>

          {/* Gradients for 3D effects */}
          <defs>
            <radialGradient
              id="sphere-gradient"
              cx="33%"
              cy="33%"
              r="63%"
              fx="23%"
              fy="23%"
            >
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0F2F55" />
              <stop offset="100%" stopColor="#0B1A2E" />
            </radialGradient>

            <radialGradient id="nucleus-gradient" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F2F55" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Enhanced 3D glow effect */}
      {animated && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,47,85,0.08) 50%, rgba(0,0,0,0) 70%)",
            filter: "blur(20px)",
          }}
        />
      )}
    </div>
  );
}
