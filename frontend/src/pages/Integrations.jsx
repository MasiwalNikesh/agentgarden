import React, { useState } from "react";
import { motion } from "framer-motion";
import StaggeredGrid from "../components/animations/StaggeredGrid";
import { ShimmerCard, PulseIndicator } from "../components/animations/MicroInteractions";

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConnected, setShowConnected] = useState(false);

  const categories = [
    { id: "all", name: "All Integrations", count: 32 },
    { id: "crm", name: "CRM", count: 6 },
    { id: "email", name: "Email", count: 5 },
    { id: "calendar", name: "Calendar", count: 4 },
    { id: "communication", name: "Communication", count: 7 },
    { id: "marketing", name: "Marketing", count: 4 },
    { id: "productivity", name: "Productivity", count: 6 },
  ];

  // TODO: Replace with actual API call to fetch user's integrations
  const integrations = [
    {
      id: 1,
      name: "Gmail",
      category: "email",
      description: "Send and receive emails, manage labels, and search messages",
      icon: "https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png",
      connected: true,
      popular: true,
      connectedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Google Calendar",
      category: "calendar",
      description: "Schedule meetings, create events, and manage calendars",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
      connected: true,
      popular: true,
      connectedDate: "2024-01-15",
    },
    {
      id: 3,
      name: "Slack",
      category: "communication",
      description: "Send messages, create channels, and manage team communication",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
      connected: true,
      popular: true,
      connectedDate: "2024-02-01",
    },
    {
      id: 4,
      name: "HubSpot",
      category: "crm",
      description: "Manage contacts, deals, tickets, and automate sales workflows",
      icon: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      connected: false,
      popular: true,
    },
    {
      id: 5,
      name: "Salesforce",
      category: "crm",
      description: "Access CRM data, manage leads, and update opportunities",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      connected: false,
      popular: true,
    },
    {
      id: 6,
      name: "Zendesk",
      category: "communication",
      description: "Manage support tickets, respond to customers, and track issues",
      icon: "https://d1eipm3vz40hy0.cloudfront.net/images/AMER/Zendesk-2020-logo.png",
      connected: false,
      popular: true,
    },
    {
      id: 7,
      name: "LinkedIn",
      category: "crm",
      description: "Search profiles, send messages, and manage connections",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
      connected: true,
      popular: true,
      connectedDate: "2024-02-10",
    },
    {
      id: 8,
      name: "Mailchimp",
      category: "marketing",
      description: "Create campaigns, manage subscribers, and track email performance",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Mailchimp_Logo.svg",
      connected: false,
      popular: false,
    },
    {
      id: 9,
      name: "Trello",
      category: "productivity",
      description: "Create cards, manage boards, and track project progress",
      icon: "https://upload.wikimedia.org/wikipedia/en/8/8c/Trello_logo.svg",
      connected: false,
      popular: false,
    },
    {
      id: 10,
      name: "Stripe",
      category: "crm",
      description: "Process payments, manage subscriptions, and track revenue",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      connected: false,
      popular: true,
    },
    {
      id: 11,
      name: "Notion",
      category: "productivity",
      description: "Create pages, manage databases, and organize knowledge",
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      connected: false,
      popular: false,
    },
    {
      id: 12,
      name: "Asana",
      category: "productivity",
      description: "Manage tasks, track projects, and collaborate with teams",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg",
      connected: false,
      popular: false,
    },
    {
      id: 13,
      name: "Intercom",
      category: "communication",
      description: "Chat with customers, send messages, and manage conversations",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Intercom-logo.jpg",
      connected: false,
      popular: false,
    },
    {
      id: 14,
      name: "Zoom",
      category: "communication",
      description: "Schedule meetings, start calls, and manage recordings",
      icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
      connected: false,
      popular: false,
    },
    {
      id: 15,
      name: "Twitter",
      category: "marketing",
      description: "Post tweets, manage followers, and track engagement",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
      connected: false,
      popular: false,
    },
    {
      id: 16,
      name: "Airtable",
      category: "productivity",
      description: "Create databases, manage records, and build workflows",
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
      connected: false,
      popular: false,
    },
  ];

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || integration.category === selectedCategory;
    const matchesConnected = !showConnected || integration.connected;
    return matchesSearch && matchesCategory && matchesConnected;
  });

  const connectedCount = integrations.filter((i) => i.connected).length;

  const IntegrationCard = ({ integration }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = () => {
      // TODO: Implement OAuth flow or API connection
      setIsConnecting(true);
      console.log(`Connecting to ${integration.name}...`);
      setTimeout(() => {
        setIsConnecting(false);
        alert(`TODO: Implement OAuth flow for ${integration.name}`);
      }, 1500);
    };

    const handleDisconnect = () => {
      // TODO: Implement disconnection
      console.log(`Disconnecting from ${integration.name}...`);
      alert(`TODO: Implement disconnection for ${integration.name}`);
    };

    const handleManage = () => {
      // TODO: Navigate to integration management page
      console.log(`Managing ${integration.name}...`);
      alert(`TODO: Show management interface for ${integration.name}`);
    };

    return (
      <ShimmerCard>
        <motion.div
          whileHover={{ y: -4 }}
          className={`p-6 glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col ${
            integration.connected
              ? "border-2 border-green-300 bg-green-50/30"
              : "border border-gray-100"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md p-2">
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/56?text=" + integration.name.charAt(0);
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {integration.category}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {integration.popular && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  Popular
                </span>
              )}
              {integration.connected && (
                <div className="flex items-center gap-1">
                  <PulseIndicator className="scale-75" />
                  <span className="text-xs font-semibold text-green-600">
                    Connected
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {integration.description}
          </p>

          {/* Connection Info */}
          {integration.connected && (
            <p className="text-xs text-gray-500 mb-3">
              Connected on {new Date(integration.connectedDate).toLocaleDateString()}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            {integration.connected ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManage}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Manage
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDisconnect}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Disconnect
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConnect}
                disabled={isConnecting}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  isConnecting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </ShimmerCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Integrations
          </h1>
          <p className="text-gray-600">
            Connect your favorite tools and automate workflows across platforms
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="p-6 glass-effect rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-gradient mb-2">
              {connectedCount}
            </div>
            <p className="text-gray-600 font-medium">Connected Integrations</p>
          </div>
          <div className="p-6 glass-effect rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-gradient mb-2">
              {integrations.length}+
            </div>
            <p className="text-gray-600 font-medium">Available Integrations</p>
          </div>
          <div className="p-6 glass-effect rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-gradient mb-2">100+</div>
            <p className="text-gray-600 font-medium">More Coming Soon</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 glass-effect rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
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

            {/* Show Connected Toggle */}
            <button
              onClick={() => setShowConnected(!showConnected)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showConnected
                  ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                  : "glass-effect text-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              <svg
                className="w-5 h-5"
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
              Show Connected Only
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
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
            </div>
          </motion.div>

          {/* Integrations Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredIntegrations.length} integration
                {filteredIntegrations.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredIntegrations.length > 0 ? (
              <StaggeredGrid
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                staggerDelay={0.05}
                animationVariant="fadeUp"
              >
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                  />
                ))}
              </StaggeredGrid>
            ) : (
              <div className="text-center py-16">
                <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Integrations Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Request Integration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-effect rounded-2xl p-8 shadow-lg border-2 border-primary-200"
        >
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-4">💡</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't See Your Integration?
            </h2>
            <p className="text-gray-600 mb-6">
              We're constantly adding new integrations. Let us know what you
              need and we'll prioritize it.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("TODO: Open request integration form")}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Request Integration
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Integrations;
