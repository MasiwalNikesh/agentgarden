/**
 * 404 Not Found Page
 * Modern animated 404 page with AgentGarden branding
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-4 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-bold text-gray-900">
                    AgentGarden
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    AI Automation Platform
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* 404 Number */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.h1
                className="text-[180px] md:text-[240px] font-bold leading-none text-gradient bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                404
              </motion.h1>
            </motion.div>

            {/* Error Message */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Oops! The page you're looking for seems to have wandered off into
              the digital void. Don't worry, even our AI agents get lost
              sometimes.
            </motion.p>

            {/* Floating Error Icon */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="inline-block mb-8"
            >
              <div className="glass-effect rounded-full p-8 shadow-xl">
                <svg
                  className="w-24 h-24 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                >
                  Go Home
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(-1)}
                className="px-8 py-4 glass-effect text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all"
              >
                Go Back
              </motion.button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  ),
                  title: "Dashboard",
                  description: "View your agents",
                  link: "/dashboard",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  ),
                  title: "Templates",
                  description: "Browse agent templates",
                  link: "/#templates",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ),
                  title: "Help",
                  description: "Get support",
                  link: "/#testimonials",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={item.link}
                    className="glass-effect rounded-xl p-6 block hover:bg-white/90 transition-all group"
                  >
                    <div className="text-primary-600 mb-3 group-hover:scale-110 transition-transform inline-block">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Fun Message */}
            <motion.div
              variants={itemVariants}
              className="mt-12 p-4 glass-effect rounded-xl max-w-2xl mx-auto"
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Fun fact:</span> While you're
                here, our AI agents are working hard automating workflows,
                scheduling meetings, and making the digital world a better
                place. 🤖✨
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator removed since no scrolling needed */}
    </div>
  );
};

export default NotFound;
