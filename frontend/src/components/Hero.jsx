/**
 * Hero Section Component
 */
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1rem 2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Main Headline */}
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: "bold",
            color: "white",
            marginBottom: "1.5rem",
            lineHeight: "1.1",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Intelligent Operations Hub using AI-Powered Workflows
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "1.25rem",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "3rem",
            maxWidth: "700px",
            margin: "0 auto 3rem auto",
            lineHeight: "1.6",
          }}
        >
          Craft AI Assistants with Ready-Made Blueprints. Launch user-designed
          AI assistants using our curated templates for HR, Sales, and Support
          workflows—or build bespoke solutions from the ground up.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <Link
            to="/register"
            style={{
              padding: "1rem 2rem",
              backgroundColor: "white",
              color: "#2563eb",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "600",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s",
              border: "2px solid white",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f8fafc";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 8px -1px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            }}
          >
            Start Building Free
          </Link>

          <Link
            to="/contact"
            style={{
              padding: "1rem 2rem",
              backgroundColor: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "600",
              border: "2px solid white",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#2563eb";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "white";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Watch Demo
          </Link>
        </div>

        {/* Trust Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            opacity: 0.8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>
            <span style={{ color: "white", fontSize: "0.875rem" }}>
              No Credit Card Required
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>
            <span style={{ color: "white", fontSize: "0.875rem" }}>
              Free Trial
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>
            <span style={{ color: "white", fontSize: "0.875rem" }}>
              Setup in Minutes
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "1rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}
              >
                10,000+
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                }}
              >
                Users Building Workflows
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}
              >
                6
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                }}
              >
                Agent Templates
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}
              >
                95%
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                }}
              >
                Success Rate
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}
              >
                24/7
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                }}
              >
                Always Running
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
