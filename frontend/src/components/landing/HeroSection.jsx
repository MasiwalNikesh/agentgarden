import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useParallax } from "../../hooks/useScrollAnimation";
import { TextRevealByWord } from "../animations/TextReveal";
import MagneticButton from "../animations/MagneticButton";
import BlobBackground from "../animations/BlobBackground";

const HeroSection = () => {
  const parallaxOffset = useParallax(0.3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24">
      {/* Animated blob background */}
      <BlobBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-700 shadow-sm">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
                AgentGarden - Your Digital Garden of Agents
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <TextRevealByWord
                text="Meet Your Garden of Agents"
                className="inline-block"
              />
              <span className="block text-gradient">
                <TextRevealByWord
                  text="Ready to Work 24/7"
                  delay={0.4}
                  className="inline-block"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Deploy specialized agents that work like your best employees. From
              lead generation to HR recruitment to scheduling—our agents handle
              complex workflows with human-like intelligence and never-ending
              dedication. Pick from existing agents or plant new ones in your
              digital garden.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/register">
                <MagneticButton
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                  strength={0.3}
                >
                  Start Building Free
                </MagneticButton>
              </Link>
              <a href="#demo">
                <MagneticButton
                  className="px-8 py-4 glass-effect text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all text-center"
                  strength={0.25}
                >
                  Watch Demo
                </MagneticButton>
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  10,000+ Users Building Workflows
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - AI Employee Cards */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Alfred - AI Executive Assistant */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute top-0 right-0 w-80 h-56 glass-effect rounded-2xl shadow-xl p-6 border border-purple-200"
              style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/img/alex.png"
                    alt="Alex - AI Executive Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-purple-700 text-lg">Alex</h3>
                  <p className="text-sm text-gray-600">
                    AI Executive Assistant
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  What I can do:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Schedule Calendar",
                    "Prioritize Tasks",
                    "Reply to Emails",
                    "Takes Notes",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  and hundreds more skills...
                </p>
              </div>
            </motion.div>

            {/* Chip - AI Sales Representative */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute top-32 left-0 w-72 h-56 glass-effect rounded-2xl shadow-xl p-6 border border-blue-200"
              style={{ transform: `translateY(${parallaxOffset * 0.8}px)` }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/img/max.png"
                    alt="Max - AI Sales Representative"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 text-lg">Max</h3>
                  <p className="text-sm text-gray-600">
                    AI Sales Representative
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  What I can do:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Update CRM",
                    "Chase Opportunities",
                    "Find Leads",
                    "Personalized Outreach",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  and hundreds more skills...
                </p>
              </div>
            </motion.div>

            {/* Clide - AI Customer Support Specialist */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute bottom-24 right-12 w-64 h-56 glass-effect rounded-2xl shadow-xl p-6 border border-red-200"
              style={{ transform: `translateY(${parallaxOffset * 0.6}px)` }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/img/luna.png"
                    alt="Luna - AI Customer Support Specialist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-red-700 text-lg">Luna</h3>
                  <p className="text-sm text-gray-600">AI Customer Support</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  What I can do:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Respond to Tickets",
                    "Escalate Issues",
                    "Take Actions",
                    "Solve Problems",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  and hundreds more skills...
                </p>
              </div>
            </motion.div>

            {/* Suki - AI Marketing Associate */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute bottom-0 left-8 w-72 h-48 glass-effect rounded-2xl shadow-xl p-6 border border-yellow-200"
              style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/img/nova.png"
                    alt="Nova - AI Marketing Associate"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-700 text-lg">Nova</h3>
                  <p className="text-sm text-gray-600">
                    AI Marketing Associate
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  What I can do:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Write Blog Posts",
                    "Run SEO",
                    "Manage Social Media",
                    "Write with Brand Voice",
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  and hundreds more skills...
                </p>
              </div>
            </motion.div>
          </div>

          {/* Mobile AI Agent Cards */}
          <div className="lg:hidden mt-12">
            <div className="grid grid-cols-2 gap-4">
              {/* Alex - AI Executive Assistant */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl shadow-lg p-4 border border-purple-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src="/img/alex.png"
                      alt="Alex - AI Executive Assistant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-700 text-sm">Alex</h3>
                    <p className="text-xs text-gray-600">Executive Assistant</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    What I can do:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["Schedule", "Tasks", "Emails", "Notes"].map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Max - AI Sales Representative */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl shadow-lg p-4 border border-blue-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src="/img/max.png"
                      alt="Max - AI Sales Representative"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-700 text-sm">Max</h3>
                    <p className="text-xs text-gray-600">Sales Rep</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    What I can do:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["CRM", "Leads", "Outreach", "Follow-up"].map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Luna - AI Customer Support */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl shadow-lg p-4 border border-red-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src="/img/luna.png"
                      alt="Luna - AI Customer Support"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-700 text-sm">Luna</h3>
                    <p className="text-xs text-gray-600">Support</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    What I can do:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["Tickets", "Issues", "Actions", "Solutions"].map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Nova - AI Marketing Associate */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl shadow-lg p-4 border border-yellow-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src="/img/nova.png"
                      alt="Nova - AI Marketing Associate"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-700 text-sm">Nova</h3>
                    <p className="text-xs text-gray-600">Marketing</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    What I can do:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["Blogs", "SEO", "Social", "Brand"].map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
