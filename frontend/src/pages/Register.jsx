/**
 * Registration Page Component - Redesigned with Tailwind CSS & Framer Motion
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import PasswordStrength from "../components/auth/PasswordStrength";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.full_name) {
      errors.full_name = "Full name is required";
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = "Name must be at least 2 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      errors.terms = "You must agree to the Terms of Service";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await register({
      email: formData.email,
      full_name: formData.full_name,
      password: formData.password,
    });

    if (success) {
      navigate("/dashboard");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-effect rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join AgentGarden
          </h1>
          <p className="text-gray-600">
            Start building AI agents with pre-built templates
          </p>
        </motion.div>

        {/* Social Login Buttons */}
        <motion.div variants={itemVariants}>
          <SocialLoginButtons mode="signup" />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.full_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white/50"
              }`}
              placeholder="John Doe"
            />
            <AnimatePresence>
              {validationErrors.full_name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs mt-1 font-medium"
                >
                  {validationErrors.full_name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white/50"
              }`}
              placeholder="you@example.com"
            />
            <AnimatePresence>
              {validationErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs mt-1 font-medium"
                >
                  {validationErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white/50"
              }`}
              placeholder="Create a strong password"
            />
            <AnimatePresence>
              {validationErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs mt-1 font-medium"
                >
                  {validationErrors.password}
                </motion.p>
              )}
            </AnimatePresence>
            <PasswordStrength password={formData.password} />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white/50"
              }`}
              placeholder="Confirm your password"
            />
            <AnimatePresence>
              {validationErrors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs mt-1 font-medium"
                >
                  {validationErrors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Terms of Service */}
          <div>
            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (validationErrors.terms) {
                    setValidationErrors((prev) => {
                      const { terms, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`w-4 h-4 mt-0.5 text-primary-600 border-2 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                  validationErrors.terms ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span className="ml-2 text-sm text-gray-700 leading-tight">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            <AnimatePresence>
              {validationErrors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600 text-xs mt-1 font-medium"
                >
                  {validationErrors.terms}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg transition-all ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl hover:shadow-primary-500/30"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;
