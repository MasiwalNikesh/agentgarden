"""
Orchestration service for executing workflows with LangChain agents
"""
from typing import Dict, Any, List
from uuid import UUID
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from ..agents.base_agent import BaseAgent
from ..agents.tool_factory import ToolFactory
from backend.shared.aws_utils import secrets_manager


class OrchestrationService:
    """
    Service for orchestrating workflow executions using LangChain agents
    """

    @staticmethod
    async def execute_workflow(
        workflow_data: Dict[str, Any],
        input_data: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        """
        Execute a workflow using LangChain agents

        Args:
            workflow_data: The workflow definition (React Flow nodes/edges)
            input_data: Input data for the workflow
            user_id: User ID for retrieving credentials

        Returns:
            Execution result with output and logs
        """
        execution_logs = []

        try:
            # Retrieve user credentials from AWS Secrets Manager
            credentials = {}
            if secrets_manager:
                try:
                    credentials = secrets_manager.get_secret(f"user/{user_id}/credentials")
                except Exception as e:
                    execution_logs.append({
                        "level": "warning",
                        "message": f"Could not retrieve credentials: {str(e)}"
                    })

            # Create tools from workflow definition
            tools = ToolFactory.create_tools_from_workflow(workflow_data, credentials)

            execution_logs.append({
                "level": "info",
                "message": f"Created {len(tools)} tools for workflow execution"
            })

            # Extract system prompt from workflow or use default
            system_prompt = workflow_data.get("system_prompt",
                "You are a helpful AI assistant that helps users automate their workflows. "
                "Use the available tools to complete the user's request."
            )

            # Create agent
            agent = BaseAgent(
                system_prompt=system_prompt,
                tools=tools,
                memory_enabled=True
            )

            execution_logs.append({
                "level": "info",
                "message": "Agent initialized, starting execution"
            })

            # Execute workflow
            user_input = input_data.get("input", "Please execute the workflow")
            result = await agent.aexecute(user_input)

            if result["success"]:
                execution_logs.append({
                    "level": "info",
                    "message": "Workflow completed successfully"
                })

                return {
                    "status": "completed",
                    "output": result["output"],
                    "logs": execution_logs,
                    "intermediate_steps": result.get("intermediate_steps", [])
                }
            else:
                execution_logs.append({
                    "level": "error",
                    "message": f"Workflow execution failed: {result.get('error')}"
                })

                return {
                    "status": "failed",
                    "error": result.get("error"),
                    "output": None,
                    "logs": execution_logs
                }

        except Exception as e:
            execution_logs.append({
                "level": "error",
                "message": f"Unexpected error: {str(e)}"
            })

            return {
                "status": "failed",
                "error": str(e),
                "output": None,
                "logs": execution_logs
            }

    @staticmethod
    def validate_workflow(workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate a workflow definition

        Args:
            workflow_data: The workflow definition to validate

        Returns:
            Validation result with any errors or warnings
        """
        errors = []
        warnings = []

        # Check for required fields
        if "nodes" not in workflow_data:
            errors.append("Workflow must contain 'nodes' field")

        if "edges" not in workflow_data:
            errors.append("Workflow must contain 'edges' field")

        # Validate nodes
        nodes = workflow_data.get("nodes", [])
        if len(nodes) == 0:
            warnings.append("Workflow has no nodes")

        # Check for disconnected nodes
        edges = workflow_data.get("edges", [])
        connected_nodes = set()
        for edge in edges:
            connected_nodes.add(edge.get("source"))
            connected_nodes.add(edge.get("target"))

        for node in nodes:
            if node.get("id") not in connected_nodes:
                warnings.append(f"Node {node.get('id')} is not connected")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }
