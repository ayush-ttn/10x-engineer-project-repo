"""In-memory storage for PromptLab

This module provides simple in-memory storage for prompts and collections.
In a production environment, this would be replaced with a database.
"""

from typing import Dict, List, Optional
from app.models import Prompt, Collection


class Storage:
    def __init__(self):
        """Initialize the in-memory storage for prompts and collections.

        This constructor sets up two internal dictionaries to manage and store
        prompts and collections by their unique identifiers.
        """
        self._prompts: Dict[str, Prompt] = {}
        self._collections: Dict[str, Collection] = {}
    
    # ============== Prompt Operations ==============

    def create_prompt(self, prompt: Prompt) -> Prompt:
        """Add a new prompt to the storage.

        Args:
            prompt: The Prompt object to be stored.
        Returns:
            Prompt: The stored Prompt object.
        """
        self._prompts[prompt.id] = prompt
        return prompt
    
    def get_prompt(self, prompt_id: str) -> Optional[Prompt]:
        """Retrieve a prompt by its unique identifier.

        Args:
            prompt_id: The unique identifier of the prompt.
        Returns:
            Optional[Prompt]: The Prompt object if found, otherwise None.
        """
        return self._prompts.get(prompt_id)
    
    def get_all_prompts(self) -> List[Prompt]:
        """Retrieve all prompts from the storage.

        Returns:
            List[Prompt]: A list of all stored Prompt objects.
        """
        return list(self._prompts.values())
    
    def update_prompt(self, prompt_id: str, prompt: Prompt) -> Optional[Prompt]:
        """Update an existing prompt in the storage.

        Args:
            prompt_id: The unique identifier of the prompt to update.
            prompt: The updated Prompt object.

        Returns:
            Optional[Prompt]: The updated Prompt object if the update was successful, otherwise None.
        """
        if prompt_id not in self._prompts:
            return None
        self._prompts[prompt_id] = prompt
        return prompt
    
    def delete_prompt(self, prompt_id: str) -> bool:
        """Remove a prompt from the storage by its unique identifier.

        Args:
            prompt_id: The unique identifier of the prompt to delete.

        Returns:
            bool: True if the prompt was successfully deleted, False otherwise.
        """
        if prompt_id in self._prompts:
            del self._prompts[prompt_id]
            return True
        return False
    
    # ============== Collection Operations ==============
    
    def create_collection(self, collection: Collection) -> Collection:
        """Add a new collection to the storage.

        Args:
            collection: The Collection object to be stored.

        Returns:
            Collection: The stored Collection object.
        """
        self._collections[collection.id] = collection
        return collection
    
    def get_collection(self, collection_id: str) -> Optional[Collection]:
        """Retrieve a collection by its unique identifier.

        Args:
            collection_id: The unique identifier of the collection.

        Returns:
            Optional[Collection]: The Collection object if found, otherwise None.
        """
        return self._collections.get(collection_id)
    
    def get_all_collections(self) -> List[Collection]:
        """Retrieve all collections from the storage.

        Returns:
            List[Collection]: A list of all stored Collection objects.
        """
        return list(self._collections.values())
    
    def delete_collection(self, collection_id: str) -> bool:
        """Remove a collection from the storage by its unique identifier.

        Args:
            collection_id: The unique identifier of the collection to delete.
        Returns:
            bool: True if the collection was successfully deleted, False otherwise.
        """
        if collection_id in self._collections:
            del self._collections[collection_id]
            return True
        return False
    
    def get_prompts_by_collection(self, collection_id: str) -> List[Prompt]:
        """Retrieve prompts assigned to a specific collection.

        Args:
            collection_id: The unique identifier of the collection to find prompts for.

        Returns:
            List[Prompt]: A list of prompts associated with the given collection ID.
        """
        return [p for p in self._prompts.values() if p.collection_id == collection_id]
    
    # ============== Utility ==============
    
    def clear(self):
        """Clear all prompts and collections from the storage.

        Resets the internal dictionaries, removing all stored entries.
        """
        self._prompts.clear()
        self._collections.clear()


# Global storage instance
storage = Storage()
