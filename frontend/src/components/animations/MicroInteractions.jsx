import React from "react";
import { motion } from "framer-motion";

/**
 * Collection of Micro-interaction Components
 * Small, delightful animations that enhance user experience
 */

// Ripple effect button
export const RippleButton = ({ children, className = "", onClick }) => {
  const [ripples, setRipples] = React.useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = { x, y, id: Date.now() };

    setRipples([...ripples, ripple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={addRipple}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 40, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </motion.button>
  );
};

// Shimmer effect
export const ShimmerCard = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
    >
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        variants={{
          hover: {
            translateX: ["100%", "100%"],
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          },
        }}
      />
    </motion.div>
  );
};

// Bounce on hover
export const BounceIcon = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: [0, -10, 0],
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Pulse effect
export const PulseIndicator = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="w-3 h-3 bg-primary-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-3 h-3 bg-primary-400 rounded-full"
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
};

// Glowing border on hover
export const GlowCard = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl opacity-0 blur"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 0.75 },
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
};

// Floating animation
export const FloatingElement = ({
  children,
  className = "",
  intensity = 10,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Reveal on hover
export const RevealOnHover = ({ children, revealContent, className = "" }) => {
  return (
    <motion.div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {revealContent}
      </motion.div>
    </motion.div>
  );
};

// Stagger fade in children
export const StaggerChildren = ({ children, className = "" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};
