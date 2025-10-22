import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { getPopularTemplates } from "../../data/agentTemplates";

const TemplateCard = ({ template, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="relative group cursor-pointer"
    >
      <div className="h-full p-8 glass-effect rounded-2xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-100">
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {template.icon.startsWith("/img/") ? (
            <img
              src={template.icon}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">{template.icon}</span>
          )}
        </motion.div>

        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-4">
          {template.category}
        </span>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {template.name}
        </h3>
        <p className="text-sm text-accent-600 font-semibold mb-3">
          {template.tagline}
        </p>
        <p className="text-gray-600 leading-relaxed mb-6">
          {template.description}
        </p>

        {/* Capabilities */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            KEY CAPABILITIES:
          </p>
          <ul className="space-y-2">
            {template.capabilities.slice(0, 3).map((capability, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <svg
                  className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {capability}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Use This Blueprint
        </motion.button>

        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(97, 114, 243, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
};

const TemplateShowcase = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const popularTemplates = getPopularTemplates();

  return (
    <section
      id="templates"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
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
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full"
          >
            Pre-Built Agent Templates
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kick Off with Pre-Configured
            <span className="text-gradient"> AI Assistants</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our library of ready-made templates tailored to common
            business needs. Deploy in minutes, customize to your requirements.
          </p>
        </motion.div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Templates CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-white text-gray-900 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-primary-600"
          >
            View All Templates →
          </motion.button>
          <p className="mt-4 text-sm text-gray-600">
            6 templates available • More coming soon
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { value: "10K+", label: "Agents Deployed" },
            { value: "6", label: "Agent Templates" },
            { value: "95%", label: "Success Rate" },
            { value: "24/7", label: "Always Running" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 glass-effect rounded-2xl"
            >
              <h3 className="text-3xl font-bold text-gradient mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
