// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { AiBrainSvg } from "./AiBrainSvg";

// interface AIBrainBackgroundProps {
//   className?: string;
//   position?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
// }

// export function AIBrainBackground({
//   className = "",
//   position = "center"
// }: AIBrainBackgroundProps) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) return null;

//   // Determine positioning classes based on the position prop
//   const positionClasses = {
//     "center": "inset-0 flex items-center justify-center",
//     "top": "inset-x-0 top-0 -translate-y-1/4",
//     "bottom": "inset-x-0 bottom-0 translate-y-1/4",
//     "left": "inset-y-0 left-0 -translate-x-1/4",
//     "right": "inset-y-0 right-0 translate-x-1/4",
//     "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
//     "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
//     "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
//     "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4"
//   }[position];

//   return (
//     <div className={`absolute ${positionClasses} overflow-hidden pointer-events-none ${className}`}>
//       <motion.div
//         className="w-full max-w-[1200px] h-auto"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.5 }}
//       >
//         <AiBrainSvg />
//       </motion.div>
//     </div>
//   );
// }
