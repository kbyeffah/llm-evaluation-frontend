'use client';
import { cn } from '../utils/cn';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

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

  return (
    <div
      className={cn(
        'relative min-h-screen flex items-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 justify-center w-full group overflow-hidden',
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Wave Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2), transparent 50%),
            url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%236366f1" fill-opacity="0.3" d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,186.7C672,181,768,171,864,149.3C960,128,1056,96,1152,85.3C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E')
          `,
          backgroundSize: 'cover, 100% 100%',
          backgroundPosition: 'center, 0 0',
        }}
        animate={{
          backgroundPosition: ['center, 0 0', 'center, 100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />

      {/* Aurora Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3), transparent 70%), radial-gradient(circle at 70% 70%, rgba(31, 118, 106, 0.3), transparent 70%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3), transparent 70%), radial-gradient(circle at 70% 70%, rgba(31, 118, 106, 0.3), transparent 70%)',
            'radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.2), transparent 70%), radial-gradient(circle at 60% 60%, rgba(31, 118, 106, 0.2), transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3), transparent 70%), radial-gradient(circle at 70% 70%, rgba(31, 118, 106, 0.3), transparent 70%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Particle Effect */}
      <ParticleEffect mouseX={mouseX} mouseY={mouseY} />

      <div className={cn('relative z-20', className)}>{children}</div>
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
      }}
      animate={{
        backgroundSize: '100% 100%',
      }}
      transition={{
        duration: 2,
        ease: 'linear',
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={cn(
        'relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-teal-800',
        className
      )}
    >
      {children}
    </motion.span>
  );
};

// Particle Effect Component
const ParticleEffect = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    // Initialize particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();
      });

      // Draw lines between particles near the mouse
      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();

      particles.forEach((particleA, i) => {
        particles.slice(i + 1).forEach((particleB) => {
          const distanceToMouseA = Math.sqrt(
            (particleA.x - mouseXVal) ** 2 + (particleA.y - mouseYVal) ** 2
          );
          const distanceToMouseB = Math.sqrt(
            (particleB.x - mouseXVal) ** 2 + (particleB.y - mouseYVal) ** 2
          );

          if (distanceToMouseA < 150 && distanceToMouseB < 150) {
            const distance = Math.sqrt(
              (particleA.x - particleB.x) ** 2 + (particleA.y - particleB.y) ** 2 // Fixed typo: particle263.y -> particleA.y
            );
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particleA.x, particleA.y);
              ctx.lineTo(particleB.x, particleB.y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 100})`;
              ctx.stroke();
            }
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Update canvas size
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
      className="absolute inset-0 pointer-events-none"
    />
  );
};