export const agentTemplates = [
  {
    id: "alex-executive",
    name: "Alex - AI Executive Assistant",
    category: "Executive",
    icon: "/img/alex.png",
    personality: "Professional, organized, detail-oriented",
    tagline:
      "Your AI executive assistant that never sleeps—manages your calendar, prioritizes tasks, and handles communications with precision.",
    description:
      "Key Capabilities: Calendar management, task prioritization, email handling, note-taking.",
    longDescription:
      "Alfred is your dedicated AI executive assistant, designed to handle the complex demands of executive-level work. He manages your calendar with surgical precision, prioritizes tasks based on importance and deadlines, handles email communications with professional tone, and takes comprehensive meeting notes. Alfred works 24/7 to ensure nothing falls through the cracks.",
    capabilities: [
      "Schedule Calendar",
      "Prioritize Tasks",
      "Reply to Emails",
      "Takes Notes",
      "Meeting coordination",
      "Travel planning",
      "Document management",
      "Stakeholder communication",
    ],
    useCases: [
      "Executive support",
      "Calendar optimization",
      "Task management",
      "Communication handling",
    ],
    integrations: ["Google Calendar", "Outlook", "Gmail", "Slack", "Zoom"],
    pricing: "Premium",
    popular: true,
  },
  {
    id: "max-sales",
    name: "Max - AI Sales Representative",
    category: "Sales",
    icon: "/img/max.png",
    personality: "Enthusiastic, results-driven, relationship-focused",
    tagline:
      "Your AI sales rep that never stops—qualifies leads, updates CRM, and closes deals with relentless energy.",
    description:
      "Key Capabilities: Lead qualification, CRM updates, opportunity chasing, personalized outreach.",
    longDescription:
      "Chip is your AI sales representative with an infectious enthusiasm for closing deals. He automatically qualifies leads, updates your CRM with precision, chases opportunities with persistence, and conducts personalized outreach that converts. Chip's energy is contagious and his results speak for themselves.",
    capabilities: [
      "Update CRM",
      "Chase Opportunities",
      "Find Leads",
      "Personalized Outreach",
      "Lead scoring",
      "Follow-up sequences",
      "Sales reporting",
      "Pipeline management",
    ],
    useCases: [
      "Lead generation",
      "Sales automation",
      "CRM management",
      "Outreach campaigns",
    ],
    integrations: ["Salesforce", "HubSpot", "LinkedIn", "Gmail", "Zoom"],
    pricing: "Premium",
    popular: true,
  },
  {
    id: "luna-support",
    name: "Luna - AI Customer Support Specialist",
    category: "Support",
    icon: "/img/luna.png",
    personality: "Empathetic, solution-oriented, patient",
    tagline:
      "Your AI support specialist that cares—responds to tickets, escalates issues, and solves problems with genuine care.",
    description:
      "Key Capabilities: Ticket response, issue escalation, problem solving, customer satisfaction.",
    longDescription:
      "Clide is your AI customer support specialist who genuinely cares about your customers. He responds to tickets with empathy and efficiency, escalates complex issues to the right people, takes proactive actions to solve problems, and ensures every customer interaction ends with satisfaction. Clide's patience and problem-solving skills are unmatched.",
    capabilities: [
      "Respond to Tickets",
      "Escalate Issues",
      "Take Actions",
      "Solve Problems",
      "Knowledge base search",
      "Customer satisfaction tracking",
      "Multi-channel support",
      "Issue resolution",
    ],
    useCases: [
      "Customer support",
      "Ticket management",
      "Issue resolution",
      "Customer satisfaction",
    ],
    integrations: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Discord"],
    pricing: "Standard",
    popular: true,
  },
  {
    id: "nova-marketing",
    name: "Nova - AI Marketing Associate",
    category: "Marketing",
    icon: "/img/nova.png",
    personality: "Creative, brand-focused, strategic",
    tagline:
      "Your AI marketing associate that creates—writes content, manages social media, and builds your brand voice.",
    description:
      "Key Capabilities: Content creation, SEO optimization, social media management, brand voice consistency.",
    longDescription:
      "Suki is your AI marketing associate with a creative flair and strategic mindset. She writes compelling blog posts, runs SEO campaigns that drive traffic, manages your social media presence with consistency, and maintains your brand voice across all channels. Suki's creativity and strategic thinking help build your brand's presence and authority.",
    capabilities: [
      "Write Blog Posts",
      "Run SEO",
      "Manage Social Media",
      "Write with Brand Voice",
      "Content strategy",
      "Social media scheduling",
      "Analytics tracking",
      "Campaign optimization",
    ],
    useCases: [
      "Content marketing",
      "SEO campaigns",
      "Social media management",
      "Brand building",
    ],
    integrations: [
      "WordPress",
      "Hootsuite",
      "Google Analytics",
      "Mailchimp",
      "Canva",
    ],
    pricing: "Standard",
    popular: true,
  },
  {
    id: "hr-recruiter",
    name: "HR Recruiter Assistant",
    category: "HR",
    icon: "/img/hr-recruiter.png",
    tagline:
      "Automate your recruitment pipeline—source candidates, screen resumes, and schedule interviews automatically.",
    description:
      "Key Capabilities: Candidate sourcing, resume screening, intelligent communication.",
    longDescription:
      "The HR Recruiter Agent revolutionizes your hiring process by automating candidate sourcing from multiple job boards, intelligent resume screening using AI, automated initial outreach, and seamless interview scheduling. Perfect for high-volume recruitment.",
    capabilities: [
      "Automated candidate sourcing across platforms",
      "AI-powered resume screening and parsing",
      "Intelligent candidate communication",
      "Automated interview scheduling",
      "Candidate database management",
      "Integration with ATS systems",
    ],
    useCases: [
      "High-volume recruitment campaigns",
      "Tech talent acquisition",
      "Seasonal hiring",
      "Campus recruitment",
    ],
    integrations: ["LinkedIn", "Indeed", "Google Calendar", "Gmail", "Slack"],
    pricing: "Premium",
    popular: true,
  },
  {
    id: "hr-screener",
    name: "HR Screener Agent",
    category: "HR",
    icon: "/img/hr-recruiter.png",
    tagline: "Smart candidate evaluation",
    description:
      "Advanced screening agent that evaluates candidates based on skills, experience, and cultural fit.",
    longDescription:
      "Deploy an intelligent screening agent that goes beyond keyword matching. Analyzes resumes for relevant experience, conducts skills assessments, evaluates cultural fit, and generates comprehensive screening reports.",
    capabilities: [
      "Advanced resume analysis",
      "Automated skills assessment",
      "Cultural fit evaluation",
      "Reference checking automation",
      "Detailed screening reports",
      "Candidate ranking and scoring",
    ],
    useCases: [
      "Pre-screening large applicant pools",
      "Technical role evaluation",
      "Soft skills assessment",
      "Executive search",
    ],
    integrations: ["LinkedIn", "HackerRank", "Greenhouse", "Lever"],
    pricing: "Standard",
    popular: false,
  },
  {
    id: "sales-representative",
    name: "Sales Representative Assistant",
    category: "Sales",
    icon: "/img/max.png",
    tagline:
      "AI-powered sales automation—generate proposals, qualify leads, and close deals.",
    description:
      "Key Capabilities: Lead qualification, product recommendations, automated proposal generation.",
    longDescription:
      "Transform your sales process with an AI agent that handles lead qualification, product recommendations, proposal generation, meeting scheduling, and follow-up automation. Works around the clock to maximize your sales pipeline.",
    capabilities: [
      "Intelligent lead qualification",
      "Product recommendations",
      "Automated proposal generation",
      "Meeting scheduling",
      "Follow-up automation",
      "CRM integration and updates",
    ],
    useCases: [
      "Inside sales automation",
      "Lead nurturing campaigns",
      "Product demos scheduling",
      "Pipeline management",
    ],
    integrations: ["Salesforce", "HubSpot", "Google Calendar", "Zoom", "Slack"],
    pricing: "Premium",
    popular: true,
  },
  {
    id: "customer-support",
    name: "Customer Support Assistant",
    category: "Support",
    icon: "/img/luna.png",
    tagline:
      "24/7 automated customer service—handle tickets, provide solutions, and escalate when needed.",
    description:
      "Key Capabilities: Automated ticket classification, common query responses, issue search.",
    longDescription:
      "Provide exceptional customer service around the clock with an AI agent that classifies tickets, searches your knowledge base, provides instant responses, handles common issues, and intelligently escalates complex cases to human agents.",
    capabilities: [
      "Automated ticket classification",
      "Instant responses to common queries",
      "Knowledge base search",
      "Smart escalation handling",
      "Multi-channel support (email, chat, social)",
      "Customer satisfaction tracking",
    ],
    useCases: [
      "First-line customer support",
      "After-hours service",
      "FAQ automation",
      "Technical troubleshooting",
    ],
    integrations: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Discord"],
    pricing: "Standard",
    popular: true,
  },
  {
    id: "lead-generation",
    name: "Lead Generation Agent",
    category: "Marketing",
    icon: "/img/product-trio-1.png",
    tagline: "Automated prospect discovery",
    description:
      "Smart lead gen agent that identifies, qualifies, and enriches potential customers automatically.",
    longDescription:
      "Scale your lead generation efforts with an AI agent that identifies ideal prospects, enriches contact data, scores leads based on fit, runs qualification workflows, and syncs everything to your CRM in real-time.",
    capabilities: [
      "Automated prospect identification",
      "Contact data enrichment",
      "Lead scoring and qualification",
      "Automated qualification workflows",
      "CRM synchronization",
      "Campaign performance tracking",
    ],
    useCases: [
      "B2B lead generation",
      "Market expansion",
      "Account-based marketing",
      "Event lead follow-up",
    ],
    integrations: [
      "LinkedIn Sales Navigator",
      "HubSpot",
      "ZoomInfo",
      "Clearbit",
    ],
    pricing: "Standard",
    popular: false,
  },
  {
    id: "outbound-sales",
    name: "Outbound Sales Assistant",
    category: "Sales",
    icon: "/img/max.png",
    tagline:
      "Cold outreach that converts—automate outbound sales, LinkedIn outreach, and meeting bookings.",
    description:
      "Key Capabilities: Personalized email campaigns, LinkedIn automation (within limits), automated meeting booking.",
    longDescription:
      "Master cold outreach with an AI agent that crafts personalized emails, automates LinkedIn connections and messages, books qualified meetings, manages follow-up sequences, and tracks engagement across all touchpoints.",
    capabilities: [
      "Personalized cold email campaigns",
      "LinkedIn automation (within limits)",
      "Automated meeting booking",
      "Multi-touch follow-up sequences",
      "Engagement tracking",
      "A/B testing and optimization",
    ],
    useCases: [
      "Cold email campaigns",
      "LinkedIn prospecting",
      "Meeting generation",
      "Sales development (SDR automation)",
    ],
    integrations: ["Lemlist", "Apollo", "LinkedIn", "Calendly", "Salesforce"],
    pricing: "Premium",
    popular: true,
  },
];

export const categories = [
  { id: "all", name: "All Templates", count: agentTemplates.length },
  {
    id: "HR",
    name: "Human Resources",
    count: agentTemplates.filter((t) => t.category === "HR").length,
  },
  {
    id: "Sales",
    name: "Sales",
    count: agentTemplates.filter((t) => t.category === "Sales").length,
  },
  {
    id: "Support",
    name: "Customer Support",
    count: agentTemplates.filter((t) => t.category === "Support").length,
  },
  {
    id: "Marketing",
    name: "Marketing",
    count: agentTemplates.filter((t) => t.category === "Marketing").length,
  },
];

export const getTemplateById = (id) => {
  return agentTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category) => {
  if (category === "all") return agentTemplates;
  return agentTemplates.filter((template) => template.category === category);
};

export const getPopularTemplates = () => {
  return agentTemplates.filter((template) => template.popular);
};
