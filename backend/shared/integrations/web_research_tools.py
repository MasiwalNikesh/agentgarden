"""
Web Research Tools - Tavily AI, Firecrawl for agent web access
"""
import os
import requests
from typing import Optional, Dict, Any, List


class TavilySearchClient:
    """
    Tavily AI search client for agent web research
    Optimized for LLM consumption
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Tavily client

        Args:
            api_key: Tavily API key
        """
        self.api_key = api_key or os.getenv("TAVILY_API_KEY")
        self.api_url = "https://api.tavily.com"

    def search(
        self,
        query: str,
        max_results: int = 5,
        search_depth: str = "basic",  # or "advanced"
        include_answer: bool = True,
        include_raw_content: bool = False
    ) -> Dict[str, Any]:
        """
        Perform AI-optimized web search

        Args:
            query: Search query
            max_results: Maximum number of results
            search_depth: "basic" or "advanced"
            include_answer: Include direct answer
            include_raw_content: Include full page content

        Returns:
            Search results optimized for LLMs
        """
        if not self.api_key:
            raise ValueError("Tavily API key not configured")

        payload = {
            "api_key": self.api_key,
            "query": query,
            "max_results": max_results,
            "search_depth": search_depth,
            "include_answer": include_answer,
            "include_raw_content": include_raw_content
        }

        response = requests.post(
            f"{self.api_url}/search",
            json=payload,
            timeout=30
        )
        response.raise_for_status()

        return response.json()

    def extract_content(self, urls: List[str]) -> Dict[str, Any]:
        """
        Extract clean content from URLs

        Args:
            urls: List of URLs to extract

        Returns:
            Extracted content for each URL
        """
        if not self.api_key:
            raise ValueError("Tavily API key not configured")

        payload = {
            "api_key": self.api_key,
            "urls": urls
        }

        response = requests.post(
            f"{self.api_url}/extract",
            json=payload,
            timeout=30
        )
        response.raise_for_status()

        return response.json()


class FirecrawlClient:
    """
    Firecrawl client for web scraping and crawling
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Firecrawl client

        Args:
            api_key: Firecrawl API key
        """
        self.api_key = api_key or os.getenv("FIRECRAWL_API_KEY")
        self.api_url = "https://api.firecrawl.dev"

    def scrape_url(
        self,
        url: str,
        formats: Optional[List[str]] = None  # ["markdown", "html", "links"]
    ) -> Dict[str, Any]:
        """
        Scrape a single URL

        Args:
            url: URL to scrape
            formats: Output formats

        Returns:
            Scraped content in requested formats
        """
        if not self.api_key:
            raise ValueError("Firecrawl API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "url": url,
            "formats": formats or ["markdown"]
        }

        response = requests.post(
            f"{self.api_url}/v1/scrape",
            json=payload,
            headers=headers,
            timeout=60
        )
        response.raise_for_status()

        return response.json()

    def crawl_website(
        self,
        url: str,
        max_pages: int = 10,
        include_paths: Optional[List[str]] = None,
        exclude_paths: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Crawl an entire website

        Args:
            url: Base URL to crawl
            max_pages: Maximum pages to crawl
            include_paths: URL patterns to include
            exclude_paths: URL patterns to exclude

        Returns:
            Crawl job details
        """
        if not self.api_key:
            raise ValueError("Firecrawl API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "url": url,
            "limit": max_pages
        }

        if include_paths:
            payload["includePaths"] = include_paths
        if exclude_paths:
            payload["excludePaths"] = exclude_paths

        response = requests.post(
            f"{self.api_url}/v1/crawl",
            json=payload,
            headers=headers,
            timeout=60
        )
        response.raise_for_status()

        return response.json()


class SerperSearchClient:
    """
    Serper.dev Google Search API client
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Serper client

        Args:
            api_key: Serper API key
        """
        self.api_key = api_key or os.getenv("SERPER_API_KEY")
        self.api_url = "https://google.serper.dev"

    def search(
        self,
        query: str,
        num_results: int = 10,
        search_type: str = "search"  # "search", "images", "news"
    ) -> Dict[str, Any]:
        """
        Perform Google search via Serper

        Args:
            query: Search query
            num_results: Number of results
            search_type: Type of search

        Returns:
            Google search results
        """
        if not self.api_key:
            raise ValueError("Serper API key not configured")

        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

        payload = {
            "q": query,
            "num": num_results
        }

        response = requests.post(
            f"{self.api_url}/{search_type}",
            json=payload,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()

        return response.json()


class MockWebResearchClient:
    """Mock web research client"""

    def search(self, query: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Web search: {query}")
        return {
            "answer": f"Mock answer for: {query}",
            "results": [
                {"title": "Mock Result 1", "url": "https://example.com/1", "content": "Mock content 1"},
                {"title": "Mock Result 2", "url": "https://example.com/2", "content": "Mock content 2"}
            ]
        }

    def scrape_url(self, url: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Scrape URL: {url}")
        return {
            "url": url,
            "markdown": "# Mock Page Content\n\nThis is mock scraped content.",
            "status": "success"
        }

    def crawl_website(self, url: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Crawl website: {url}")
        return {
            "job_id": "mock_job_123",
            "status": "crawling",
            "pages_found": 5
        }

    def extract_content(self, urls: List[str]) -> Dict[str, Any]:
        print(f"[MOCK] Extract content from {len(urls)} URLs")
        return {
            "results": [{"url": url, "content": f"Mock content from {url}"} for url in urls]
        }
