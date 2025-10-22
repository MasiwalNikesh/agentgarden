"""
E2B Code Execution Sandbox
Secure Python code execution environment for agents
"""
import os
from typing import Optional, Dict, Any


class E2BCodeExecutor:
    """
    E2B sandbox for secure code execution
    Agents can run Python code, generate charts, analyze data
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize E2B executor

        Args:
            api_key: E2B API key
        """
        self.api_key = api_key or os.getenv("E2B_API_KEY")
        self.sandbox = None

    def create_sandbox(self, template: str = "base") -> Dict[str, str]:
        """
        Create a new sandbox environment

        Args:
            template: Sandbox template ("base", "data-analysis", "nodejs")

        Returns:
            Sandbox info
        """
        try:
            from e2b_code_interpreter import Sandbox

            self.sandbox = Sandbox(api_key=self.api_key, template=template)

            return {
                "sandbox_id": self.sandbox.id,
                "status": "created",
                "template": template
            }

        except ImportError:
            raise ImportError("e2b-code-interpreter required. Install with: pip install e2b-code-interpreter")

    def execute_code(
        self,
        code: str,
        language: str = "python"
    ) -> Dict[str, Any]:
        """
        Execute code in sandbox

        Args:
            code: Code to execute
            language: Programming language

        Returns:
            Execution results
        """
        if not self.sandbox:
            self.create_sandbox()

        try:
            execution = self.sandbox.run_code(code)

            return {
                "status": "success",
                "stdout": execution.text,
                "stderr": execution.error,
                "results": execution.results,
                "logs": execution.logs
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

    def execute_python_with_files(
        self,
        code: str,
        files: Optional[Dict[str, bytes]] = None
    ) -> Dict[str, Any]:
        """
        Execute Python code with file uploads

        Args:
            code: Python code
            files: Dict of filename -> file content

        Returns:
            Execution results including generated files
        """
        if not self.sandbox:
            self.create_sandbox()

        try:
            # Upload files if provided
            if files:
                for filename, content in files.items():
                    self.sandbox.upload_file(content, filename)

            # Execute code
            execution = self.sandbox.run_code(code)

            # Get generated files
            generated_files = []
            if execution.results:
                for result in execution.results:
                    if hasattr(result, 'formats'):
                        generated_files.append({
                            "type": result.type,
                            "formats": result.formats
                        })

            return {
                "status": "success",
                "stdout": execution.text,
                "stderr": execution.error,
                "generated_files": generated_files,
                "results": execution.results
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

    def install_package(self, package: str) -> Dict[str, str]:
        """Install a Python package in the sandbox"""
        if not self.sandbox:
            self.create_sandbox()

        code = f"!pip install {package}"
        result = self.execute_code(code)

        return {
            "package": package,
            "status": "installed" if result["status"] == "success" else "failed"
        }

    def close_sandbox(self):
        """Close and cleanup sandbox"""
        if self.sandbox:
            self.sandbox.close()
            self.sandbox = None


class MockE2BExecutor:
    """Mock E2B executor"""

    def __init__(self, *args, **kwargs):
        self.sandbox_id = "mock_sandbox_123"

    def create_sandbox(self, template: str = "base") -> Dict[str, str]:
        print(f"[MOCK] E2B create_sandbox: {template}")
        return {
            "sandbox_id": self.sandbox_id,
            "status": "created",
            "template": template
        }

    def execute_code(self, code: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] E2B execute_code: {code[:100]}")
        return {
            "status": "success",
            "stdout": "Mock execution output\n42",
            "stderr": "",
            "results": ["42"],
            "logs": []
        }

    def execute_python_with_files(self, code: str, files: Optional[Dict[str, bytes]] = None) -> Dict[str, Any]:
        print(f"[MOCK] E2B execute_python_with_files: {len(files or {})} files")
        return {
            "status": "success",
            "stdout": "Code executed successfully",
            "stderr": "",
            "generated_files": [{"type": "image/png", "formats": ["png"]}],
            "results": []
        }

    def install_package(self, package: str) -> Dict[str, str]:
        print(f"[MOCK] E2B install_package: {package}")
        return {"package": package, "status": "installed"}

    def close_sandbox(self):
        print("[MOCK] E2B close_sandbox")
