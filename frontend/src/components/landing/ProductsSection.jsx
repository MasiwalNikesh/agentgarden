import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductsSection = () => {
  const products = [
    {
      id: "leadgen-pro",
      name: "LeadGen Pro",
      tagline: "AI-Powered Lead Generation & Amplification",
      description:
        "Transform your sales pipeline with intelligent lead discovery, qualification, and nurturing. Our AI agent identifies high-value prospects, enriches contact data, and automates personalized outreach at scale.",
      icon: "/img/product-trio-1.png",
      color: "blue",
      features: [
        "Automated prospect identification",
        "Contact data enrichment",
        "Personalized outreach campaigns",
        "Lead scoring and qualification",
        "CRM integration and sync",
        "Performance analytics",
      ],
      pricing: "Premium",
      cta: "Start Lead Generation",
      popular: true,
    },
    {
      id: "hr-recruiter",
      name: "HR Recruiter - Flows",
      tagline: "Intelligent Recruitment Automation",
      description:
        "Revolutionize your hiring process with AI-powered candidate sourcing, screening, and interview scheduling. Handle high-volume recruitment with intelligent workflows that never sleep.",
      icon: "/img/product-trio-2.png",
      color: "purple",
      features: [
        "Automated candidate sourcing",
        "AI resume screening",
        "Interview scheduling",
        "Candidate communication",
        "ATS integration",
        "Recruitment analytics",
      ],
      pricing: "Standard",
      cta: "Deploy HR Agent",
      popular: true,
    },
    {
      id: "calendly-solution",
      name: "Smart Scheduler - Freemium",
      tagline: "AI-Powered Meeting Coordination",
      description:
        "Never miss another meeting with our intelligent scheduling assistant. Automatically coordinate calendars, send reminders, and optimize meeting times across time zones.",
      icon: "/img/product-trio-3.png",
      color: "green",
      features: [
        "Smart calendar coordination",
        "Multi-timezone scheduling",
        "Automated reminders",
        "Meeting optimization",
        "Integration with all calendars",
        "Free tier available",
      ],
      pricing: "Freemium",
      cta: "Try Free",
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "from-blue-500 to-blue-600",
        text: "text-blue-700",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
      },
      purple: {
        bg: "from-purple-500 to-purple-600",
        text: "text-purple-700",
        border: "border-purple-200",
        badge: "bg-purple-100 text-purple-700",
      },
      green: {
        bg: "from-green-500 to-green-600",
        text: "text-green-700",
        border: "border-green-200",
        badge: "bg-green-100 text-green-700",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
            Our Agent Garden
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Three Powerful{" "}
            <span className="text-gradient">Agent Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our specialized agent products designed for different
            business needs. From lead generation to recruitment to scheduling—we
            have the perfect agent for you. Pick existing agents or plant new
            ones in your garden.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const colors = getColorClasses(product.color);
            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`glass-effect rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border ${colors.border} relative`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4">
                    <img
                      src={product.icon}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className={`text-lg font-semibold ${colors.text} mb-4`}>
                    {product.tagline}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.bg}`}
                        ></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}
                  >
                    {product.pricing}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {product.pricing === "Freemium" ? "Free" : "Custom"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.pricing === "Freemium"
                        ? "Tier Available"
                        : "Pricing"}
                    </div>
                  </div>
                </div>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 bg-gradient-to-r ${colors.bg} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all`}
                  >
                    {product.cta}
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Agent?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Our agents can be customized for any business workflow. Plant a
              new agent in your garden or contact us to discuss your specific
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Building Free
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 glass-effect text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
