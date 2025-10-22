"""
GitHub client for repository management, issues, and PRs
"""
import os
import requests
from typing import Optional, Dict, Any, List


class GitHubClient:
    """
    GitHub client for creating issues, PRs, and managing repositories
    """

    def __init__(self, token: Optional[str] = None):
        """
        Initialize GitHub client

        Args:
            token: GitHub personal access token
        """
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.api_base = "https://api.github.com"

    def _get_headers(self) -> Dict[str, str]:
        """Get auth headers"""
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }

    def create_issue(
        self,
        repo: str,  # format: "owner/repo"
        title: str,
        body: str,
        labels: Optional[List[str]] = None,
        assignees: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Create GitHub issue

        Args:
            repo: Repository in "owner/repo" format
            title: Issue title
            body: Issue description
            labels: List of label names
            assignees: List of GitHub usernames

        Returns:
            Created issue dict
        """
        payload = {
            "title": title,
            "body": body
        }

        if labels:
            payload["labels"] = labels
        if assignees:
            payload["assignees"] = assignees

        response = requests.post(
            f"{self.api_base}/repos/{repo}/issues",
            headers=self._get_headers(),
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        issue = response.json()
        return {
            "number": issue["number"],
            "title": issue["title"],
            "state": issue["state"],
            "html_url": issue["html_url"],
            "created_at": issue["created_at"]
        }

    def create_pull_request(
        self,
        repo: str,
        title: str,
        head: str,
        base: str,
        body: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a pull request

        Args:
            repo: Repository in "owner/repo" format
            title: PR title
            head: Branch name containing changes
            base: Branch name to merge into
            body: PR description

        Returns:
            Created PR dict
        """
        payload = {
            "title": title,
            "head": head,
            "base": base
        }

        if body:
            payload["body"] = body

        response = requests.post(
            f"{self.api_base}/repos/{repo}/pulls",
            headers=self._get_headers(),
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        pr = response.json()
        return {
            "number": pr["number"],
            "title": pr["title"],
            "state": pr["state"],
            "html_url": pr["html_url"],
            "created_at": pr["created_at"]
        }

    def list_issues(
        self,
        repo: str,
        state: str = "open",
        labels: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """List repository issues"""
        params = {"state": state}
        if labels:
            params["labels"] = ",".join(labels)

        response = requests.get(
            f"{self.api_base}/repos/{repo}/issues",
            headers=self._get_headers(),
            params=params,
            timeout=10
        )
        response.raise_for_status()

        issues = response.json()
        return [
            {
                "number": issue["number"],
                "title": issue["title"],
                "state": issue["state"],
                "labels": [label["name"] for label in issue["labels"]],
                "html_url": issue["html_url"]
            }
            for issue in issues
        ]


class MockGitHubClient:
    """Mock GitHub client"""

    def create_issue(self, repo: str, title: str, body: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] GitHub create_issue in {repo}: {title}")
        return {"number": 42, "title": title, "state": "open", "html_url": f"https://github.com/{repo}/issues/42"}

    def create_pull_request(self, repo: str, title: str, head: str, base: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] GitHub create_pull_request in {repo}: {title}")
        return {"number": 10, "title": title, "state": "open", "html_url": f"https://github.com/{repo}/pull/10"}

    def list_issues(self, repo: str, **kwargs) -> List[Dict[str, Any]]:
        print(f"[MOCK] GitHub list_issues in {repo}")
        return [{"number": 1, "title": "Mock Issue", "state": "open", "labels": [], "html_url": f"https://github.com/{repo}/issues/1"}]
