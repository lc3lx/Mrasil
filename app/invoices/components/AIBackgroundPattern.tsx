// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// interface AIBackgroundPatternProps {
//   className?: string;
// }

// export function AIBackgroundPattern({ className = "" }: AIBackgroundPatternProps) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) return null;

//   return (
//     <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
//       {/* Base dot pattern - keep this for texture */}
//       <div
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: "radial-gradient(circle, rgba(15, 47, 85, 0.15) 1px, transparent 1px)",
//           backgroundSize: "30px 30px"
//         }}
//       />

//       {/* Neural network lines pattern */}
//       <svg
//         className="absolute inset-0 w-full h-full opacity-[0.05]"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <defs>
//           <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
//             <path
//               d="M20 20L80 80M80 20L20 80M50 10L50 90M10 50L90 50"
//               stroke="#0F2F55"
//               strokeWidth="0.5"
//               fill="none"
//             />
//             <circle cx="50" cy="50" r="2" fill="#3B82F6" />
//             <circle cx="20" cy="20" r="1.5" fill="#0F2F55" />
//             <circle cx="80" cy="80" r="1.5" fill="#0F2F55" />
//             <circle cx="20" cy="80" r="1.5" fill="#0F2F55" />
//             <circle cx="80" cy="20" r="1.5" fill="#0F2F55" />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#neural-grid)" />
//       </svg>

//       {/* Brain-inspired curves and synapses */}
//       <svg
//         className="absolute inset-0 w-full h-full opacity-[0.03]"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 1000 1000"
//       >
//         {/* Brain-like curves */}
//         <path
//           d="M200,300 Q300,200 400,300 T600,300 Q700,200 800,300"
//           stroke="#0F2F55"
//           strokeWidth="1.5"
//           fill="none"
//         />
//         <path
//           d="M200,500 Q300,400 400,500 T600,500 Q700,400 800,500"
//           stroke="#0F2F55"
//           strokeWidth="1.5"
//           fill="none"
//         />
//         <path
//           d="M200,700 Q300,600 400,700 T600,700 Q700,600 800,700"
//           stroke="#0F2F55"
//           strokeWidth="1.5"
//           fill="none"
//         />

//         {/* Vertical connections */}
//         <path
//           d="M300,200 C320,350 280,450 300,700"
//           stroke="#0F2F55"
//           strokeWidth="1"
//           fill="none"
//         />
//         <path
//           d="M500,200 C520,350 480,450 500,700"
//           stroke="#0F2F55"
//           strokeWidth="1"
//           fill="none"
//         />
//         <path
//           d="M700,200 C720,350 680,450 700,700"
//           stroke="#0F2F55"
//           strokeWidth="1"
//           fill="none"
//         />

//         {/* Synapse nodes */}
//         <circle cx="300" cy="300" r="3" fill="#3B82F6" />
//         <circle cx="400" cy="300" r="3" fill="#3B82F6" />
//         <circle cx="500" cy="300" r="3" fill="#3B82F6" />
//         <circle cx="600" cy="300" r="3" fill="#3B82F6" />
//         <circle cx="700" cy="300" r="3" fill="#3B82F6" />

//         <circle cx="300" cy="500" r="3" fill="#3B82F6" />
//         <circle cx="400" cy="500" r="3" fill="#3B82F6" />
//         <circle cx="500" cy="500" r="3" fill="#3B82F6" />
//         <circle cx="600" cy="500" r="3" fill="#3B82F6" />
//         <circle cx="700" cy="500" r="3" fill="#3B82F6" />

//         <circle cx="300" cy="700" r="3" fill="#3B82F6" />
//         <circle cx="400" cy="700" r="3" fill="#3B82F6" />
//         <circle cx="500" cy="700" r="3" fill="#3B82F6" />
//         <circle cx="600" cy="700" r="3" fill="#3B82F6" />
//         <circle cx="700" cy="700" r="3" fill="#3B82F6" />
//       </svg>

//       {/* Animated data pulses - subtle movement */}
//       <div className="absolute inset-0">
//         {[...Array(5)].map((_, i) => (
//           <motion.div
//             key={`pulse-${i}`}
//             className="absolute w-3 h-3 rounded-full"
//             style={{
//               top: `${30 + i * 15}%`,
//               left: `${20 + i * 15}%`,
//               background: i % 2 === 0 ? "#0F2F55" : "#3B82F6",
//               opacity: 0.1
//             }}
//             animate={{
//               scale: [1, 1.5, 1],
//               opacity: [0.05, 0.1, 0.05]
//             }}
//             transition={{
//               duration: 4 + i,
//               repeat: Infinity,
//               repeatType: "reverse",
//               delay: i * 0.8
//             }}
//           />
//         ))}
//       </div>

//       {/* Subtle brain outline - top right */}
//       <motion.div
//         className="absolute top-[5%] right-[10%] w-[300px] h-[300px] opacity-[0.04]"
//         animate={{
//           opacity: [0.02, 0.04, 0.02]
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           repeatType: "reverse"
//         }}
//       >
//         <svg
//           viewBox="0 0 200 200"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-full h-full"
//         >
//           <path
//             d="M100 30C70 30 50 50 50 80C50 95 60 105 60 120C60 140 50 150 50 170C50 190 70 200 100 200C130 200 150 190 150 170C150 150 140 140 140 120C140 105 150 95 150 80C150 50 130 30 100 30Z"
//             stroke="#0F2F55"
//             strokeWidth="1.5"
//             fill="none"
//           />
//           <path
//             d="M80 60C70 80 70 100 80 120"
//             stroke="#0F2F55"
//             strokeWidth="1"
//             fill="none"
//           />
//           <path
//             d="M120 60C130 80 130 100 120 120"
//             stroke="#0F2F55"
//             strokeWidth="1"
//             fill="none"
//           />
//           <path
//             d="M60 80C80 90 120 90 140 80"
//             stroke="#0F2F55"
//             strokeWidth="1"
//             fill="none"
//           />
//           <path
//             d="M60 120C80 130 120 130 140 120"
//             stroke="#0F2F55"
//             strokeWidth="1"
//             fill="none"
//           />
//           <path
//             d="M80 160C90 150 110 150 120 160"
//             stroke="#0F2F55"
//             strokeWidth="1"
//             fill="none"
//           />
//         </svg>
//       </motion.div>

//       {/* Binary code particles - extremely subtle */}
//       <div className="absolute inset-0">
//         {[...Array(10)].map((_, i) => (
//           <motion.div
//             key={`binary-${i}`}
//             className="absolute text-[8px] opacity-0 font-mono"
//             style={{
//               top: `${Math.random() * 90 + 5}%`,
//               left: `${Math.random() * 90 + 5}%`,
//               color: i % 2 === 0 ? "rgba(15, 47, 85, 0.15)" : "rgba(59, 130, 246, 0.15)"
//             }}
//             animate={{
//               opacity: [0, 0.15, 0],
//               y: [0, -15]
//             }}
//             transition={{
//               duration: 3 + Math.random() * 2,
//               repeat: Infinity,
//               delay: i * 1.2
//             }}
//           >
//             {i % 2 === 0 ? "1" : "0"}
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
