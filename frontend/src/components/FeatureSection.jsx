/**
 * Reusable Feature Section Component
 */
import React from "react";

const FeatureSection = ({
  title,
  subtitle,
  description,
  features = [],
  imagePosition = "right",
  backgroundColor = "white",
  children,
}) => {
  return (
    <section
      style={{
        backgroundColor,
        padding: "5rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: imagePosition === "left" ? "1fr 1fr" : "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Content */}
        <div
          style={{
            order: imagePosition === "left" ? 2 : 1,
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#2563eb",
                marginBottom: "1rem",
                fontWeight: "600",
              }}
            >
              {subtitle}
            </h3>
          )}

          <p
            style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            {description}
          </p>

          {features.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                    color: "#374151",
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
                      marginRight: "0.75rem",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </span>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>

        {/* Image/Visual */}
        <div
          style={{
            order: imagePosition === "left" ? 1 : 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "400px",
              backgroundColor: "#f3f4f6",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #d1d5db",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Placeholder content */}
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "1rem",
                  margin: "0 auto 1rem auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    color: "#9ca3af",
                  }}
                >
                  📊
                </span>
              </div>
              <p
                style={{
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                Feature Screenshot
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  margin: "0.5rem 0 0 0",
                  opacity: 0.7,
                }}
              >
                Coming Soon
              </p>
            </div>

            {/* Decorative elements */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "60px",
                height: "60px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                opacity: 0.3,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                width: "40px",
                height: "40px",
                backgroundColor: "#fde68a",
                borderRadius: "50%",
                opacity: 0.3,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

