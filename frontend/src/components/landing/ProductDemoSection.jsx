import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const ProductDemoSection = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  const [activeTab, setActiveTab] = useState(0);

  const demos = [
    {
      title: "Visual Workflow Editor",
      description:
        "Drag and drop nodes to create powerful AI workflows without writing a single line of code.",
      image: "🎨",
    },
    {
      title: "Real-time Execution",
      description:
        "Watch your agents work in real-time with live logs and instant feedback on every action.",
      image: "⚡",
    },
    {
      title: "Smart Integrations",
      description:
        "Connect seamlessly with your favorite tools and automate your entire workflow ecosystem.",
      image: "🔗",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-accent-700 bg-accent-100 rounded-full"
          >
            See it in action
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Design Workflows That
            <span className="text-gradient"> Deliver</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of visual AI automation with our intuitive
            interface.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {demos.map((demo, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 8 }}
                onClick={() => setActiveTab(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeTab === index
                    ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-xl"
                    : "glass-effect hover:bg-white/90"
                }`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ scale: activeTab === index ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl"
                  >
                    {demo.image}
                  </motion.div>
                  <div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        activeTab === index ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {demo.title}
                    </h3>
                    <p
                      className={`${
                        activeTab === index ? "text-white/90" : "text-gray-600"
                      }`}
                    >
                      {demo.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right side - Demo visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[600px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Mock UI Container */}
                <div className="h-full glass-effect rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  {/* Mock Browser Chrome */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-gray-600">
                      app.youragent.ai/workflows
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-white h-full">
                    {activeTab === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Node connections */}
                        <div className="flex items-center gap-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg flex items-center justify-center"
                          >
                            <span className="text-2xl">🎯</span>
                          </motion.div>
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4 }}
                            className="h-1 w-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded"
                          />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl shadow-lg flex items-center justify-center"
                          >
                            <span className="text-2xl">⚙️</span>
                          </motion.div>
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8 }}
                            className="h-1 w-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded"
                          />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 }}
                            className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg flex items-center justify-center"
                          >
                            <span className="text-2xl">✅</span>
                          </motion.div>
                        </div>

                        {/* Info cards */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="mt-8 space-y-3"
                        >
                          {[
                            "Trigger: New email received",
                            "Action: Process with AI",
                            "Output: Send response",
                          ].map((text, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 1.4 + i * 0.1 }}
                              className="p-4 bg-white rounded-lg shadow-md"
                            >
                              <p className="text-sm text-gray-700">{text}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Execution log */}
                        {[
                          {
                            status: "success",
                            text: "Workflow initialized",
                            time: "0.2s",
                          },
                          {
                            status: "success",
                            text: "Data fetched successfully",
                            time: "0.5s",
                          },
                          {
                            status: "processing",
                            text: "Processing with AI...",
                            time: "1.2s",
                          },
                          {
                            status: "pending",
                            text: "Sending response",
                            time: "-",
                          },
                        ].map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                log.status === "success"
                                  ? "bg-green-500"
                                  : log.status === "processing"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {log.text}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {log.time}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          {
                            name: "Gmail",
                            icon: "📧",
                            color: "from-red-400 to-red-600",
                          },
                          {
                            name: "Slack",
                            icon: "💬",
                            color: "from-purple-400 to-purple-600",
                          },
                          {
                            name: "HubSpot",
                            icon: "📊",
                            color: "from-orange-400 to-orange-600",
                          },
                          {
                            name: "Calendar",
                            icon: "📅",
                            color: "from-blue-400 to-blue-600",
                          },
                        ].map((integration, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className={`p-6 bg-gradient-to-br ${integration.color} rounded-2xl shadow-xl cursor-pointer`}
                          >
                            <div className="text-4xl mb-2">
                              {integration.icon}
                            </div>
                            <p className="text-white font-semibold">
                              {integration.name}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full blur-2xl opacity-30"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full blur-2xl opacity-30"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoSection;
