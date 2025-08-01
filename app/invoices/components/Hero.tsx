import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MarasilAtomLogo } from "./MarasilAtomLogo";
import { AIVisualizer } from "./AIVisualizer";
//import { AIBackgroundElements } from "./AIBackgroundElements";
//import { AIBackgroundPattern } from "./AIBackgroundPattern";
import { CircuitBrainBackground } from "./CircuitBrainBackground";
import { CircuitBackgroundElement } from "./CircuitBackgroundElement";
import { CerebellarBrainBackground } from "./CerebellarBrainBackground";

export function Hero() {
  const [isClient, setIsClient] = useState(false);
  const [activeText, setActiveText] = useState(0);

  const aiCapabilities = [
    "Optimizing shipping routes in real-time",
    "Predicting delivery times with 99.4% accuracy",
    "Automating inventory management",
    "Analyzing traffic patterns for fastest delivery",
    "Neural network powered logistics solutions",
    "Machine learning algorithms for route optimization",
  ];

  useEffect(() => {
    setIsClient(true);

    // Rotate through AI capability text
    const interval = setInterval(() => {
      setActiveText((prev) => (prev + 1) % aiCapabilities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[400px] flex flex-col items-center justify-center">
      {/* Hero content - centered column layout with responsive sizing */}
      <div className="container relative z-10 mx-auto px-4 py-8 flex flex-col items-center">
        {/* Pioneer in Saudi Arabia Badge - Now as a top ribbon */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0F2F55]/10 backdrop-blur-sm px-4 py-2 border border-[#0F2F55]/20">
            <div className="relative h-5 w-5">
              <motion.div
                className="absolute inset-0 rounded-full bg-[#0F2F55]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#0F2F55]"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
            <span className="text-sm font-medium text-[#0F2F55]">
              World's First AI-Powered Logistics Platform
            </span>
          </div>
        </motion.div>

        {/* 3D Atom Logo container with improved dimensions */}
        <motion.div
          className="relative mb-16 w-full max-w-[min(100%,320px)] mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Updated 3D Rotating Atom Logo with individually rotating rings */}
          <div className="flex justify-center">
            <MarasilAtomLogo
              size={320}
              animated={true}
              className="w-full h-auto"
            />
          </div>

          {/* Enhanced glow effect around the 3D atom */}
          <div className="absolute inset-0 -m-6 rounded-full pointer-events-none">
            <motion.div
              className="absolute inset-0 rounded-full border border-[#3B82F6]/20"
              // animate={{
              //   scale: [1, 1.05, 1],
              //   opacity: [0.3, 0.5, 0.3],
              // }}
              // transition={{
              //   duration: 4,
              //   repeat: Infinity,
              //   repeatType: "reverse",
              // }}
            />
          </div>
        </motion.div>

        {/* Content below the atom logo */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Main headline with Saudi Arabia emphasis */}
          <motion.h1
            className="mb-6 text-4xl md:text-5xl font-bold tracking-tight text-[#0F2F55]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F2F55] to-[#3B82F6]">
              أول منصة
            </span>{" "}
              في العالم مدعومة بالذكاء الاصطناعي لمساعدتك في إدارة شحناتك
          </motion.h1>

          {/* Rotating AI capabilities */}
          <motion.div
            className="mb-8 relative h-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={activeText}
                className="text-lg text-[#0F2F55]/80 absolute left-0 right-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[#3B82F6] font-medium">AI is</span>{" "}
                {aiCapabilities[activeText]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* AI Technologies row */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3B82F6]"></div>
              <p className="text-sm text-[#0F2F55]/80">Advanced AI</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#0F2F55]"></div>
              <p className="text-sm text-[#0F2F55]/80">Neural Networks</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
              <p className="text-sm text-[#0F2F55]/80">ML Algorithms</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-2 w-2">
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#F59E0B]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <p className="text-sm text-[#0F2F55]/80">24/7 AI Monitoring</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-[#0F2F55]/10 shadow-sm">
              <h2 className="text-3xl font-bold text-[#3B82F6]">10,000+</h2>
              <p className="text-sm text-[#0F2F55]/70">Daily Shipments</p>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-[#0F2F55]/10 shadow-sm">
              <h2 className="text-3xl font-bold text-[#10B981]">99.9%</h2>
              <p className="text-sm text-[#0F2F55]/70">Accuracy Rate</p>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-[#0F2F55]/10 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-[#3B82F6]">#1</h2>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#0F2F55]">
                    Logistics Platform
                  </span>
                  <span className="text-xs text-[#0F2F55]/70">
                    24/7 AI Monitoring
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main description text */}
          <motion.p
            className="mb-8 text-[#0F2F55]/80 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Marasil is pioneering artificial intelligence in the global
            logistics sector, helping businesses manage shipments with
            unprecedented efficiency and accuracy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Button className="bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white rounded-full px-8 py-6">
              Get Started Now
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl shadow-md border border-gray-100 text-[#0F2F55] hover:bg-[#0F2F55]/5 rounded-full px-8 py-6"
            >
              Watch AI Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
