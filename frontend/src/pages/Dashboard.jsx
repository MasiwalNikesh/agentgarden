/**
 * Dashboard Page Component
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useWorkflowStore from "../store/workflowStore";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { workflows, fetchWorkflows, isLoading, deleteWorkflow } =
    useWorkflowStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleDelete = async (workflowId) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      await deleteWorkflow(workflowId);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Welcome Header */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 0",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Welcome back, {user?.full_name || user?.email}!
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1rem",
            }}
          >
            Manage your AI workflows and create new automation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {/* Actions Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            My Workflows
          </h2>
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <Link
              to="/templates"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            >
              Browse Templates
            </Link>
            <Link
              to="/workflows/new"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Create New Workflow
            </Link>
          </div>
        </div>

        {/* Workflows Grid */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4rem",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #2563eb",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "1rem",
                }}
              >
                Loading workflows...
              </p>
            </div>
          </div>
        ) : workflows.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              backgroundColor: "white",
              borderRadius: "1rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#f3f4f6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  color: "#9ca3af",
                }}
              >
                🤖
              </span>
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              No workflows yet
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "2rem",
                fontSize: "1rem",
              }}
            >
              Create your first AI workflow to get started with automation
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/templates"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#e5e7eb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
              >
                Browse Templates
              </Link>
              <Link
                to="/workflows/new"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#1d4ed8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
              >
                Create from Scratch
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {workflow.name}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      backgroundColor:
                        workflow.status === "active" ? "#dcfce7" : "#f3f4f6",
                      color:
                        workflow.status === "active" ? "#166534" : "#6b7280",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      textTransform: "capitalize",
                      marginLeft: "1rem",
                    }}
                  >
                    {workflow.status}
                  </span>
                </div>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    marginBottom: "1rem",
                    minHeight: "2.5rem",
                  }}
                >
                  {workflow.description || "No description provided"}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to={`/workflows/${workflow.id}`}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#2563eb",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1d4ed8")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#2563eb")
                    }
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/workflows/${workflow.id}/executions`}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      textDecoration: "none",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#e5e7eb")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#f3f4f6")
                    }
                  >
                    View Executions
                  </Link>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "transparent",
                      color: "#dc2626",
                      border: "1px solid #dc2626",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#dc2626";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#dc2626";
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
