import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const CTASection = () => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 animate-gradient" />

      {/* Animated shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 shadow-2xl">
              <span className="text-white font-semibold">
                🚀 Start your free trial today - No credit card required
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Ready to automate
            <br />
            <span className="relative">
              your workflow?
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-2 left-0 w-full h-3 bg-white/30 -z-10"
              />
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed"
          >
            Join thousands of teams building smarter with AI.
            <br />
            Start free, scale as you grow.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white text-primary-700 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all group"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </span>
              </motion.button>
            </Link>

            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-white/10 backdrop-blur-lg text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Schedule a Demo
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8"
          >
            {[
              { icon: '✓', text: 'Free 14-day trial' },
              { icon: '✓', text: 'No credit card required' },
              { icon: '✓', text: 'Cancel anytime' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="flex items-center gap-2 text-white/90"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-sm font-bold">{item.icon}</span>
                </div>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating cards */}
          <div className="relative mt-20">
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto border border-white/20"
            >
              <div className="grid grid-cols-3 gap-8 text-white">
                {[
                  { value: '99.9%', label: 'Uptime' },
                  { value: '<100ms', label: 'Response Time' },
                  { value: '150+', label: 'Countries' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <h4 className="text-3xl font-bold mb-2">{stat.value}</h4>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Decorative floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-8 -left-8 w-24 h-24 bg-white/20 rounded-2xl backdrop-blur-sm hidden lg:block"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm hidden lg:block"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-24 fill-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,0 C150,80 350,80 600,60 C850,40 1050,80 1200,0 L1200,120 L0,120 Z"
            initial={{ d: 'M0,0 C150,80 350,80 600,60 C850,40 1050,80 1200,0 L1200,120 L0,120 Z' }}
            animate={{
              d: [
                'M0,0 C150,80 350,80 600,60 C850,40 1050,80 1200,0 L1200,120 L0,120 Z',
                'M0,20 C150,60 350,60 600,80 C850,60 1050,60 1200,20 L1200,120 L0,120 Z',
                'M0,0 C150,80 350,80 600,60 C850,40 1050,80 1200,0 L1200,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>
    </section>
  );
};

export default CTASection;
