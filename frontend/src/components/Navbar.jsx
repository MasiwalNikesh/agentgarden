/**
 * Navigation Bar Component
 */
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated = false, user = null, onLogout }) => {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#2563eb",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>WorkflowAI</span>
        </Link>

        {/* Navigation Items */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* About link for all users */}
          <Link
            to="/about"
            style={{
              padding: "0.5rem 1rem",
              color: "#374151",
              textDecoration: "none",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            About
          </Link>

          {isAuthenticated ? (
            // Authenticated user menu
            <>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                Welcome, {user?.full_name || user?.email}
              </span>
              <Link
                to="/dashboard"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "0.375rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#dc2626")
                }
              >
                Logout
              </button>
            </>
          ) : (
            // Guest user menu
            <>
              <Link
                to="/login"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "0.375rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "0.375rem",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#1d4ed8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
