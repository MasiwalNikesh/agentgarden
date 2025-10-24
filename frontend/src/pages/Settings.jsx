import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccess, setShowSuccess] = useState(false);

  // TODO: Replace with actual user data from API/store
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Corp",
    role: "Product Manager",
    avatar: null,
  });

  const [accountData, setAccountData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [billingData] = useState({
    plan: "Pro",
    billingCycle: "Monthly",
    amount: "$49/month",
    nextBillingDate: "April 1, 2024",
    paymentMethod: "•••• 4242",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: {
      agentAlerts: true,
      weeklyReports: true,
      productUpdates: false,
      billing: true,
    },
    inAppNotifications: {
      agentStatus: true,
      taskCompletion: true,
      errors: true,
    },
  });

  const [apiKeys] = useState([
    {
      id: 1,
      name: "Production API Key",
      key: "ak_live_••••••••••••1234",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
    },
    {
      id: 2,
      name: "Development API Key",
      key: "ak_test_••••••••••••5678",
      created: "2024-02-10",
      lastUsed: "5 days ago",
    },
  ]);

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "account", name: "Account", icon: "🔐" },
    { id: "billing", name: "Billing", icon: "💳" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "api", name: "API Keys", icon: "🔑" },
    { id: "team", name: "Team", icon: "👥" },
  ];

  const handleSave = (tabName) => {
    // TODO: Implement actual API call to save settings
    console.log(`Saving ${tabName} settings...`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const ProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h2>
        <p className="text-gray-600">
          Update your personal information and avatar
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {profileData.name.charAt(0)}
        </div>
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors mb-2"
          >
            Upload Photo
          </motion.button>
          <p className="text-sm text-gray-500">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) =>
              setProfileData({ ...profileData, company: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <input
            type="text"
            value={profileData.role}
            onChange={(e) =>
              setProfileData({ ...profileData, role: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSave("profile")}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );

  const AccountTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Security
        </h2>
        <p className="text-gray-600">
          Manage your password and security settings
        </p>
      </div>

      {/* Change Password */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={accountData.currentPassword}
              onChange={(e) =>
                setAccountData({
                  ...accountData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={accountData.newPassword}
              onChange={(e) =>
                setAccountData({ ...accountData, newPassword: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={accountData.confirmPassword}
              onChange={(e) =>
                setAccountData({
                  ...accountData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave("password")}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Update Password
          </motion.button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={() =>
              setAccountData({
                ...accountData,
                twoFactorEnabled: !accountData.twoFactorEnabled,
              })
            }
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              accountData.twoFactorEnabled ? "bg-primary-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                accountData.twoFactorEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const BillingTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Billing & Subscription
        </h2>
        <p className="text-gray-600">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Plan</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-gradient">
              {billingData.plan}
            </p>
            <p className="text-gray-600">{billingData.amount}</p>
            <p className="text-sm text-gray-500 mt-2">
              Next billing: {billingData.nextBillingDate}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Change Plan
          </motion.button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Payment Method
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {billingData.paymentMethod}
              </p>
              <p className="text-sm text-gray-500">Expires 12/2025</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Update
          </motion.button>
        </div>
      </div>

      {/* Billing History */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Invoices
        </h3>
        <div className="space-y-3">
          {[
            { date: "Mar 1, 2024", amount: "$49.00", status: "Paid" },
            { date: "Feb 1, 2024", amount: "$49.00", status: "Paid" },
            { date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
          ].map((invoice, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{invoice.date}</p>
                <p className="text-sm text-gray-500">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {invoice.status}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const NotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-600">
          Choose what notifications you want to receive
        </p>
      </div>

      {/* Email Notifications */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Email Notifications
        </h3>
        <div className="space-y-4">
          {Object.entries(notificationPrefs.emailNotifications).map(
            ([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === "agentAlerts" &&
                      "Get notified when agents encounter issues"}
                    {key === "weeklyReports" &&
                      "Receive weekly performance summaries"}
                    {key === "productUpdates" &&
                      "Stay informed about new features"}
                    {key === "billing" && "Payment and subscription updates"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      emailNotifications: {
                        ...notificationPrefs.emailNotifications,
                        [key]: !value,
                      },
                    })
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    value ? "bg-primary-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          In-App Notifications
        </h3>
        <div className="space-y-4">
          {Object.entries(notificationPrefs.inAppNotifications).map(
            ([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inAppNotifications: {
                        ...notificationPrefs.inAppNotifications,
                        [key]: !value,
                      },
                    })
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    value ? "bg-primary-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSave("notifications")}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Save Preferences
        </motion.button>
      </div>
    </motion.div>
  );

  const APITab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API Keys</h2>
          <p className="text-gray-600">
            Manage your API keys for programmatic access
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          + Generate New Key
        </motion.button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="glass-effect rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {apiKey.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Revoke
              </motion.button>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-700">
                {apiKey.key}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </div>
        ))}
      </div>

      {/* API Documentation Link */}
      <div className="glass-effect rounded-xl p-6 border-2 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">📚</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              API Documentation
            </h3>
            <p className="text-sm text-gray-600">
              Learn how to integrate AgentGarden into your applications
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            View Docs
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const TeamTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Team Members
          </h2>
          <p className="text-gray-600">Invite and manage team members</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          + Invite Member
        </motion.button>
      </div>

      {/* Team Members List */}
      <div className="glass-effect rounded-xl p-6">
        <div className="space-y-4">
          {[
            {
              name: "John Doe",
              email: "john@example.com",
              role: "Owner",
              avatar: "J",
            },
            {
              name: "Jane Smith",
              email: "jane@example.com",
              role: "Admin",
              avatar: "J",
            },
            {
              name: "Bob Johnson",
              email: "bob@example.com",
              role: "Member",
              avatar: "B",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  defaultValue={member.role}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
                {member.role !== "Owner" && (
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Notice */}
      <div className="glass-effect rounded-xl p-6 border-2 border-accent-200 bg-gradient-to-br from-accent-50 to-primary-50">
        <div className="flex items-start gap-4">
          <div className="text-3xl">👥</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Team Collaboration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to Pro to add unlimited team members and collaborate on
              workflows
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Upgrade Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "account":
        return <AccountTab />;
      case "billing":
        return <BillingTab />;
      case "notifications":
        return <NotificationsTab />;
      case "api":
        return <APITab />;
      case "team":
        return <TeamTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 px-6 py-4 bg-green-500 text-white rounded-lg shadow-xl flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
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
            <span className="font-semibold">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Tabs and Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="glass-effect rounded-2xl p-4 shadow-lg sticky top-24">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="flex-1">
            <div className="glass-effect rounded-2xl p-8 shadow-lg">
              <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
