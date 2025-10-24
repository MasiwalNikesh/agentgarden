import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";
import { use3DTilt } from "../hooks/use3DTilt";
import { PulseIndicator, GlowCard } from "../components/animations/MicroInteractions";

const MyAgents = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // TODO: Replace with actual API call
  const stats = {
    activeAgents: 8,
    totalTasks: 12547,
    successRate: 98.5,
    hoursAutomated: 342,
  };

  // TODO: Replace with actual API call to fetch user's agents
  const myAgents = [
    {
      id: 1,
      name: "Sales Lead Follow-up Bot",
      agent: "Max",
      agentAvatar: "/img/max.png",
      agentType: "AI Sales Representative",
      status: "active",
      lastActivity: "2 minutes ago",
      tasksCompleted: 1247,
      successRate: 97.5,
      workflow: "New Lead Follow-up",
      created: "2024-01-15",
    },
    {
      id: 2,
      name: "Support Ticket Triage",
      agent: "Luna",
      agentAvatar: "/img/luna.png",
      agentType: "AI Customer Support",
      status: "active",
      lastActivity: "5 minutes ago",
      tasksCompleted: 3542,
      successRate: 99.2,
      workflow: "Customer Support Triage",
      created: "2024-01-10",
    },
    {
      id: 3,
      name: "Meeting Scheduler",
      agent: "Alex",
      agentAvatar: "/img/alex.png",
      agentType: "AI Executive Assistant",
      status: "active",
      lastActivity: "1 hour ago",
      tasksCompleted: 842,
      successRate: 96.8,
      workflow: "Meeting Scheduler",
      created: "2024-02-01",
    },
    {
      id: 4,
      name: "Social Media Manager",
      agent: "Nova",
      agentAvatar: "/img/nova.png",
      agentType: "AI Marketing Associate",
      status: "paused",
      lastActivity: "2 days ago",
      tasksCompleted: 456,
      successRate: 98.1,
      workflow: "Social Media Manager",
      created: "2024-02-10",
    },
    {
      id: 5,
      name: "Invoice Reminder Bot",
      agent: "Alex",
      agentAvatar: "/img/alex.png",
      agentType: "AI Executive Assistant",
      status: "active",
      lastActivity: "10 minutes ago",
      tasksCompleted: 234,
      successRate: 100,
      workflow: "Invoice Reminder",
      created: "2024-02-20",
    },
    {
      id: 6,
      name: "Candidate Screener",
      agent: "Alex",
      agentAvatar: "/img/alex.png",
      agentType: "AI Executive Assistant",
      status: "error",
      lastActivity: "1 hour ago",
      tasksCompleted: 156,
      successRate: 94.2,
      workflow: "Candidate Screening",
      created: "2024-03-01",
      error: "Integration disconnected: LinkedIn",
    },
  ];

  const filteredAgents = myAgents.filter((agent) => {
    if (filterStatus === "all") return true;
    return agent.status === filterStatus;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created) - new Date(a.created);
    } else if (sortBy === "tasks") {
      return b.tasksCompleted - a.tasksCompleted;
    }
    return 0;
  });

  const StatCard = ({ value, suffix = "", label, delay }) => {
    const [countRef, count] = useCountUp(value, 2000, suffix ? 1 : 0);
    const tiltRef = use3DTilt(5, 1000);

    return (
      <motion.div
        ref={countRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        <div ref={tiltRef} className="p-6 glass-effect rounded-2xl shadow-lg">
          <div className="text-4xl font-bold text-gradient mb-2">
            {count}
            {suffix}
          </div>
          <p className="text-gray-600 font-medium">{label}</p>
        </div>
      </motion.div>
    );
  };

  const AgentCard = ({ agent, index }) => {
    const tiltRef = use3DTilt(3, 800);

    const getStatusConfig = (status) => {
      switch (status) {
        case "active":
          return {
            color: "green",
            bg: "bg-green-100",
            text: "text-green-700",
            label: "Active",
            showPulse: true,
          };
        case "paused":
          return {
            color: "yellow",
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            label: "Paused",
            showPulse: false,
          };
        case "error":
          return {
            color: "red",
            bg: "bg-red-100",
            text: "text-red-700",
            label: "Error",
            showPulse: false,
          };
        default:
          return {
            color: "gray",
            bg: "bg-gray-100",
            text: "text-gray-700",
            label: "Unknown",
            showPulse: false,
          };
      }
    };

    const statusConfig = getStatusConfig(agent.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <GlowCard>
          <div
            ref={tiltRef}
            className="p-6 glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={agent.agentAvatar}
                    alt={agent.agent}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {agent.agent} • {agent.agentType}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Using: {agent.workflow}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {statusConfig.showPulse && <PulseIndicator />}
                <span
                  className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.text} text-sm font-semibold rounded-full`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {agent.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">⚠️ {agent.error}</p>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {agent.tasksCompleted.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600">Tasks Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {agent.successRate}%
                </div>
                <p className="text-xs text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-700 font-medium">
                  {agent.lastActivity}
                </div>
                <p className="text-xs text-gray-600">Last Activity</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {agent.status === "active" ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                  onClick={() =>
                    console.log("TODO: Pause agent", agent.id)
                  }
                >
                  Pause
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  onClick={() =>
                    console.log("TODO: Start agent", agent.id)
                  }
                >
                  Start
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() =>
                  console.log("TODO: Navigate to workflow editor", agent.id)
                }
              >
                Edit
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => console.log("TODO: View logs", agent.id)}
              >
                Logs
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                onClick={() => console.log("TODO: Delete agent", agent.id)}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </GlowCard>
      </motion.div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Agents</h1>
          <p className="text-gray-600">
            Manage your deployed AI agents and monitor their performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={stats.activeAgents}
            label="Active Agents"
            delay={0}
          />
          <StatCard
            value={stats.totalTasks}
            label="Total Tasks Completed"
            delay={0.1}
          />
          <StatCard
            value={stats.successRate}
            suffix="%"
            label="Success Rate"
            delay={0.2}
          />
          <StatCard
            value={stats.hoursAutomated}
            label="Hours Automated"
            delay={0.3}
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {["all", "active", "paused", "error"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === "all" && ` (${myAgents.length})`}
                {status === "active" &&
                  ` (${myAgents.filter((a) => a.status === "active").length})`}
                {status === "paused" &&
                  ` (${myAgents.filter((a) => a.status === "paused").length})`}
                {status === "error" &&
                  ` (${myAgents.filter((a) => a.status === "error").length})`}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Recently Created</option>
              <option value="tasks">Most Tasks</option>
              <option value="name">Name (A-Z)</option>
            </select>

            <Link to="/templates">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                + Deploy New Agent
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Agents List */}
        {sortedAgents.length > 0 ? (
          <div className="space-y-4">
            {sortedAgents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Agents Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Deploy your first AI agent to start automating your workflows
              </p>
              <Link to="/templates">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Templates
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyAgents;
