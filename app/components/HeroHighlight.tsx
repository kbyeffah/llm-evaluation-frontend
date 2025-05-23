'use client';
import { cn } from '../utils/cn';
import { useMotionValue, motion, useMotionTemplate, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(300px circle at ${mouseX}px ${mouseY}px, 
      rgba(14, 165, 233, 0.15), 
      rgba(99, 102, 241, 0.1), 
      transparent 80%)
  `;

  return (
    <div
      className={cn(
        'relative min-h-screen flex items-center justify-center w-full group overflow-hidden bg-black',
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Mesh Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20" />
      </motion.div>

      {/* Dynamic Gradient Orbs */}
      <motion.div
        className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, -50, 0],
          y: [0, -200, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Mouse Follow Effect */}
      <motion.div
        className="absolute inset-0 opacity-40 transition duration-300"
        style={{ background }}
      />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Neural Network Lines */}
      <NeuralNetwork mouseX={mouseX} mouseY={mouseY} />

      {/* Content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={cn('relative z-20', className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: '0% 100%',
        backgroundPosition: 'left center',
      }}
      animate={{
        backgroundSize: '100% 100%',
      }}
      whileHover={{
        backgroundSize: '110% 100%',
      }}
      transition={{
        duration: 2,
        ease: [0.4, 0.0, 0.2, 1],
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: 'no-repeat',
        display: 'inline',
      }}
      className={cn(
        'relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-white font-bold',
        className
      )}
    >
      <motion.span
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  const elements = Array.from({ length: 6 }, (_, i) => i);

  return (
    <>
      {elements.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

// Neural Network Component
const NeuralNetwork = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
    }> = [];

    // Initialize nodes
    const nodeCount = 25;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        connections: [],
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Mouse attraction
        const distToMouse = Math.sqrt(
          (node.x - mouseXVal) ** 2 + (node.y - mouseYVal) ** 2
        );
        
        if (distToMouse < 200) {
          const force = (200 - distToMouse) / 200;
          const angle = Math.atan2(mouseYVal - node.y, mouseXVal - node.x);
          node.vx += Math.cos(angle) * force * 0.02;
          node.vy += Math.sin(angle) * force * 0.02;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${distToMouse < 200 ? 0.8 : 0.4})`;
        ctx.fill();
      });

      // Draw connections
      nodes.forEach((nodeA, i) => {
        nodes.slice(i + 1).forEach((nodeB) => {
          const distance = Math.sqrt(
            (nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2
          );
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.6 - distance / 250})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
};