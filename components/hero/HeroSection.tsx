'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CounterProps {
  targetValue: number;
  suffix: string;
  duration?: number;
}

const AnimatedCounter = ({ targetValue, suffix, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentCount = progress * targetValue;
      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [targetValue, duration]);

  return (
    <span className="font-mono">
      {targetValue < 1 ? count.toFixed(2) : Math.floor(count).toLocaleString()}{suffix}
    </span>
  );
};

const TreeAnimation = () => {
  const forestRef = useRef<SVGSVGElement>(null);
  const fallingLeavesRef = useRef<{ id: string; x: number; y: number; vx: number; vy: number; rotation: number; opacity: number; size: number; color: string }[]>([]);

  useEffect(() => {
    let animationId: number;
    let time = 0;

    // Define trees in the forest - positioned higher up around the text area
    const trees = [
      { x: 120, y: 250, scale: 1.2, delay: 0 },
      { x: 280, y: 280, scale: 1.5, delay: 1000 },
      { x: 450, y: 260, scale: 1.3, delay: 500 },
      { x: 620, y: 270, scale: 1.4, delay: 1500 },
      { x: 750, y: 240, scale: 1.0, delay: 800 },
      { x: 50, y: 290, scale: 0.9, delay: 1200 },
      { x: 200, y: 220, scale: 1.1, delay: 300 },
      { x: 550, y: 300, scale: 1.2, delay: 700 },
      { x: 700, y: 250, scale: 1.3, delay: 1100 },
    ];

    const leafColors = ['#6275e5', '#7d9df7', '#8ba3f2', '#a5b9f7', '#5E6AD2'];

    const animateForest = () => {
      time += 16; // 60fps

      if (forestRef.current) {
        trees.forEach((tree, treeIndex) => {
          const adjustedTime = Math.max(0, time - tree.delay);
          const treeElement = forestRef.current?.querySelector(`#tree-${treeIndex}`);
          
          if (treeElement && adjustedTime > 0) {
            const deathProgress = Math.min(adjustedTime / 4000, 1); // 4 seconds to die
            
            // Animate tree elements
            const leaves = treeElement.querySelectorAll('.tree-leaf');
            const branches = treeElement.querySelectorAll('.tree-branch');
            const trunk = treeElement.querySelector('.tree-trunk');

            // Create falling leaves periodically
            if (deathProgress > 0.1 && Math.random() < 0.15 && adjustedTime % 200 < 16) {
              leaves.forEach((leaf, leafIndex) => {
                if (Math.random() < 0.3) { // 30% chance each leaf falls
                  const leafRect = leaf.getBoundingClientRect();
                  const svgRect = forestRef.current!.getBoundingClientRect();
                  
                  fallingLeavesRef.current.push({
                    id: `falling-${treeIndex}-${leafIndex}-${time}`,
                    x: tree.x + (Math.random() - 0.5) * 80 * tree.scale,
                    y: tree.y - 200 * tree.scale + (Math.random() - 0.5) * 60,
                    vx: (Math.random() - 0.5) * 3,
                    vy: Math.random() * 1.5 + 0.5,
                    rotation: Math.random() * 360,
                    opacity: 0.9,
                    size: Math.random() * 12 + 6,
                    color: leafColors[Math.floor(Math.random() * leafColors.length)]
                  });
                }
              });
            }

            // Fade out leaves on tree
            leaves.forEach((leaf, i) => {
              const leafFade = Math.max(0, 1 - deathProgress * (1.2 + i * 0.1));
              leaf.setAttribute('opacity', String(leafFade * 0.7));
            });

            // Brown and thin the branches
            branches.forEach((branch, i) => {
              const branchFade = Math.max(0, 1 - deathProgress * (0.8 + i * 0.1));
              branch.setAttribute('opacity', String(branchFade * 0.9));
              branch.setAttribute('stroke', deathProgress > 0.5 ? '#8B4513' : '#8ba3f2');
            });

            // Fade trunk to brown
            if (trunk) {
              const trunkFade = Math.max(0.2, 1 - deathProgress * 0.6);
              trunk.setAttribute('opacity', String(trunkFade));
              trunk.setAttribute('fill', deathProgress > 0.3 ? '#8B4513' : '#5E6AD2');
            }
          }
        });

        // Update falling leaves
        const existingFallingLeaves = forestRef.current.querySelectorAll('.falling-leaf');
        existingFallingLeaves.forEach(leaf => leaf.remove());

        fallingLeavesRef.current = fallingLeavesRef.current.filter(leaf => {
          leaf.x += leaf.vx;
          leaf.y += leaf.vy;
          leaf.vy += 0.05; // gravity
          leaf.vx *= 0.99; // air resistance
          leaf.rotation += leaf.vx * 2;
          leaf.opacity -= 0.008;

          if (leaf.opacity > 0 && leaf.y < 600) {
            // Create falling leaf element
            const leafElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            leafElement.setAttribute('class', 'falling-leaf');
            leafElement.setAttribute('cx', String(leaf.x));
            leafElement.setAttribute('cy', String(leaf.y));
            leafElement.setAttribute('rx', String(leaf.size / 2));
            leafElement.setAttribute('ry', String(leaf.size / 3));
            leafElement.setAttribute('fill', leaf.color);
            leafElement.setAttribute('opacity', String(leaf.opacity));
            leafElement.setAttribute('transform', `rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`);
            forestRef.current!.appendChild(leafElement);
            return true;
          }
          return false;
        });
      }

      animationId = requestAnimationFrame(animateForest);
    };

    animateForest();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Generate forest trees - bigger and positioned higher
  const renderTree = (tree: any, index: number) => (
    <g key={index} id={`tree-${index}`} transform={`translate(${tree.x - 60}, ${tree.y - 200}) scale(${tree.scale})`}>
      {/* Tree shadow */}
      <ellipse cx="60" cy="180" rx={50 * tree.scale} ry="15" fill="#22242b" opacity="0.08"/>
      
      {/* Tree trunk */}
      <rect 
        className="tree-trunk"
        x="55" y="100" width="12" height="80" rx="6" 
        fill="#5E6AD2" 
        opacity="0.9"
      />
      
      {/* Main branches */}
      <path className="tree-branch" d="M60 110 Q30 70 10 90" stroke="#8ba3f2" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
      <path className="tree-branch" d="M60 110 Q90 65 110 90" stroke="#8ba3f2" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
      <path className="tree-branch" d="M60 130 Q35 110 20 125" stroke="#8ba3f2" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
      <path className="tree-branch" d="M60 130 Q85 110 100 130" stroke="#8ba3f2" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
      
      {/* Secondary branches */}
      <path className="tree-branch" d="M60 150 Q40 135 25 145" stroke="#8ba3f2" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
      <path className="tree-branch" d="M60 150 Q80 135 95 150" stroke="#8ba3f2" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
      
      {/* Main canopy - larger leaves */}
      <ellipse className="tree-leaf" cx="20" cy="75" rx="28" ry="20" fill="#6275e5" opacity="0.7"/>
      <ellipse className="tree-leaf" cx="100" cy="70" rx="25" ry="18" fill="#7d9df7" opacity="0.6"/>
      <ellipse className="tree-leaf" cx="60" cy="55" rx="35" ry="25" fill="#8ba3f2" opacity="0.8"/>
      
      {/* Side canopies */}
      <ellipse className="tree-leaf" cx="10" cy="90" rx="18" ry="12" fill="#a5b9f7" opacity="0.5"/>
      <ellipse className="tree-leaf" cx="110" cy="95" rx="20" ry="14" fill="#6275e5" opacity="0.6"/>
      <ellipse className="tree-leaf" cx="35" cy="40" rx="15" ry="10" fill="#5E6AD2" opacity="0.7"/>
      <ellipse className="tree-leaf" cx="85" cy="45" rx="18" ry="12" fill="#7d9df7" opacity="0.6"/>
      
      {/* Additional leaf clusters */}
      <ellipse className="tree-leaf" cx="25" cy="105" rx="16" ry="11" fill="#8ba3f2" opacity="0.5"/>
      <ellipse className="tree-leaf" cx="95" cy="110" rx="17" ry="12" fill="#a5b9f7" opacity="0.5"/>
      <ellipse className="tree-leaf" cx="50" cy="30" rx="12" ry="8" fill="#6275e5" opacity="0.6"/>
      <ellipse className="tree-leaf" cx="70" cy="35" rx="14" ry="9" fill="#5E6AD2" opacity="0.6"/>
    </g>
  );

  const trees = [
    { x: 120, y: 250, scale: 1.2, delay: 0 },
    { x: 280, y: 280, scale: 1.5, delay: 1000 },
    { x: 450, y: 260, scale: 1.3, delay: 500 },
    { x: 620, y: 270, scale: 1.4, delay: 1500 },
    { x: 750, y: 240, scale: 1.0, delay: 800 },
    { x: 50, y: 290, scale: 0.9, delay: 1200 },
    { x: 200, y: 220, scale: 1.1, delay: 300 },
    { x: 550, y: 300, scale: 1.2, delay: 700 },
    { x: 700, y: 250, scale: 1.3, delay: 1100 },
  ];

  return (
    <svg 
      ref={forestRef}
      viewBox="0 0 800 600" 
      fill="none" 
      className="w-full h-full" 
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Background forest silhouette */}
      <defs>
        <linearGradient id="forestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#101014" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      
      {/* Distant forest background - positioned higher */}
      <rect x="0" y="350" width="800" height="250" fill="url(#forestGradient)"/>
      
      {/* Main forest trees */}
      {trees.map((tree, index) => renderTree(tree, index))}
    </svg>
  );
};

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-[#101014] text-white overflow-hidden">
      {/* Animated Tree Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <TreeAnimation />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#101014]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        {/* Main Deforestation Rate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-[#5E6AD2] font-mono">
              <AnimatedCounter targetValue={1.03} suffix="%" />
            </span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-2xl md:text-3xl font-medium mb-4 text-white/80"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Annual deforestation rate in Somalia
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Somalia faces one of the world's highest deforestation rates, driven by charcoal production, 
            drought, and weak environmental governance.
          </motion.p>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#8ba3f2] mb-2 font-mono">
              <AnimatedCounter targetValue={686} suffix="K" />
            </div>
            <div className="text-sm text-white/70 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Hectares lost since 2000
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#7d9df7] mb-2 font-mono">
              <AnimatedCounter targetValue={218} suffix="" />
            </div>
            <div className="text-sm text-white/70 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Species threatened (IUCN)
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#6275e5] mb-2 font-mono">
              $<AnimatedCounter targetValue={47} suffix="M" />
            </div>
            <div className="text-sm text-white/70 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Annual charcoal exports
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.button 
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-[#5E6AD2] hover:bg-[#7d9df7] transition-all duration-300 text-white text-base shadow-lg border border-white/10"
            style={{ fontFamily: 'Inter, sans-serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const nextSection = document.getElementById('key-metrics');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore the Data</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}