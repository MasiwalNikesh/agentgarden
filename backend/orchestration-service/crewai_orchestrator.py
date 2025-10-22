"""
CrewAI Multi-Agent Orchestration System
Enables collaborative multi-agent workflows with role-based agents
"""
from typing import List, Dict, Any, Optional
import os


class CrewAIOrchestrator:
    """
    CrewAI orchestrator for multi-agent collaboration
    Agents work together with defined roles and goals
    """

    def __init__(self, anthropic_api_key: Optional[str] = None):
        """
        Initialize CrewAI orchestrator

        Args:
            anthropic_api_key: Anthropic API key for Claude models
        """
        self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
        self.crew = None
        self.agents = []
        self.tasks = []

    def create_agent(
        self,
        role: str,
        goal: str,
        backstory: str,
        tools: Optional[List[Any]] = None,
        allow_delegation: bool = True,
        verbose: bool = True
    ) -> Any:
        """
        Create a CrewAI agent with specific role and capabilities

        Args:
            role: Agent's role (e.g., "Researcher", "Writer", "Analyst")
            goal: Agent's primary goal
            backstory: Agent's background and expertise
            tools: List of tools agent can use
            allow_delegation: Whether agent can delegate tasks
            verbose: Enable verbose logging

        Returns:
            CrewAI Agent instance
        """
        try:
            from crewai import Agent
            from langchain_anthropic import ChatAnthropic

            llm = ChatAnthropic(
                model="claude-3-5-sonnet-20241022",
                api_key=self.api_key,
                temperature=0.7
            )

            agent = Agent(
                role=role,
                goal=goal,
                backstory=backstory,
                tools=tools or [],
                llm=llm,
                allow_delegation=allow_delegation,
                verbose=verbose
            )

            self.agents.append(agent)
            return agent

        except ImportError:
            raise ImportError("crewai package required. Install with: pip install crewai crewai-tools langchain-anthropic")

    def create_task(
        self,
        description: str,
        agent: Any,
        expected_output: str,
        context: Optional[List[Any]] = None
    ) -> Any:
        """
        Create a task for an agent

        Args:
            description: Task description
            agent: Agent assigned to task
            expected_output: Description of expected output
            context: List of previous tasks this depends on

        Returns:
            CrewAI Task instance
        """
        try:
            from crewai import Task

            task = Task(
                description=description,
                agent=agent,
                expected_output=expected_output,
                context=context or []
            )

            self.tasks.append(task)
            return task

        except ImportError:
            raise ImportError("crewai package required")

    def create_crew(
        self,
        agents: Optional[List[Any]] = None,
        tasks: Optional[List[Any]] = None,
        process: str = "sequential",
        verbose: bool = True
    ) -> Any:
        """
        Create a crew with agents and tasks

        Args:
            agents: List of agents (uses self.agents if None)
            tasks: List of tasks (uses self.tasks if None)
            process: Execution process ("sequential" or "hierarchical")
            verbose: Enable verbose logging

        Returns:
            CrewAI Crew instance
        """
        try:
            from crewai import Crew, Process

            process_type = Process.sequential if process == "sequential" else Process.hierarchical

            self.crew = Crew(
                agents=agents or self.agents,
                tasks=tasks or self.tasks,
                process=process_type,
                verbose=verbose
            )

            return self.crew

        except ImportError:
            raise ImportError("crewai package required")

    def run_crew(self, inputs: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute the crew workflow

        Args:
            inputs: Input data for the workflow

        Returns:
            Execution result dict
        """
        if not self.crew:
            raise ValueError("Crew not created. Call create_crew() first.")

        result = self.crew.kickoff(inputs=inputs or {})

        return {
            "status": "completed",
            "result": str(result),
            "agents_count": len(self.agents),
            "tasks_count": len(self.tasks)
        }

    def create_predefined_crew(self, crew_type: str) -> Any:
        """
        Create predefined multi-agent crews for common workflows

        Args:
            crew_type: Type of crew ("content_creation", "research", "customer_support")

        Returns:
            Configured Crew instance
        """
        if crew_type == "content_creation":
            return self._create_content_creation_crew()
        elif crew_type == "research":
            return self._create_research_crew()
        elif crew_type == "customer_support":
            return self._create_customer_support_crew()
        else:
            raise ValueError(f"Unknown crew type: {crew_type}")

    def _create_content_creation_crew(self) -> Any:
        """Create a content creation crew with Researcher, Writer, and Editor"""
        # Researcher agent
        researcher = self.create_agent(
            role="Content Researcher",
            goal="Research topics thoroughly and provide comprehensive insights",
            backstory="Expert researcher with deep knowledge across industries",
            allow_delegation=False
        )

        # Writer agent
        writer = self.create_agent(
            role="Content Writer",
            goal="Write engaging, well-structured content based on research",
            backstory="Professional writer with years of experience in content marketing",
            allow_delegation=False
        )

        # Editor agent
        editor = self.create_agent(
            role="Content Editor",
            goal="Review and refine content for clarity, grammar, and impact",
            backstory="Meticulous editor who ensures every piece is polished",
            allow_delegation=False
        )

        # Define tasks
        research_task = self.create_task(
            description="Research the given topic and compile key insights",
            agent=researcher,
            expected_output="Comprehensive research summary with key points and sources"
        )

        writing_task = self.create_task(
            description="Write a compelling article based on the research",
            agent=writer,
            expected_output="Well-written article draft",
            context=[research_task]
        )

        editing_task = self.create_task(
            description="Edit and polish the article for publication",
            agent=editor,
            expected_output="Final polished article ready for publication",
            context=[writing_task]
        )

        return self.create_crew(
            agents=[researcher, writer, editor],
            tasks=[research_task, writing_task, editing_task],
            process="sequential"
        )

    def _create_research_crew(self) -> Any:
        """Create a research crew with Data Collector, Analyst, and Report Writer"""
        collector = self.create_agent(
            role="Data Collector",
            goal="Gather relevant data from multiple sources",
            backstory="Data specialist who knows where to find information",
            allow_delegation=False
        )

        analyst = self.create_agent(
            role="Data Analyst",
            goal="Analyze collected data and identify patterns",
            backstory="Analytical expert who extracts insights from data",
            allow_delegation=False
        )

        reporter = self.create_agent(
            role="Report Writer",
            goal="Create clear, actionable reports from analysis",
            backstory="Report specialist who communicates complex findings simply",
            allow_delegation=False
        )

        collect_task = self.create_task(
            description="Collect all relevant data on the research topic",
            agent=collector,
            expected_output="Organized dataset with sources"
        )

        analyze_task = self.create_task(
            description="Analyze the collected data and identify key insights",
            agent=analyst,
            expected_output="Analysis summary with insights and patterns",
            context=[collect_task]
        )

        report_task = self.create_task(
            description="Create comprehensive research report",
            agent=reporter,
            expected_output="Final research report with recommendations",
            context=[analyze_task]
        )

        return self.create_crew(
            agents=[collector, analyst, reporter],
            tasks=[collect_task, analyze_task, report_task],
            process="sequential"
        )

    def _create_customer_support_crew(self) -> Any:
        """Create customer support crew with Triager, Specialist, and QA"""
        triager = self.create_agent(
            role="Support Triager",
            goal="Classify and prioritize customer issues",
            backstory="Customer support expert who quickly identifies issue types",
            allow_delegation=True
        )

        specialist = self.create_agent(
            role="Support Specialist",
            goal="Resolve customer issues with detailed solutions",
            backstory="Technical support specialist with deep product knowledge",
            allow_delegation=False
        )

        qa = self.create_agent(
            role="Quality Assurance",
            goal="Ensure responses are accurate and helpful",
            backstory="QA specialist who validates support quality",
            allow_delegation=False
        )

        triage_task = self.create_task(
            description="Classify the customer issue and determine priority",
            agent=triager,
            expected_output="Issue classification and priority level"
        )

        resolve_task = self.create_task(
            description="Provide detailed solution to the customer issue",
            agent=specialist,
            expected_output="Complete solution with steps",
            context=[triage_task]
        )

        qa_task = self.create_task(
            description="Review the solution for accuracy and completeness",
            agent=qa,
            expected_output="Validated solution ready to send",
            context=[resolve_task]
        )

        return self.create_crew(
            agents=[triager, specialist, qa],
            tasks=[triage_task, resolve_task, qa_task],
            process="sequential"
        )


class MockCrewAIOrchestrator:
    """Mock CrewAI orchestrator for testing"""

    def __init__(self, *args, **kwargs):
        self.agents = []
        self.tasks = []

    def create_agent(self, role: str, goal: str, backstory: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] CrewAI create_agent: {role}")
        agent = {"role": role, "goal": goal}
        self.agents.append(agent)
        return agent

    def create_task(self, description: str, agent: Any, expected_output: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] CrewAI create_task: {description}")
        task = {"description": description, "agent": agent}
        self.tasks.append(task)
        return task

    def create_crew(self, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] CrewAI create_crew with {len(self.agents)} agents, {len(self.tasks)} tasks")
        return {"crew": "mock", "agents": self.agents, "tasks": self.tasks}

    def run_crew(self, inputs: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        print(f"[MOCK] CrewAI run_crew")
        return {"status": "completed", "result": "Mock crew execution completed", "agents_count": len(self.agents), "tasks_count": len(self.tasks)}

    def create_predefined_crew(self, crew_type: str) -> Any:
        print(f"[MOCK] CrewAI create_predefined_crew: {crew_type}")
        return {"crew_type": crew_type, "status": "created"}
