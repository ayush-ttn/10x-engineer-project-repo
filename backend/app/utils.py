"""Utility functions for PromptLab"""

from typing import List
from app.models import Prompt


def sort_prompts_by_date(prompts: List[Prompt], descending: bool = True) -> List[Prompt]:
    """Sort prompts by creation date.
    
    Sorts in descending order (newest first) if descending=True, otherwise ascending.
    Note: There might be a bug here. Check the sort order!

    Args:
        prompts: A list of Prompt objects to be sorted.
        descending: A boolean indicating the sort order. Defaults to True.

    Returns:
        List[Prompt]: A list of prompts sorted by the creation date.
    """
    return sorted(prompts, key=lambda p: p.created_at, reverse=descending)


def filter_prompts_by_collection(prompts: List[Prompt], collection_id: str) -> List[Prompt]:
    """Filter prompts based on the specified collection ID.

    Args:
        prompts: A list of Prompt objects to filter.
        collection_id: The collection ID to filter the prompts by.

    Returns:
        List[Prompt]: A list of prompts that belong to the specified collection.
    """
    return [p for p in prompts if p.collection_id == collection_id]


def search_prompts(prompts: List[Prompt], query: str) -> List[Prompt]:
    """Search prompts based on a query string in their title or description.

    Args:
        prompts: A list of Prompt objects to search through.
        query: The query string to search for in the prompt title or description.
    Returns:
        List[Prompt]: A list of prompts matching the search criteria.
    """
    query_lower = query.lower()
    return [
        p for p in prompts 
        if query_lower in p.title.lower() or 
           (p.description and query_lower in p.description.lower())
    ]


def validate_prompt_content(content: str) -> bool:
    """Check if prompt content is valid.
    
    A valid prompt should:
    - Not be empty
    - Not be just whitespace
    - Be at least 10 characters

    Args:
        content: The string content of the prompt to validate.

    Returns:
        bool: True if the content is valid, False otherwise.
    """
    if not content or not content.strip():
        return False
    return len(content.strip()) >= 10


def extract_variables(content: str) -> List[str]:
    """Extract template variables from prompt content.
    
    Variables are in the format {{variable_name}}

    Args:
        content: The string content from which to extract variables.

    Returns:
        List[str]: A list of variable names extracted from the content.
    """
    import re
    pattern = r'\{\{(\w+)\}\}'
    return re.findall(pattern, content)

