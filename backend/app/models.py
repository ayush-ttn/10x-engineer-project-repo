"""Pydantic models for PromptLab"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import uuid4


def generate_id() -> str:
    """
    Generates a unique identifier using UUID4.

    Returns:
        str: A new unique identifier as a string.
    """
    return str(uuid4())


def get_current_time() -> datetime:
    """
    Retrieves the current UTC time.

    Returns:
        datetime: The current time in UTC.
    """
    return datetime.utcnow()


# ============== Prompt Models ==============

class PromptBase(BaseModel):
    """
    Represents the base structure of a prompt.

    Attributes:
        title: The title of the prompt, must be between 1 and 200 characters.
        content: The main content of the prompt, must not be empty.
        description: An optional description of the prompt, up to 500 characters.
        collection_id: The ID of the collection to which the prompt belongs, or None if unassociated.
    """
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=500)
    collection_id: Optional[str] = None


class PromptCreate(PromptBase):
    """
    Inherits the base structure for creating a new prompt.
    
    Use this model when creating a new prompt instance.
    """
    pass


class PromptUpdate(BaseModel):
    """
    Represents a request to update a prompt with optional fields.
    
    Attributes:
        title: The updated title of the prompt, if provided.
        content: The updated content, if provided.
        description: The updated description, if provided.
        collection_id: The updated collection ID, if provided.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, max_length=500)
    collection_id: Optional[str] = None


class Prompt(PromptBase):
    """
    Represents a stored prompt with metadata such as creation and update timestamps.

    Extends:
        PromptBase with unique identifier and timestamps.

    Attributes:
        id: Unique identifier for the prompt.
        created_at: Timestamp when the prompt was created.
        updated_at: Timestamp when the prompt was last updated.
    """
    id: str = Field(default_factory=generate_id)
    created_at: datetime = Field(default_factory=get_current_time)
    updated_at: datetime = Field(default_factory=get_current_time)

    class Config:
        from_attributes = True


# ============== Collection Models ==============

class CollectionBase(BaseModel):
    """
    Represents the base structure of a collection.

    Attributes:
        name: The name of the collection, must be between 1 and 100 characters.
        description: An optional description of the collection, up to 500 characters.
    """
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class CollectionCreate(CollectionBase):
    """Inherits the base structure for creating a new collection."""
    pass


class Collection(CollectionBase):
    """
    Represents a stored collection with metadata such as a unique identifier and creation timestamp.

    Extends:
        CollectionBase with unique identifier and metadata.

    Attributes:
        id: Unique identifier for the collection.
        created_at: Timestamp when the collection was created.
    """
    id: str = Field(default_factory=generate_id)
    created_at: datetime = Field(default_factory=get_current_time)

    class Config:
        from_attributes = True


# ============== Response Models ==============

class PromptList(BaseModel):
    """
    Represents a list of prompts alongside the total count.

    Attributes:
        prompts: A list of prompt objects.
        total: The total number of prompt objects available.
    """
    prompts: List[Prompt]
    total: int


class CollectionList(BaseModel):
    """
    Represents a list of collections alongside the total count.

    Attributes:
        collections: A list of collection objects.
        total: The total number of collection objects available.
    """
    collections: List[Collection]
    total: int


class HealthResponse(BaseModel):
    """
    Represents the health status of the application with its version.

    Attributes:
        status: A string indicating the current health status.
        version: The version of the application.
    """
    status: str
    version: str

