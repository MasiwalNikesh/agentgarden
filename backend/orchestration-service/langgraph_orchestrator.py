"""
LangGraph State Machine Orchestration
Enables cyclic, stateful workflows with conditional branching and loops
"""
from typing import Dict, Any, List, Optional, Callable, TypedDict
import os


class WorkflowState(TypedDict, total=False):
    """Base workflow state structure"""
    messages: List[Dict[str, Any]]
    current_step: str
    data: Dict[str, Any]
    iteration_count: int
    errors: List[str]


class LangGraphOrchestrator:
    """
    LangGraph orchestrator for stateful, cyclic workflows
    Supports conditional branching, loops, and checkpointing
    """

    def __init__(self, anthropic_api_key: Optional[str] = None):
        """
        Initialize LangGraph orchestrator

        Args:
            anthropic_api_key: Anthropic API key for Claude models
        """
        self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        self.graph = None
        self.checkpointer = None

    def create_graph(self) -> Any:
        """
        Create a new StateGraph

        Returns:
            StateGraph instance
        """
        try:
            from langgraph.graph import StateGraph

            self.graph = StateGraph(WorkflowState)
            return self.graph

        except ImportError:
            raise ImportError("langgraph package required. Install with: pip install langgraph")

    def add_node(
        self,
        name: str,
        function: Callable[[WorkflowState], WorkflowState]
    ):
        """
        Add a node to the graph

        Args:
            name: Node name
            function: Function that processes state
        """
        if not self.graph:
            raise ValueError("Graph not created. Call create_graph() first.")

        self.graph.add_node(name, function)

    def add_edge(self, from_node: str, to_node: str):
        """Add a standard edge between nodes"""
        if not self.graph:
            raise ValueError("Graph not created")

        self.graph.add_edge(from_node, to_node)

    def add_conditional_edge(
        self,
        from_node: str,
        condition_function: Callable[[WorkflowState], str],
        edge_mapping: Dict[str, str]
    ):
        """
        Add conditional edge that routes based on state

        Args:
            from_node: Source node
            condition_function: Function that returns next node name
            edge_mapping: Map of condition results to node names
        """
        if not self.graph:
            raise ValueError("Graph not created")

        self.graph.add_conditional_edges(from_node, condition_function, edge_mapping)

    def set_entry_point(self, node_name: str):
        """Set the entry point of the graph"""
        if not self.graph:
            raise ValueError("Graph not created")

        self.graph.set_entry_point(node_name)

    def set_finish_point(self, node_name: str):
        """Set the finish point of the graph"""
        if not self.graph:
            raise ValueError("Graph not created")

        self.graph.set_finish_point(node_name)

    def compile_graph(self, enable_checkpointing: bool = True) -> Any:
        """
        Compile the graph for execution

        Args:
            enable_checkpointing: Enable state checkpointing for long-running workflows

        Returns:
            Compiled graph
        """
        if not self.graph:
            raise ValueError("Graph not created")

        try:
            if enable_checkpointing:
                from langgraph.checkpoint.memory import MemorySaver
                self.checkpointer = MemorySaver()
                return self.graph.compile(checkpointer=self.checkpointer)
            else:
                return self.graph.compile()

        except ImportError:
            # Fallback without checkpointing
            return self.graph.compile()

    def run_graph(
        self,
        initial_state: WorkflowState,
        thread_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute the compiled graph

        Args:
            initial_state: Initial workflow state
            thread_id: Optional thread ID for checkpointing

        Returns:
            Final state
        """
        if not self.graph:
            raise ValueError("Graph not compiled")

        compiled = self.compile_graph()

        config = {}
        if thread_id and self.checkpointer:
            config = {"configurable": {"thread_id": thread_id}}

        result = compiled.invoke(initial_state, config=config)

        return result

    def create_conditional_workflow(self) -> Any:
        """
        Create a conditional workflow example with branching logic
        Demonstrates approval workflow with retry loop
        """
        self.create_graph()

        # Define node functions
        def start_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "started"
            state["iteration_count"] = 0
            return state

        def process_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "processing"
            # Simulate processing
            state["data"] = {"processed": True, "needs_approval": True}
            return state

        def approval_check(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "checking_approval"
            # Simulate approval check
            is_approved = state["data"].get("approved", False)
            state["data"]["approval_result"] = "approved" if is_approved else "pending"
            return state

        def approval_router(state: WorkflowState) -> str:
            """Router function - returns next node name based on state"""
            if state["data"].get("approval_result") == "approved":
                return "complete"
            elif state["iteration_count"] < 3:
                return "retry"
            else:
                return "escalate"

        def retry_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "retrying"
            state["iteration_count"] += 1
            return state

        def escalate_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "escalated"
            state["data"]["escalated"] = True
            return state

        def complete_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "completed"
            return state

        # Build graph
        self.add_node("start", start_node)
        self.add_node("process", process_node)
        self.add_node("approval_check", approval_check)
        self.add_node("retry", retry_node)
        self.add_node("escalate", escalate_node)
        self.add_node("complete", complete_node)

        # Add edges
        self.set_entry_point("start")
        self.add_edge("start", "process")
        self.add_edge("process", "approval_check")

        # Conditional routing from approval_check
        self.add_conditional_edge(
            "approval_check",
            approval_router,
            {
                "complete": "complete",
                "retry": "retry",
                "escalate": "escalate"
            }
        )

        self.add_edge("retry", "approval_check")  # Loop back
        self.set_finish_point("complete")
        self.set_finish_point("escalate")

        return self.compile_graph()

    def create_agent_loop_workflow(self) -> Any:
        """
        Create an agent loop workflow with tool calling
        Agent repeatedly calls tools until task is complete
        """
        self.create_graph()

        def agent_node(state: WorkflowState) -> WorkflowState:
            # Agent decides what to do next
            state["current_step"] = "agent_thinking"
            # Simulate agent decision
            state["data"]["agent_decision"] = "call_tool"  # or "finish"
            return state

        def tool_node(state: WorkflowState) -> WorkflowState:
            # Execute tool
            state["current_step"] = "executing_tool"
            state["iteration_count"] += 1
            # Simulate tool execution
            state["data"]["tool_result"] = f"Result from iteration {state['iteration_count']}"
            return state

        def should_continue(state: WorkflowState) -> str:
            """Decide whether to continue or finish"""
            if state["data"].get("agent_decision") == "finish":
                return "end"
            elif state["iteration_count"] >= 5:
                return "end"
            else:
                return "continue"

        def end_node(state: WorkflowState) -> WorkflowState:
            state["current_step"] = "finished"
            return state

        # Build graph
        self.add_node("agent", agent_node)
        self.add_node("tool", tool_node)
        self.add_node("end", end_node)

        self.set_entry_point("agent")

        # Agent → Tool → Agent (loop) or End
        self.add_conditional_edge(
            "agent",
            should_continue,
            {
                "continue": "tool",
                "end": "end"
            }
        )
        self.add_edge("tool", "agent")  # Loop back to agent
        self.set_finish_point("end")

        return self.compile_graph()


class MockLangGraphOrchestrator:
    """Mock LangGraph orchestrator for testing"""

    def __init__(self, *args, **kwargs):
        self.graph = {"nodes": [], "edges": []}

    def create_graph(self) -> Dict[str, Any]:
        print("[MOCK] LangGraph create_graph")
        return self.graph

    def add_node(self, name: str, function: Callable):
        print(f"[MOCK] LangGraph add_node: {name}")
        self.graph["nodes"].append(name)

    def add_edge(self, from_node: str, to_node: str):
        print(f"[MOCK] LangGraph add_edge: {from_node} → {to_node}")
        self.graph["edges"].append((from_node, to_node))

    def add_conditional_edge(self, from_node: str, condition_function: Callable, edge_mapping: Dict[str, str]):
        print(f"[MOCK] LangGraph add_conditional_edge from {from_node}")
        for target in edge_mapping.values():
            self.graph["edges"].append((from_node, target))

    def compile_graph(self, **kwargs) -> Dict[str, Any]:
        print("[MOCK] LangGraph compile_graph")
        return self.graph

    def run_graph(self, initial_state: WorkflowState, **kwargs) -> Dict[str, Any]:
        print("[MOCK] LangGraph run_graph")
        return {"current_step": "completed", "data": {"mock": True}}

    def create_conditional_workflow(self) -> Dict[str, Any]:
        print("[MOCK] LangGraph create_conditional_workflow")
        return {"workflow_type": "conditional", "status": "created"}

    def create_agent_loop_workflow(self) -> Dict[str, Any]:
        print("[MOCK] LangGraph create_agent_loop_workflow")
        return {"workflow_type": "agent_loop", "status": "created"}
