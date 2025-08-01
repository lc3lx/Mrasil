
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  connections: number[];
  pulseDelay: number;
}

interface AIVisualizerProps {
  className?: string;
  height?: number;
  density?: "low" | "medium" | "high";
  theme?: "blue" | "purple" | "gradient";
  animate?: boolean;
}

export function AIVisualizer({
  className = "",
  height = 400,
  density = "medium",
  theme = "gradient",
  animate = true
}: AIVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Colors based on theme
  const getNodeColor = (index: number) => {
    if (theme === "blue") return "rgba(56, 114, 250, 0.8)";
    if (theme === "purple") return "rgba(124, 58, 237, 0.8)";
    
    // Gradient theme - multiple colors based on position
    const colors = [
      "rgba(56, 114, 250, 0.8)",
      "rgba(124, 58, 237, 0.8)",
      "rgba(79, 70, 229, 0.8)",
      "rgba(16, 185, 129, 0.8)"
    ];
    return colors[index % colors.length];
  };
  
  const getLineGradient = () => {
    if (theme === "blue") return "linear-gradient(90deg, rgba(56, 114, 250, 0.3), rgba(56, 114, 250, 0.1))";
    if (theme === "purple") return "linear-gradient(90deg, rgba(124, 58, 237, 0.3), rgba(124, 58, 237, 0.1))";
    return "linear-gradient(90deg, rgba(56, 114, 250, 0.3), rgba(124, 58, 237, 0.3))";
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;
    
    const width = containerRef.current.offsetWidth;
    
    // Determine number of nodes based on density
    let nodeCount = 15;
    if (density === "low") nodeCount = 10;
    if (density === "high") nodeCount = 25;
    
    // Create nodes
    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Create nodes with more structured positioning for a neural network feel
      // Layer-based positioning for more structured neural network
      const layer = Math.floor(i / 5); // Divide nodes into layers
      const layerPosition = i % 5; // Position within layer
      
      // Calculate x position based on layer
      const xPercentage = (layer + 1) / (Math.ceil(nodeCount / 5) + 1);
      const x = width * xPercentage;
      
      // Calculate y position based on position within layer
      const layerHeight = height * 0.8; // Use 80% of height for nodes
      const yOffset = height * 0.1; // 10% padding top and bottom
      const ySpacing = layerHeight / (layerPosition + 1);
      const y = yOffset + (ySpacing * (layerPosition + 1));
      
      newNodes.push({
        id: i,
        x,
        y,
        radius: Math.random() * 8 + 4, // Random size between 4-12px
        connections: [],
        pulseDelay: Math.random() * 2
      });
    }
    
    // Add connections
    newNodes.forEach((node, index) => {
      // Connect to nodes in adjacent layers
      const layer = Math.floor(index / 5);
      const nextLayerStart = (layer + 1) * 5;
      const nextLayerEnd = Math.min(nextLayerStart + 5, nodeCount);
      
      // Connect each node to 2-4 nodes in the next layer
      if (nextLayerStart < nodeCount) {
        const connectionCount = Math.floor(Math.random() * 3) + 2; // 2-4 connections
        const connections = new Set<number>();
        
        while (connections.size < connectionCount && connections.size < (nextLayerEnd - nextLayerStart)) {
          const targetIndex = nextLayerStart + Math.floor(Math.random() * (nextLayerEnd - nextLayerStart));
          connections.add(targetIndex);
        }
        
        node.connections = Array.from(connections);
      }
    });
    
    setNodes(newNodes);
  }, [isClient, density, height]);

  if (!isClient) return <div className={`${className}`} style={{ height }} />;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`} 
      style={{ height }}
    >
      <div className="absolute inset-0">
        {/* Lines (connections) */}
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((node) => 
            node.connections.map((targetId, i) => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;
              
              return (
                <g key={`${node.id}-${targetId}`}>
                  <motion.line
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={getLineGradient()}
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ 
                      duration: 1.5,
                      delay: 0.5 + (node.id * 0.1)
                    }}
                  />
                  {animate && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={3}
                      fill="white"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: [node.x, target.x],
                        y: [node.y, target.y]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 1 + node.pulseDelay,
                        repeat: Infinity,
                        repeatDelay: 3 + Math.random() * 2
                      }}
                    />
                  )}
                </g>
              );
            })
          )}
        </svg>
        
        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full shadow-lg shadow-blue-500/20"
            style={{
              left: node.x,
              top: node.y,
              width: node.radius * 2,
              height: node.radius * 2,
              marginLeft: -node.radius,
              marginTop: -node.radius,
              background: getNodeColor(index)
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 + (node.id * 0.05) }}
          >
            {animate && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: getNodeColor(index) }}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.8, 0], scale: [1, 1.8, 2.2] }}
                transition={{
                  duration: 2,
                  delay: node.pulseDelay,
                  repeat: Infinity,
                  repeatDelay: 3 + Math.random() * 3
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
