import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HRAutomationTemplate = () => {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [candidateStatus, setCandidateStatus] = useState({});

  // Mock candidate data
  const mockCandidates = [
    {
      id: 1,
      ref: "HR-2025-001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Software Engineer",
      status: "queued",
      leadType: "Direct Application",
      campaign: "Tech Hiring Q1 2025",
      skills: ["React", "Python", "AWS"],
      experience: "5 years",
      interest: "High",
      fit: "Excellent",
      urgency: "Immediate",
    },
    {
      id: 2,
      ref: "HR-2025-002",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 234-5678",
      position: "Product Manager",
      status: "queued",
      leadType: "LinkedIn Referral",
      campaign: "Product Team Expansion",
      skills: ["Agile", "Roadmapping", "Analytics"],
      experience: "7 years",
      interest: "Medium",
      fit: "Good",
      urgency: "Flexible",
    },
    {
      id: 3,
      ref: "HR-2025-003",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      position: "UX Designer",
      status: "queued",
      leadType: "Agency Referral",
      campaign: "Design Team Q1",
      skills: ["Figma", "User Research", "Prototyping"],
      experience: "4 years",
      interest: "High",
      fit: "Excellent",
      urgency: "High",
    },
    {
      id: 4,
      ref: "HR-2025-004",
      name: "David Kim",
      email: "d.kim@email.com",
      phone: "+1 (555) 456-7890",
      position: "Data Scientist",
      status: "queued",
      leadType: "Direct Application",
      campaign: "Data Analytics Hiring",
      skills: ["Python", "Machine Learning", "SQL"],
      experience: "6 years",
      interest: "Medium",
      fit: "Good",
      urgency: "Medium",
    },
  ];

  const [candidates, setCandidates] = useState(mockCandidates);

  const workflowSteps = [
    {
      id: "start",
      title: "Start / Lead Ingestion",
      subtitle: "(API/CRM/Excel)",
      description: "Capture Key Fields (Ref#, Name, Email, Phone)",
      icon: "📥",
      type: "trigger",
      details: "Automatically ingest candidate data from multiple sources including APIs, CRM systems, or Excel uploads. System captures essential information like reference number, full name, email address, and phone number for processing.",
      duration: 2000,
    },
    {
      id: "queue",
      title: "Queue for Auto-Call",
      subtitle: "(Lead Type/Campaign/KB)",
      description: "Organize candidates based on lead type, campaign, and knowledge base",
      icon: "📋",
      type: "process",
      details: "Candidates are intelligently queued based on lead type, associated campaign, and relevant knowledge base. This ensures proper routing and context for each interaction.",
      duration: 1500,
    },
    {
      id: "attempt",
      title: "Attempt Call",
      subtitle: "",
      description: "Initiate automated call to candidate",
      icon: "📞",
      type: "decision",
      details: "System attempts to connect with the candidate via phone. The AI agent is prepared with relevant context and screening questions.",
      duration: 3000,
    },
    {
      id: "conversation",
      title: "Start AI Conversation",
      subtitle: "",
      description: "Connected - Begin AI-powered interaction",
      icon: "🤖",
      type: "process",
      details: "Once connected, AI agent engages in natural conversation, asking screening questions and assessing candidate fit.",
      duration: 4000,
    },
    {
      id: "screening",
      title: "Candidate Screening",
      subtitle: "Ask Questions → Analyze Parameters",
      description: "(Interest, Fit, Urgency, Skills)",
      icon: "📝",
      type: "branch",
      details: "AI conducts comprehensive screening, analyzing key parameters: interest level, role fit, urgency/timeline, and technical skills.",
      duration: 3500,
    },
    {
      id: "crm-update",
      title: "Send to CRM/Sheet + Update Status",
      subtitle: "",
      description: "Sync all data and update candidate status",
      icon: "💾",
      type: "integration",
      details: "All captured information is automatically synchronized to your CRM or spreadsheet with updated candidate status and next steps.",
      duration: 2000,
    },
    {
      id: "dashboard",
      title: "Admin Dashboard Update",
      subtitle: "Real-Time Feedback",
      description: "Monitor all activities and get real-time insights",
      icon: "📊",
      type: "output",
      details: "Comprehensive dashboard displays all call attempts, success rates, candidate feedback, and AI interaction summaries in real-time.",
      duration: 1500,
    },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Automated Screening",
      description: "AI-powered candidate screening 24/7",
    },
    {
      icon: "📞",
      title: "Smart Calling",
      description: "Intelligent retry logic and multi-channel outreach",
    },
    {
      icon: "💡",
      title: "Real-time Analytics",
      description: "Live dashboard with actionable insights",
    },
    {
      icon: "🔗",
      title: "CRM Integration",
      description: "Seamless sync with your existing systems",
    },
  ];

  // Demo simulation logic
  useEffect(() => {
    if (isPlaying && selectedCandidate) {
      if (currentStep < workflowSteps.length) {
        const timer = setTimeout(() => {
          const step = workflowSteps[currentStep];

          // Add activity to feed
          addActivity(step, selectedCandidate);

          // Update candidate status
          updateCandidateStatus(selectedCandidate.id, step.id);

          setCurrentStep(currentStep + 1);
        }, workflowSteps[currentStep].duration);

        return () => clearTimeout(timer);
      } else {
        // Demo completed
        setIsPlaying(false);
        addActivity(
          {
            icon: "✅",
            title: "Workflow Complete",
            description: `${selectedCandidate.name} successfully processed`
          },
          selectedCandidate
        );
        updateCandidateStatus(selectedCandidate.id, "completed");
      }
    }
  }, [isPlaying, currentStep, selectedCandidate]);

  const addActivity = (step, candidate) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityFeed((prev) => [
      {
        id: Date.now(),
        timestamp,
        icon: step.icon,
        title: step.title,
        description: `${candidate.name} - ${step.description}`,
        candidate: candidate.name,
      },
      ...prev.slice(0, 9), // Keep only last 10 activities
    ]);
  };

  const updateCandidateStatus = (candidateId, status) => {
    setCandidateStatus((prev) => ({
      ...prev,
      [candidateId]: status,
    }));
  };

  const startDemo = (candidate) => {
    setSelectedCandidate(candidate);
    setCurrentStep(0);
    setIsPlaying(true);
    setDemoMode(true);
    addActivity(
      {
        icon: "🚀",
        title: "Demo Started",
        description: "Beginning automated screening workflow",
      },
      candidate
    );
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resumeDemo = () => {
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSelectedCandidate(null);
    setActivityFeed([]);
    setCandidateStatus({});
  };

  const getStatusColor = (status) => {
    const statusMap = {
      queued: "bg-gray-100 text-gray-700",
      start: "bg-blue-100 text-blue-700",
      queue: "bg-cyan-100 text-cyan-700",
      attempt: "bg-yellow-100 text-yellow-700",
      conversation: "bg-purple-100 text-purple-700",
      screening: "bg-indigo-100 text-indigo-700",
      "crm-update": "bg-teal-100 text-teal-700",
      dashboard: "bg-green-100 text-green-700",
      completed: "bg-emerald-100 text-emerald-700",
    };
    return statusMap[status] || statusMap.queued;
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      queued: "Queued",
      start: "Ingesting Data",
      queue: "In Queue",
      attempt: "Calling",
      conversation: "In Conversation",
      screening: "Being Screened",
      "crm-update": "Updating CRM",
      dashboard: "Dashboard Update",
      completed: "Completed",
    };
    return labelMap[status] || "Queued";
  };

  const FlowNode = ({ step, index, total, isActive }) => {
    const getNodeColor = () => {
      switch (step.type) {
        case "trigger":
          return "from-cyan-500 to-blue-600";
        case "decision":
          return "from-amber-500 to-orange-600";
        case "process":
          return "from-teal-600 to-cyan-700";
        case "action":
          return "from-gray-600 to-slate-700";
        case "branch":
          return "from-purple-500 to-indigo-600";
        case "integration":
          return "from-teal-600 to-emerald-700";
        case "output":
          return "from-teal-600 to-cyan-700";
        default:
          return "from-primary-600 to-accent-600";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        {/* Connector Line */}
        {index < total - 1 && (
          <div className={`absolute left-1/2 top-full h-8 w-0.5 -translate-x-1/2 z-0 ${
            isActive && index < currentStep
              ? "bg-gradient-to-b from-green-400 to-green-500"
              : "bg-gradient-to-b from-gray-300 to-gray-400"
          }`} />
        )}

        {/* Node Card */}
        <motion.div
          animate={{
            scale: isActive && index === currentStep ? [1, 1.05, 1] : 1,
            boxShadow: isActive && index === currentStep
              ? ["0 10px 30px rgba(0,0,0,0.1)", "0 20px 50px rgba(59, 130, 246, 0.3)", "0 10px 30px rgba(0,0,0,0.1)"]
              : "0 10px 30px rgba(0,0,0,0.1)",
          }}
          transition={{
            duration: 1,
            repeat: isActive && index === currentStep ? Infinity : 0,
          }}
          onClick={() => setActiveNode(activeNode === step.id ? null : step.id)}
          className={`relative z-10 cursor-pointer transition-all ${
            activeNode === step.id ? "ring-4 ring-primary-400 shadow-2xl" : "shadow-lg hover:shadow-xl"
          } ${
            isActive && index < currentStep ? "opacity-100" : ""
          } ${
            isActive && index === currentStep ? "ring-4 ring-blue-400" : ""
          } ${
            isActive && index > currentStep ? "opacity-50" : ""
          }`}
        >
          <div className="rounded-2xl overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${getNodeColor()} p-4 text-white relative`}>
              {isActive && index === currentStep && (
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full" />
                </motion.div>
              )}
              {isActive && index < currentStep && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{step.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  {step.subtitle && (
                    <p className="text-sm opacity-90">{step.subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white p-4 border-2 border-gray-200">
              <p className="text-gray-700 text-sm font-medium">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Details Panel */}
        <AnimatePresence>
          {activeNode === step.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-4 bg-primary-50 rounded-xl border-2 border-primary-200"
            >
              <p className="text-gray-700 text-sm">{step.details}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const CandidateCard = ({ candidate }) => {
    const status = candidateStatus[candidate.id] || candidate.status;
    const isSelected = selectedCandidate?.id === candidate.id;

    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={`glass-effect rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 ${
          isSelected ? "border-blue-400 bg-blue-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
            <p className="text-xs text-gray-500 mt-1">{candidate.ref}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </span>
        </div>

        <div className="space-y-2 mb-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs">📧</span>
            <span className="text-xs">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs">📱</span>
            <span className="text-xs">{candidate.phone}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div>
            <span className="text-gray-500">Interest:</span>
            <p className={`font-semibold ${
              candidate.interest === "High" ? "text-green-600" : "text-yellow-600"
            }`}>
              {candidate.interest}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Fit:</span>
            <p className={`font-semibold ${
              candidate.fit === "Excellent" ? "text-green-600" : "text-blue-600"
            }`}>
              {candidate.fit}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Urgency:</span>
            <p className="font-semibold text-gray-700">{candidate.urgency}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => startDemo(candidate)}
          disabled={isPlaying}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
            isPlaying
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isSelected && isPlaying ? "Processing..." : "Run Screening"}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back</span>
            </button>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoMode(!demoMode)}
                className={`px-6 py-2 border-2 rounded-lg font-semibold transition-colors ${
                  demoMode
                    ? "border-green-600 text-green-600 bg-green-50"
                    : "border-primary-600 text-primary-600 hover:bg-primary-50"
                }`}
              >
                {demoMode ? "Exit Demo" : "Try Live Demo"}
              </motion.button>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Use Template
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Demo Mode Banner */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🎮
                </motion.span>
                <div>
                  <p className="font-bold">Live Demo Mode Active</p>
                  <p className="text-sm opacity-90">
                    Select a candidate below to see the automation in action
                  </p>
                </div>
              </div>
              {selectedCandidate && (
                <div className="flex gap-2">
                  {!isPlaying ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={currentStep === 0 ? () => startDemo(selectedCandidate) : resumeDemo}
                      className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold"
                    >
                      ▶ {currentStep === 0 ? "Start" : "Resume"}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={pauseDemo}
                      className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold"
                    >
                      ⏸ Pause
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetDemo}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold"
                  >
                    🔄 Reset
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!demoMode ? (
        <>
          {/* Hero Section */}
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                  <span className="text-blue-700 font-semibold text-sm">
                    HR & Recruitment
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Automated Lead Management
                  <span className="block text-gradient mt-2">& Screening</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Streamline your HR processes with AI-powered candidate screening,
                  automated outreach, and intelligent follow-ups. Reduce time-to-hire
                  by 60% while improving candidate experience.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
                  {[
                    { label: "Time Saved", value: "60%" },
                    { label: "Candidates/Day", value: "100+" },
                    { label: "Response Rate", value: "85%" },
                    { label: "Setup Time", value: "5 min" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="glass-effect rounded-xl p-4 shadow-lg"
                    >
                      <div className="text-3xl font-bold text-gradient mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-12 px-6 bg-white">
            <div className="container mx-auto max-w-6xl">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center text-gray-900 mb-8"
              >
                Key Features
              </motion.h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass-effect rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Workflow Visualization */}
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-gray-600 text-lg">
                  Click on any step to learn more about the process
                </p>
              </motion.div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <FlowNode
                    key={step.id}
                    step={step}
                    index={index}
                    total={workflowSteps.length}
                    isActive={false}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Integration Section */}
          <section className="py-16 px-6 bg-gradient-to-br from-primary-50 to-accent-50">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Seamless Integrations
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Connect with your existing HR tools and platforms
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Greenhouse", logo: "🏢" },
                  { name: "LinkedIn", logo: "💼" },
                  { name: "Gmail", logo: "📧" },
                  { name: "Slack", logo: "💬" },
                  { name: "HubSpot", logo: "🎯" },
                  { name: "Workday", logo: "📊" },
                  { name: "WhatsApp", logo: "💚" },
                  { name: "Google Sheets", logo: "📋" },
                ].map((integration, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-4xl mb-2">{integration.logo}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {integration.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-effect rounded-3xl p-12 text-center shadow-2xl bg-gradient-to-br from-primary-600 to-accent-600"
              >
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Transform Your HR Process?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Deploy this template in minutes and start screening candidates
                  automatically. No coding required.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                      Get Started Free
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/templates")}
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all"
                  >
                    View All Templates
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        // Demo Mode Interface
        <div className="py-8 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Candidates */}
              <div className="lg:col-span-1">
                <div className="glass-effect rounded-2xl p-6 shadow-xl sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>👥</span>
                    Candidate Queue
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Select a candidate to run the automated screening workflow
                  </p>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {candidates.map((candidate) => (
                      <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Workflow */}
              <div className="lg:col-span-1">
                <div className="glass-effect rounded-2xl p-6 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>⚙️</span>
                    Automation Flow
                  </h2>
                  {selectedCandidate && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <p className="text-sm font-semibold text-blue-900">
                        Processing: {selectedCandidate.name}
                      </p>
                      <p className="text-xs text-blue-700">
                        {selectedCandidate.position}
                      </p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${(currentStep / workflowSteps.length) * 100}%`,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Step {currentStep} of {workflowSteps.length}
                      </p>
                    </div>
                  )}
                  <div className="space-y-4 max-h-[700px] overflow-y-auto">
                    {workflowSteps.map((step, index) => (
                      <FlowNode
                        key={step.id}
                        step={step}
                        index={index}
                        total={workflowSteps.length}
                        isActive={selectedCandidate !== null}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Activity Feed */}
              <div className="lg:col-span-1">
                <div className="glass-effect rounded-2xl p-6 shadow-xl sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Live Activity Feed
                  </h2>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {activityFeed.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-4xl mb-2">🎯</p>
                        <p className="text-sm">
                          Select a candidate to see real-time activity
                        </p>
                      </div>
                    ) : (
                      activityFeed.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{activity.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm text-gray-900">
                                  {activity.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {activity.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRAutomationTemplate;
