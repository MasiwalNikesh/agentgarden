"""
Jira client for project management and issue tracking
"""
import os
import requests
from typing import Optional, Dict, Any, List


class JiraClient:
    """
    Jira client for creating/updating issues, managing projects
    """

    def __init__(
        self,
        jira_url: Optional[str] = None,
        email: Optional[str] = None,
        api_token: Optional[str] = None
    ):
        """
        Initialize Jira client

        Args:
            jira_url: Jira instance URL (e.g., https://yourcompany.atlassian.net)
            email: Jira account email
            api_token: Jira API token
        """
        self.jira_url = (jira_url or os.getenv("JIRA_URL", "")).rstrip("/")
        self.email = email or os.getenv("JIRA_EMAIL")
        self.api_token = api_token or os.getenv("JIRA_API_TOKEN")
        self.api_base = f"{self.jira_url}/rest/api/3"

    def _get_headers(self) -> Dict[str, str]:
        """Get auth headers"""
        return {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

    def _get_auth(self):
        """Get basic auth tuple"""
        return (self.email, self.api_token)

    def create_issue(
        self,
        project_key: str,
        summary: str,
        description: str,
        issue_type: str = "Task",
        priority: str = "Medium",
        assignee: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a Jira issue

        Args:
            project_key: Project key (e.g., "PROJ")
            summary: Issue title
            description: Issue description
            issue_type: Issue type (Task, Bug, Story, etc.)
            priority: Priority (Highest, High, Medium, Low, Lowest)
            assignee: Assignee account ID

        Returns:
            Created issue dict
        """
        payload = {
            "fields": {
                "project": {"key": project_key},
                "summary": summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": description}]
                        }
                    ]
                },
                "issuetype": {"name": issue_type},
                "priority": {"name": priority}
            }
        }

        if assignee:
            payload["fields"]["assignee"] = {"accountId": assignee}

        response = requests.post(
            f"{self.api_base}/issue",
            auth=self._get_auth(),
            headers=self._get_headers(),
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        result = response.json()
        return {
            "id": result["id"],
            "key": result["key"],
            "self": result["self"]
        }

    def get_issue(self, issue_key: str) -> Dict[str, Any]:
        """Get issue details"""
        response = requests.get(
            f"{self.api_base}/issue/{issue_key}",
            auth=self._get_auth(),
            headers=self._get_headers(),
            timeout=10
        )
        response.raise_for_status()

        issue = response.json()
        return {
            "key": issue["key"],
            "summary": issue["fields"]["summary"],
            "status": issue["fields"]["status"]["name"],
            "assignee": issue["fields"].get("assignee", {}).get("displayName"),
            "created": issue["fields"]["created"]
        }

    def update_issue_status(
        self,
        issue_key: str,
        transition_name: str
    ) -> Dict[str, str]:
        """
        Update issue status via transition

        Args:
            issue_key: Issue key (e.g., "PROJ-123")
            transition_name: Transition name (e.g., "Done", "In Progress")
        """
        # Get available transitions
        transitions_response = requests.get(
            f"{self.api_base}/issue/{issue_key}/transitions",
            auth=self._get_auth(),
            headers=self._get_headers(),
            timeout=10
        )
        transitions_response.raise_for_status()

        transitions = transitions_response.json()["transitions"]
        transition_id = next(
            (t["id"] for t in transitions if t["name"].lower() == transition_name.lower()),
            None
        )

        if not transition_id:
            raise ValueError(f"Transition '{transition_name}' not found")

        response = requests.post(
            f"{self.api_base}/issue/{issue_key}/transitions",
            auth=self._get_auth(),
            headers=self._get_headers(),
            json={"transition": {"id": transition_id}},
            timeout=10
        )
        response.raise_for_status()

        return {"status": "success", "transition": transition_name}


class MockJiraClient:
    """Mock Jira client"""

    def create_issue(self, project_key: str, summary: str, description: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Jira create_issue: {project_key} - {summary}")
        return {"id": "10001", "key": f"{project_key}-123", "self": "https://mock.atlassian.net"}

    def get_issue(self, issue_key: str) -> Dict[str, Any]:
        print(f"[MOCK] Jira get_issue: {issue_key}")
        return {"key": issue_key, "summary": "Mock issue", "status": "Open"}

    def update_issue_status(self, issue_key: str, transition_name: str) -> Dict[str, str]:
        print(f"[MOCK] Jira update_issue_status: {issue_key} → {transition_name}")
        return {"status": "success", "transition": transition_name}
