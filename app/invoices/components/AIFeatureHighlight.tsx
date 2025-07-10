
import { useState } from "react";
import { motion } from "framer-motion";
import { AIVisualizer } from "./AIVisualizer";
import { MarasilRobot } from "./MarasilRobot";

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

export function AIFeatureHighlight() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features: AIFeature[] = [
    {
      id: "predictive",
      title: "Predictive Analytics",
      description: "AI algorithms analyze historical shipping data to predict optimal delivery routes, reducing transit time by up to 28%.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 7.5L18.5 5L16 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 16.5L5.5 19L8 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.5 5V16.5C18.5 17.8807 17.3807 19 16 19H5.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "dynamic",
      title: "Dynamic Rerouting",
      description: "Real-time traffic and weather analysis automatically adjusts routes for maximum efficiency and on-time delivery.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4.5H5.5C4.11929 4.5 3 5.61929 3 7V17C3 18.3807 4.11929 19.5 5.5 19.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 19.5H18.5C19.8807 19.5 21 18.3807 21 17V7C21 5.61929 19.8807 4.5 18.5 4.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 9.5L12 13.5L16 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 4.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "demand",
      title: "Demand Forecasting",
      description: "Machine learning models analyze market trends to predict shipping demand, optimizing resource allocation.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="relative py-20 px-4 overflow-hidden bg-[#F3F6FA]">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)",
            transform: "translate(30%, -30%)"
          }}
        ></div>
        
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(15,47,85,0.2) 0%, rgba(0,0,0,0) 70%)",
            transform: "translate(-30%, 30%)"
          }}
        ></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0F2F55] to-[#3B82F6]">
            Powered by Advanced AI
          </h2>
          <p className="text-[#0F2F55]/70 max-w-2xl mx-auto">
            Our artificial intelligence systems continuously learn and adapt to optimize your logistics operations in ways that weren't possible before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Robot - Larger Version */}
          <div className="hidden md:flex justify-center">
            <div className="relative p-4">
              <MarasilRobot size={350} animated={true} />
              
              <motion.div
                className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-[#0F2F55]/10 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1
                }}
              >
                <div className="text-xs text-[#0F2F55]/80">Neural Processing</div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-[#0F2F55]/10 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 2
                }}
              >
                <div className="text-xs text-[#0F2F55]/80">Data Analysis</div>
              </motion.div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? "bg-white/80 backdrop-blur-sm border border-[#0F2F55]/10 shadow-sm" 
                    : "bg-white/50 border border-[#0F2F55]/5 hover:bg-white/70 hover:border-[#0F2F55]/10"
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ x: activeFeature === index ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    activeFeature === index 
                      ? "bg-[#0F2F55]/10 text-[#0F2F55]" 
                      : "bg-[#3B82F6]/10 text-[#3B82F6]"
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0F2F55]">
                      {feature.title}
                    </h3>
                    <p className="text-[#0F2F55]/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile Robot */}
          <div className="md:hidden flex justify-center mt-8">
            <MarasilRobot size={300} animated={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
