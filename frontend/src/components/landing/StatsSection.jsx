import React from "react";
import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import { use3DTilt } from "../../hooks/use3DTilt";

const StatCard = ({ value, suffix, label, delay, decimals = 0 }) => {
  const [countRef, count] = useCountUp(value, 2500, decimals);
  const tiltRef = use3DTilt(10, 1200);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        ref={tiltRef}
        className="relative p-8 glass-effect rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(97, 114, 243, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)",
          }}
        />

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(97, 114, 243, 0)",
              "0 0 20px 2px rgba(97, 114, 243, 0.3)",
              "0 0 0 0 rgba(97, 114, 243, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="relative z-10">
          <motion.div
            className="text-5xl md:text-6xl font-bold mb-2"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          >
            <span className="text-gradient">{count}</span>
            <span className="text-gradient">{suffix}</span>
          </motion.div>
          <p className="text-gray-600 text-lg font-medium">{label}</p>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: 10000, suffix: "+", label: "Active Users", decimals: 0 },
    { value: 50000, suffix: "+", label: "Workflows Created", decimals: 0 },
    { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
    { value: 2.5, suffix: "M+", label: "Tasks Automated", decimals: 1 },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-accent-200 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full"
          >
            By The Numbers
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Teams
            <span className="text-gradient"> Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses automating their workflows and scaling
            their operations with AgentGarden.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
