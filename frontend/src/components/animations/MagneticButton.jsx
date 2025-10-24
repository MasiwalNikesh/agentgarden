import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Magnetic Button Component
 * Button that gets attracted to cursor with smooth animations
 */
const MagneticButton = ({
  children,
  className = "",
  strength = 0.4,
  onClick,
  ...props
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const pull = 1 - distance / maxDistance;
      setPosition({
        x: deltaX * strength * pull,
        y: deltaY * strength * pull,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      <motion.span
        className="relative z-10"
        animate={{
          x: position.x * 0.3,
          y: position.y * 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default MagneticButton;
