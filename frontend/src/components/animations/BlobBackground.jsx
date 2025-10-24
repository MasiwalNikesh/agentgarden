import React from "react";
import { motion } from "framer-motion";

/**
 * Animated Blob/Liquid Background Component
 * Creates organic, flowing background animations
 */
const BlobBackground = ({ className = "" }) => {
  const blobs = [
    {
      size: "w-96 h-96",
      color: "bg-primary-300",
      position: "top-0 -left-20",
      duration: 20,
      path: { x: [0, 100, -50, 0], y: [0, -50, 100, 0] },
      scale: [1, 1.2, 0.9, 1],
    },
    {
      size: "w-[28rem] h-[28rem]",
      color: "bg-accent-300",
      position: "top-20 right-10",
      duration: 25,
      path: { x: [0, -80, 60, 0], y: [0, 80, -40, 0] },
      scale: [1, 1.3, 1.1, 1],
    },
    {
      size: "w-80 h-80",
      color: "bg-primary-400",
      position: "bottom-10 left-1/4",
      duration: 22,
      path: { x: [0, 50, -100, 0], y: [0, 100, -50, 0] },
      scale: [1, 0.9, 1.2, 1],
    },
    {
      size: "w-[32rem] h-[32rem]",
      color: "bg-accent-200",
      position: "bottom-20 right-1/4",
      duration: 28,
      path: { x: [0, -60, 80, 0], y: [0, -80, 60, 0] },
      scale: [1, 1.1, 0.95, 1],
    },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute ${blob.size} ${blob.color} ${blob.position} rounded-full mix-blend-multiply filter blur-3xl opacity-20`}
          animate={{
            x: blob.path.x,
            y: blob.path.y,
            scale: blob.scale,
            rotate: [0, 360],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional morphing blobs */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(97, 114, 243, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default BlobBackground;
