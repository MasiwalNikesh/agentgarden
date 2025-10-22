import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const AboutUs = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const teamMembers = [
    {
      name: "Nikesh",
      role: "CTO & Co-Founder",
      bio: "Technical visionary with extensive experience in AI and automation technologies, leading our engineering and product development initiatives.",
      image: "👨‍💻",
      linkedin: "#",
    },
    {
      name: "Bindu",
      role: "CEO & Co-Founder",
      bio: "Strategic leader with deep expertise in scaling high-growth companies and driving innovation in enterprise automation solutions.",
      image: "👩‍💼",
      linkedin: "#",
    },
    {
      name: "Ajay Sharma",
      role: "Head of Operations",
      bio: "Experienced operations leader focused on scaling business growth and delivering exceptional customer value.",
      image: "👨‍🔧",
      linkedin: "#",
    },
  ];

  const caseStudies = [
    {
      company: "TechCorp Inc.",
      industry: "Technology",
      challenge:
        "Manual customer onboarding process taking 3-5 days per customer",
      solution:
        "Deployed HR Recruiter Assistant and Customer Support Assistant",
      results:
        "95% reduction in onboarding time, 300% increase in customer satisfaction",
      logo: "🏢",
    },
    {
      company: "SalesForce Pro",
      industry: "Sales & Marketing",
      challenge:
        "Lead qualification bottleneck with 70% of leads going unprocessed",
      solution:
        "Implemented Sales Representative Assistant and Outbound Sales Assistant",
      results:
        "85% increase in qualified leads, 200% boost in conversion rates",
      logo: "📈",
    },
    {
      company: "Global Support Co.",
      industry: "Customer Service",
      challenge: "24/7 support coverage needed across multiple time zones",
      solution:
        "Deployed Customer Support Assistant with multi-language capabilities",
      results:
        "99% uptime achieved, 60% reduction in response time, 24/7 coverage",
      logo: "🌍",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "50M+", label: "Tasks Automated" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Integrations" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full"
            >
              About AgentGarden
            </motion.span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering Digital Organizations with
              <span className="text-gradient"> Agent Gardens</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're revolutionizing workplace solutions for new age and medium
              businesses, providing agents that work 24/7 to automate complex
              workflows and drive unprecedented operational efficiency.
              Cultivate your digital garden with specialized agents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Digital Organization{" "}
              <span className="text-gradient">Workplace Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our agents are designed specifically for new age and medium
              businesses, providing intelligent automation that scales with your
              growth. From lead generation to HR recruitment to smart
              scheduling—we have the perfect agent for every business need. Pick
              from existing agents or plant new ones in your garden.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why We Built This
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Digital Organization Challenge
                    </h4>
                    <p className="text-gray-600">
                      New age and medium businesses face unique challenges:
                      limited resources, growing operational complexity, and the
                      need to scale efficiently. Traditional automation
                      solutions are too complex and expensive for these
                      organizations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Agent Garden Solution
                    </h4>
                    <p className="text-gray-600">
                      Our agents work like your best team members—specialized,
                      reliable, and always available. They handle complex
                      workflows with human-like intelligence, providing
                      immediate value and scaling with your business growth.
                      Cultivate your digital garden with these specialized
                      agents.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Workplace Transformation
                    </h4>
                    <p className="text-gray-600">
                      Our agents deliver immediate productivity gains, 24/7
                      availability, and consistent performance. Businesses see
                      reduced operational costs, improved efficiency, and the
                      ability to focus on strategic growth while agents handle
                      routine tasks. Cultivate your digital garden for maximum
                      growth.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="glass-effect rounded-3xl p-8 shadow-2xl">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  Competitive Advantages
                </h4>
                <div className="space-y-6">
                  {[
                    {
                      icon: "⚡",
                      title: "Rapid Deployment",
                      description:
                        "Deploy AI agents in minutes vs months for competitors",
                    },
                    {
                      icon: "🎯",
                      title: "Proven Templates",
                      description:
                        "Pre-built solutions for common business workflows",
                    },
                    {
                      icon: "🔧",
                      title: "No-Code Platform",
                      description:
                        "Business users can deploy without technical expertise",
                    },
                    {
                      icon: "📈",
                      title: "Scalable Architecture",
                      description:
                        "Built to handle enterprise-scale deployments",
                    },
                  ].map((advantage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md"
                    >
                      <span className="text-2xl flex-shrink-0">
                        {advantage.icon}
                      </span>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">
                          {advantage.title}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          {advantage.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced founding team combines deep technical expertise
              with proven business acumen, bringing together decades of
              experience in AI, enterprise software, and scaling high-growth
              companies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our customers across diverse industries are achieving measurable
              ROI through rapid automation deployment, demonstrating strong
              market validation and growth potential.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{study.logo}</div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {study.company}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                    {study.industry}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Challenge:
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {study.challenge}
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Solution:
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">{study.solution}</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Results:
                  </h4>
                  <p className="text-primary-600 font-semibold text-sm">
                    {study.results}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses already using AgentGarden to
              cultivate their digital gardens and scale their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Building Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
