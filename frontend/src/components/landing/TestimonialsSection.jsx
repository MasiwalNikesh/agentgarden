import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TestimonialCard = ({ testimonial, delay, index }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4 + index * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="h-full p-8 glass-effect rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Quote icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Testimonial text */}
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          "{testimonial.text}"
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.svg
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: delay + 0.3 + i * 0.1 }}
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </motion.svg>
          ))}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-2xl shadow-lg"
          >
            {testimonial.avatar}
          </motion.div>
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.role}</p>
            <p className="text-xs text-gray-500">{testimonial.company}</p>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-t-2xl" />
      </motion.div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const testimonials = [
    {
      text: "This platform transformed how we handle customer support. Our response time dropped by 80% and customer satisfaction is at an all-time high. Absolutely game-changing!",
      name: "Sarah Johnson",
      role: "Head of Operations",
      company: "TechCorp Inc.",
      avatar: "👩‍💼",
    },
    {
      text: "We automated our entire lead qualification process in just 2 days. The visual workflow builder is incredibly intuitive, and the results speak for themselves.",
      name: "Michael Chen",
      role: "Sales Director",
      company: "Growth Labs",
      avatar: "👨‍💼",
    },
    {
      text: "The best no-code AI platform I've used. The pre-built templates saved us months of development time, and the integrations work flawlessly with our existing tools.",
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "StartupXYZ",
      avatar: "👩‍💻",
    },
    {
      text: "ROI in the first month! The analytics dashboard helps us optimize our workflows continuously. Support is fantastic too - they truly care about our success.",
      name: "David Park",
      role: "CTO",
      company: "InnovateCo",
      avatar: "👨‍🔬",
    },
    {
      text: "Finally, an AI automation tool that my entire team can use. No more dependency on developers. Everyone can build and deploy their own workflows.",
      name: "Lisa Thompson",
      role: "Operations Manager",
      company: "Efficiency Plus",
      avatar: "👩‍🚀",
    },
    {
      text: "The scalability is impressive. We went from handling 100 requests a day to 10,000+ without any issues. Enterprise-grade security gives us peace of mind.",
      name: "James Wilson",
      role: "VP of Engineering",
      company: "ScaleUp Solutions",
      avatar: "👨‍🎓",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
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
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full"
          >
            Testimonials
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by teams
            <span className="text-gradient"> worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of companies that are automating smarter with AI-powered workflows
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              delay={index * 0.1}
              index={index}
            />
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '1M+', label: 'Workflows Created' },
            { value: '98.5%', label: 'Success Rate' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 glass-effect rounded-2xl"
            >
              <motion.h3
                className="text-4xl font-bold text-gradient mb-2"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 1 + index * 0.1 }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating background elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-10 w-64 h-64 bg-primary-300 rounded-full blur-3xl opacity-10"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-accent-300 rounded-full blur-3xl opacity-10"
      />
    </section>
  );
};

export default TestimonialsSection;
