import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { use3DTilt } from "../hooks/use3DTilt";
import { GlowCard } from "../components/animations/MicroInteractions";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const pricingPlans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for trying out AgentGarden",
      features: [
        "Up to 2 AI agents",
        "100 tasks per month",
        "5 workflow templates",
        "Basic integrations",
        "Community support",
        "7-day activity logs",
      ],
      cta: "Get Started Free",
      ctaLink: "/register",
      highlighted: false,
      color: "gray",
    },
    {
      name: "Pro",
      price: { monthly: 49, annual: 39 },
      description: "For growing teams and businesses",
      features: [
        "Unlimited AI agents",
        "10,000 tasks per month",
        "All workflow templates",
        "100+ integrations",
        "Priority support",
        "30-day activity logs",
        "Advanced analytics",
        "API access",
        "Team collaboration",
      ],
      cta: "Start Pro Trial",
      ctaLink: "/register",
      highlighted: true,
      color: "primary",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: { monthly: "Custom", annual: "Custom" },
      description: "For large organizations with custom needs",
      features: [
        "Everything in Pro",
        "Unlimited tasks",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Unlimited logs retention",
        "Advanced security features",
        "On-premise deployment option",
        "Custom training",
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      highlighted: false,
      color: "accent",
    },
  ];

  const faqs = [
    {
      question: "Can I switch plans at any time?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences.",
    },
    {
      question: "What happens if I exceed my task limit?",
      answer:
        "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional task credits. Your agents won't be interrupted.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 14-day money-back guarantee on annual plans. Monthly subscriptions can be cancelled anytime, and you won't be charged for the next month.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express) and offer invoicing for Enterprise customers. We use Stripe for secure payment processing.",
    },
    {
      question: "Can I try Pro features before committing?",
      answer:
        "Absolutely! Pro plans come with a 14-day free trial. No credit card required to start. You can explore all Pro features risk-free.",
    },
    {
      question: "What's included in the Enterprise plan?",
      answer:
        "Enterprise includes everything in Pro, plus custom integrations, dedicated support, SLA guarantees, advanced security, and the option for on-premise deployment. Contact our sales team for a custom quote.",
    },
  ];

  const PricingCard = ({ plan, index }) => {
    const tiltRef = use3DTilt(5, 1000);
    const price =
      typeof plan.price[billingCycle] === "number"
        ? plan.price[billingCycle]
        : plan.price[billingCycle];

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
      >
        {plan.badge && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="px-4 py-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-full shadow-lg">
              {plan.badge}
            </span>
          </div>
        )}

        <GlowCard className="h-full">
          <div
            ref={tiltRef}
            className={`h-full p-8 rounded-2xl transition-all duration-300 ${
              plan.highlighted
                ? "glass-effect border-2 border-primary-300 shadow-2xl"
                : "glass-effect shadow-lg hover:shadow-xl"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 mb-6">{plan.description}</p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                {typeof price === "number" ? (
                  <>
                    <span className="text-5xl font-bold text-gray-900">
                      ${price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </>
                ) : (
                  <span className="text-5xl font-bold text-gray-900">
                    {price}
                  </span>
                )}
              </div>
              {billingCycle === "annual" && typeof price === "number" && (
                <p className="text-sm text-green-600 mt-2">
                  Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                </p>
              )}
            </div>

            <Link to={plan.ctaLink}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg hover:shadow-xl"
                    : "border-2 border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </motion.button>
            </Link>

            <ul className="space-y-4">
              {plan.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <svg
                    className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
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
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </GlowCard>
      </motion.div>
    );
  };

  const FAQItem = ({ faq, index }) => {
    const isOpen = openFaqIndex === index;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="border-b border-gray-200 last:border-0"
      >
        <button
          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
          className="w-full py-6 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 pr-8">
            {faq.question}
          </h3>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 text-gray-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-600 pb-6 leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Simple, Transparent
                <span className="block text-gradient">Pricing</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Start free, scale as you grow. No hidden fees, no surprises.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-4 glass-effect px-6 py-3 rounded-full">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-2 rounded-full font-semibold transition-all relative ${
                    billingCycle === "annual"
                      ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                All Plans Include
              </h2>
              <p className="text-xl text-gray-600">
                Core features available across all tiers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: "🔒",
                  title: "Enterprise Security",
                  description: "SOC 2, GDPR, HIPAA compliant",
                },
                {
                  icon: "🚀",
                  title: "99.9% Uptime",
                  description: "Reliable infrastructure you can trust",
                },
                {
                  icon: "📊",
                  title: "Real-time Analytics",
                  description: "Track performance and optimize workflows",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about pricing and billing
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto glass-effect rounded-2xl p-8">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of teams automating their workflows with
                AgentGarden
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Free Trial
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
