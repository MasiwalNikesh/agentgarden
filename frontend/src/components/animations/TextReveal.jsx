import React from "react";
import { motion } from "framer-motion";

/**
 * Text Reveal Animation Component
 * Reveals text word by word or character by character with customizable effects
 */

export const TextRevealByWord = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const TextRevealByCharacter = ({ text, className = "", delay = 0 }) => {
  const characters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "inline-flex" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const TextSlideUp = ({ text, className = "", delay = 0 }) => {
  return (
    <div style={{ overflow: "hidden" }} className={className}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

export const TextGradientReveal = ({ text, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ backgroundPosition: "200% center" }}
      whileInView={{ backgroundPosition: "0% center" }}
      viewport={{ once: true }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeInOut",
      }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)",
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};
