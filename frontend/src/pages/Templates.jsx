import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import StaggeredGrid from "../components/animations/StaggeredGrid";
import { ShimmerCard } from "../components/animations/MicroInteractions";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    { id: "all", name: "All Templates", count: 24 },
    { id: "sales", name: "Sales & Lead Gen", count: 8 },
    { id: "support", name: "Customer Support", count: 6 },
    { id: "marketing", name: "Marketing", count: 5 },
    { id: "hr", name: "HR & Recruitment", count: 3 },
    { id: "operations", name: "Operations", count: 2 },
  ];

  const templates = [
    {
      id: 1,
      name: "New Lead Follow-up",
      category: "sales",
      agent: "Max",
      agentType: "AI Sales Representative",
      description:
        "Automatically follow up with new leads from your CRM, send personalized emails, and schedule meetings.",
      integrations: ["HubSpot", "Gmail", "Google Calendar"],
      tasks: "~500/month",
      popularity: "High",
      icon: "💼",
      color: "blue",
    },
    {
      id: 2,
      name: "Customer Support Triage",
      category: "support",
      agent: "Luna",
      agentType: "AI Customer Support",
      description:
        "Automatically categorize support tickets, respond to common questions, and escalate urgent issues.",
      integrations: ["Zendesk", "Slack", "Intercom"],
      tasks: "~800/month",
      popularity: "High",
      icon: "🎧",
      color: "red",
    },
    {
      id: 3,
      name: "Meeting Scheduler",
      category: "operations",
      agent: "Alex",
      agentType: "AI Executive Assistant",
      description:
        "Coordinate meeting times, send calendar invites, and manage rescheduling requests automatically.",
      integrations: ["Google Calendar", "Gmail", "Calendly"],
      tasks: "~300/month",
      popularity: "High",
      icon: "📅",
      color: "purple",
    },
    {
      id: 4,
      name: "Social Media Manager",
      category: "marketing",
      agent: "Nova",
      agentType: "AI Marketing Associate",
      description:
        "Schedule posts, respond to comments, track engagement, and generate content ideas across platforms.",
      integrations: ["Twitter", "LinkedIn", "Buffer"],
      tasks: "~400/month",
      popularity: "Medium",
      icon: "📱",
      color: "yellow",
    },
    {
      id: 5,
      name: "Invoice Reminder",
      category: "operations",
      agent: "Alex",
      agentType: "AI Executive Assistant",
      description:
        "Send automated payment reminders, track invoice status, and follow up with overdue accounts.",
      integrations: ["Stripe", "QuickBooks", "Gmail"],
      tasks: "~200/month",
      popularity: "Medium",
      icon: "💰",
      color: "green",
    },
    {
      id: 6,
      name: "Candidate Screening",
      category: "hr",
      agent: "Alex",
      agentType: "AI Executive Assistant",
      description:
        "Review resumes, schedule interviews, send follow-up emails, and maintain candidate database.",
      integrations: ["Greenhouse", "LinkedIn", "Gmail"],
      tasks: "~150/month",
      popularity: "Medium",
      icon: "👥",
      color: "indigo",
      detailsLink: "/templates/hr-automation",
    },
    {
      id: 7,
      name: "Email Campaign Automation",
      category: "marketing",
      agent: "Nova",
      agentType: "AI Marketing Associate",
      description:
        "Create email sequences, segment audiences, personalize content, and track campaign performance.",
      integrations: ["Mailchimp", "HubSpot", "Gmail"],
      tasks: "~600/month",
      popularity: "High",
      icon: "📧",
      color: "pink",
    },
    {
      id: 8,
      name: "Outbound Sales Prospecting",
      category: "sales",
      agent: "Max",
      agentType: "AI Sales Representative",
      description:
        "Research prospects, craft personalized outreach messages, and track responses across channels.",
      integrations: ["Apollo", "LinkedIn", "Gmail"],
      tasks: "~700/month",
      popularity: "High",
      icon: "🎯",
      color: "blue",
    },
    {
      id: 9,
      name: "Customer Feedback Analysis",
      category: "support",
      agent: "Luna",
      agentType: "AI Customer Support",
      description:
        "Collect customer feedback, analyze sentiment, identify trends, and generate improvement reports.",
      integrations: ["Typeform", "Slack", "Google Sheets"],
      tasks: "~250/month",
      popularity: "Medium",
      icon: "📊",
      color: "teal",
    },
    {
      id: 10,
      name: "Onboarding Automation",
      category: "hr",
      agent: "Alex",
      agentType: "AI Executive Assistant",
      description:
        "Send welcome emails, create accounts, assign tasks, and track onboarding completion.",
      integrations: ["Workday", "Slack", "Google Workspace"],
      tasks: "~100/month",
      popularity: "Low",
      icon: "🎉",
      color: "purple",
    },
    {
      id: 11,
      name: "Content Publishing Workflow",
      category: "marketing",
      agent: "Nova",
      agentType: "AI Marketing Associate",
      description:
        "Write blog drafts, optimize for SEO, schedule publishing, and distribute across channels.",
      integrations: ["WordPress", "Ahrefs", "Buffer"],
      tasks: "~350/month",
      popularity: "Medium",
      icon: "✍️",
      color: "yellow",
    },
    {
      id: 12,
      name: "Sales Pipeline Management",
      category: "sales",
      agent: "Max",
      agentType: "AI Sales Representative",
      description:
        "Update deal stages, send follow-up reminders, generate reports, and forecast revenue.",
      integrations: ["Salesforce", "HubSpot", "Slack"],
      tasks: "~450/month",
      popularity: "High",
      icon: "📈",
      color: "blue",
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "popular") {
      const popularityOrder = { High: 3, Medium: 2, Low: 1 };
      return popularityOrder[b.popularity] - popularityOrder[a.popularity];
    }
    return 0; // Default: no sorting
  });

  const TemplateCard = ({ template }) => {
    return (
      <ShimmerCard>
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`text-4xl w-16 h-16 flex items-center justify-center rounded-xl bg-${template.color}-100`}
              >
                {template.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500">by {template.agent}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                template.popularity === "High"
                  ? "bg-green-100 text-green-700"
                  : template.popularity === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {template.popularity}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {template.description}
          </p>

          {/* Integrations */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Integrations:</p>
            <div className="flex flex-wrap gap-1">
              {template.integrations.map((integration, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
            <span className="text-xs text-gray-500">{template.tasks}</span>
            <div className="flex gap-2">
              {template.detailsLink ? (
                <Link to={template.detailsLink}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Preview
                </motion.button>
              )}
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Use Template
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </ShimmerCard>
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
                Agent Workflow
                <span className="block text-gradient">Templates</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Start with pre-built workflows designed by automation experts.
                Deploy in minutes, customize to fit your needs.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 glass-effect rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Templates */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-64 flex-shrink-0"
              >
                <div className="glass-effect rounded-2xl p-6 shadow-lg sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm opacity-75">
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Sort Options */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Sort By
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="recent">Recently Added</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Templates Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    {sortedTemplates.length} template
                    {sortedTemplates.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {sortedTemplates.length > 0 ? (
                  <StaggeredGrid
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    staggerDelay={0.08}
                    animationVariant="fadeUp"
                  >
                    {sortedTemplates.map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </StaggeredGrid>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">
                      No templates found matching your criteria
                    </p>
                  </div>
                )}
              </div>
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
                Don't See What You Need?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Create custom workflows with our visual editor or request a new
                template
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
                  >
                    Build Custom Workflow
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all"
                >
                  Request Template
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
