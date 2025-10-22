"""
Base agent configuration and setup using LangChain
"""
from typing import List, Dict, Any, Optional
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import Tool
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../../..'))
from backend.shared.config import settings


class BaseAgent:
    """
    Base class for creating LangChain agents with tools and memory
    """

    def __init__(
        self,
        system_prompt: str,
        tools: List[Tool],
        llm_provider: Optional[str] = None,
        memory_enabled: bool = True
    ):
        """
        Initialize the agent

        Args:
            system_prompt: System prompt for the agent
            tools: List of LangChain tools available to the agent
            llm_provider: LLM provider ('anthropic', 'openai', 'bedrock')
            memory_enabled: Whether to enable conversation memory
        """
        self.system_prompt = system_prompt
        self.tools = tools
        self.llm_provider = llm_provider or settings.default_llm_provider
        self.memory_enabled = memory_enabled

        # Initialize LLM
        self.llm = self._initialize_llm()

        # Initialize memory
        self.memory = None
        if memory_enabled:
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )

        # Create agent executor
        self.agent_executor = self._create_agent_executor()

    def _initialize_llm(self):
        """Initialize the LLM based on provider"""
        if self.llm_provider == "anthropic":
            return ChatAnthropic(
                model="claude-3-5-sonnet-20241022",
                anthropic_api_key=settings.anthropic_api_key,
                temperature=0
            )
        elif self.llm_provider == "openai":
            return ChatOpenAI(
                model="gpt-4-turbo-preview",
                openai_api_key=settings.openai_api_key,
                temperature=0
            )
        elif self.llm_provider == "bedrock":
            # AWS Bedrock integration
            from langchain_aws import ChatBedrock
            return ChatBedrock(
                model_id="anthropic.claude-3-5-sonnet-20241022-v2:0",
                region_name=settings.aws_region
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {self.llm_provider}")

    def _create_agent_executor(self) -> AgentExecutor:
        """Create the agent executor with tools and memory"""
        # Create prompt template
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])

        # Create agent
        agent = create_openai_functions_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )

        # Create executor
        executor_kwargs = {
            "agent": agent,
            "tools": self.tools,
            "verbose": True,
            "handle_parsing_errors": True
        }

        if self.memory:
            executor_kwargs["memory"] = self.memory

        return AgentExecutor(**executor_kwargs)

    def execute(self, input_text: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute the agent with the given input

        Args:
            input_text: User input
            context: Additional context for the agent

        Returns:
            Dictionary with agent output and metadata
        """
        try:
            result = self.agent_executor.invoke({"input": input_text})
            return {
                "success": True,
                "output": result.get("output", ""),
                "intermediate_steps": result.get("intermediate_steps", [])
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": None
            }

    async def aexecute(self, input_text: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Async execute the agent with the given input

        Args:
            input_text: User input
            context: Additional context for the agent

        Returns:
            Dictionary with agent output and metadata
        """
        try:
            result = await self.agent_executor.ainvoke({"input": input_text})
            return {
                "success": True,
                "output": result.get("output", ""),
                "intermediate_steps": result.get("intermediate_steps", [])
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": None
            }
