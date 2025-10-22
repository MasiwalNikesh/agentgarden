"""
LiteLLM Router - Multi-LLM routing, fallbacks, and cost optimization
"""
import os
from typing import Optional, Dict, Any, List


class LiteLLMRouter:
    """
    LiteLLM router for multi-model management
    Automatically routes to best model, handles fallbacks, tracks costs
    """

    def __init__(self):
        """Initialize LiteLLM router"""
        self.router = None
        self._init_router()

    def _init_router(self):
        """Initialize router with model configurations"""
        try:
            import litellm
            from litellm import Router

            # Define model routing configuration
            model_list = [
                {
                    "model_name": "claude-3-5-sonnet",
                    "litellm_params": {
                        "model": "anthropic/claude-3-5-sonnet-20241022",
                        "api_key": os.getenv("ANTHROPIC_API_KEY")
                    }
                },
                {
                    "model_name": "gpt-4",
                    "litellm_params": {
                        "model": "gpt-4-turbo-preview",
                        "api_key": os.getenv("OPENAI_API_KEY")
                    }
                },
                {
                    "model_name": "gpt-3.5",
                    "litellm_params": {
                        "model": "gpt-3.5-turbo",
                        "api_key": os.getenv("OPENAI_API_KEY")
                    }
                },
                {
                    "model_name": "claude-3-haiku",
                    "litellm_params": {
                        "model": "anthropic/claude-3-haiku-20240307",
                        "api_key": os.getenv("ANTHROPIC_API_KEY")
                    }
                }
            ]

            self.router = Router(
                model_list=model_list,
                fallbacks=[
                    {"claude-3-5-sonnet": ["gpt-4"]},
                    {"gpt-4": ["claude-3-5-sonnet", "gpt-3.5"]},
                    {"gpt-3.5": ["claude-3-haiku"]}
                ],
                set_verbose=True
            )

            litellm.set_verbose = False  # Reduce noise

        except ImportError:
            raise ImportError("litellm required. Install with: pip install litellm")

    def complete(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-5-sonnet",
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Generate completion with automatic fallbacks

        Args:
            messages: Chat messages
            model: Preferred model name
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate

        Returns:
            Completion response with cost tracking
        """
        if not self.router:
            raise ValueError("Router not initialized")

        try:
            response = self.router.completion(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )

            return {
                "content": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "cost": self._calculate_cost(response)
            }

        except Exception as e:
            return {
                "error": str(e),
                "status": "failed"
            }

    def route_by_complexity(
        self,
        messages: List[Dict[str, str]],
        complexity: str = "medium"
    ) -> Dict[str, Any]:
        """
        Route to appropriate model based on task complexity

        Args:
            messages: Chat messages
            complexity: Task complexity ("low", "medium", "high")

        Returns:
            Completion response
        """
        # Map complexity to models
        model_mapping = {
            "low": "claude-3-haiku",  # Fast and cheap
            "medium": "gpt-3.5",      # Balanced
            "high": "claude-3-5-sonnet"  # Most capable
        }

        model = model_mapping.get(complexity, "gpt-3.5")

        return self.complete(messages, model=model)

    def get_cost_tracking(self) -> Dict[str, Any]:
        """Get cost tracking information"""
        try:
            import litellm
            return {
                "total_cost": litellm.completion_cost,
                "models_used": list(set([]))  # Would need to track separately
            }
        except:
            return {"error": "Cost tracking not available"}

    def _calculate_cost(self, response) -> float:
        """Calculate estimated cost for response"""
        try:
            import litellm
            return litellm.completion_cost(completion_response=response)
        except:
            return 0.0


class MockLiteLLMRouter:
    """Mock LiteLLM router"""

    def __init__(self):
        pass

    def complete(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-5-sonnet",
        **kwargs
    ) -> Dict[str, Any]:
        print(f"[MOCK] LiteLLM complete with {model}")
        return {
            "content": "Mock LLM response from " + model,
            "model": model,
            "usage": {
                "prompt_tokens": 100,
                "completion_tokens": 50,
                "total_tokens": 150
            },
            "cost": 0.0025
        }

    def route_by_complexity(
        self,
        messages: List[Dict[str, str]],
        complexity: str = "medium"
    ) -> Dict[str, Any]:
        print(f"[MOCK] LiteLLM route_by_complexity: {complexity}")
        return self.complete(messages, model=f"model-for-{complexity}")

    def get_cost_tracking(self) -> Dict[str, Any]:
        print("[MOCK] LiteLLM get_cost_tracking")
        return {
            "total_cost": 1.25,
            "models_used": ["claude-3-5-sonnet", "gpt-4", "gpt-3.5"]
        }
