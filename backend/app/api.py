"""FastAPI routes for PromptLab"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.models import Tag
from typing import Optional

from app.models import (
    Prompt,
    PromptCreate,
    PromptUpdate,
    Collection,
    CollectionCreate,
    PromptList,
    CollectionList,
    HealthResponse,
    get_current_time,
)
from app.storage import storage
from app.utils import sort_prompts_by_date, filter_prompts_by_collection, search_prompts
from app import __version__


app = FastAPI(
    title="PromptLab API",
    description="AI Prompt Engineering Platform",
    version=__version__,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== Health Check ==============


@app.get("/health", response_model=HealthResponse)
def health_check():
    """Perform a health check to ensure the API is running.

    Returns:
        HealthResponse: An object containing the API's health status and version.
    """
    return HealthResponse(status="healthy", version=__version__)

# Utility function for prompt retrieval and validation

def get_existing_prompt(prompt_id: str) -> Prompt:
    """Fetch prompt and validate its existence.

    This function retrieves a prompt from storage by its `prompt_id`.
    If the prompt does not exist, it raises an HTTPException with a 404 status code.

    Args:
        prompt_id: The unique identifier of the prompt to retrieve.

    Returns:
        Prompt: The Prompt object associated with the given `prompt_id` if found.

    Raises:
        HTTPException: If no prompt exists for the given `prompt_id`, a 404 error is raised.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not available")
    return prompt


# ============== Prompt Endpoints ==============


@app.get("/prompts", response_model=PromptList)
def list_prompts(
    collection_id: Optional[str] = None,
    search: Optional[str] = None,
    tags: Optional[str] = Query(None),
):
    """Retrieve a list of prompts, optionally filtered by collection, search terms, and tags.

    Args:
        collection_id: Optional; If provided, filters the prompts by the specified collection.
        search: Optional; If provided, searches prompts based on the given term.
        tags: Optional; Comma-separated list of tags to filter prompts.

    Returns:
        PromptList: A list of prompts with a total count that match the specified criteria.
    """
    prompts = storage.get_all_prompts()

    # Filter by collection if specified
    if collection_id:
        prompts = filter_prompts_by_collection(prompts, collection_id)

    # Search if query provided
    if search:
        prompts = search_prompts(prompts, search)

    # Filter by tags if specified
    if tags:
        tag_set = {tag.strip().lower() for tag in tags.split(",")}
        prompts = [
            prompt
            for prompt in prompts
            if any(tag.name.lower() in tag_set for tag in prompt.tags)
        ]

    # Sort by date (newest first)
    prompts = sort_prompts_by_date(prompts, descending=True)

    return PromptList(prompts=prompts, total=len(prompts))


@app.get(
    "/prompts/{prompt_id}",
    response_model=Prompt,
    responses={
        404: {
            "content": {
                "application/json": {"example": {"error": "Prompt not available"}}
            }
        }
    },
)
def get_prompt(prompt_id: str):
    """Retrieve a prompt by its unique identifier.

    Args:
        prompt_id: The unique identifier of the prompt to retrieve.

    Returns:
        The Prompt object if found.

    Raises:
        HTTPException: If the prompt is not found, raises a 404 error.
    """
    return get_existing_prompt(prompt_id)


@app.post("/prompts", response_model=Prompt, status_code=201)
def create_prompt(prompt_data: PromptCreate):
    """Create a new prompt with optional association to a collection.

    Args:
        prompt_data: The data required to create a new prompt, including optional collection ID.

    Returns:
        Prompt: The newly created Prompt object.

    Raises:
        HTTPException: If the collection ID is provided but not found.
    """
    # Validate collection exists if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=400, detail="Collection not found")

    prompt = Prompt(**prompt_data.model_dump())
    return storage.create_prompt(prompt)


@app.put("/prompts/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: str, prompt_data: PromptUpdate):
    """Update an existing prompt.

    Args:
        prompt_id: The unique identifier of the prompt to update.
        prompt_data: The new data for the prompt, provided as a PromptUpdate object.

    Returns:
        The updated Prompt object.

    Raises:
        HTTPException: If the prompt or the specified collection is not found.
    """
    existing = get_existing_prompt(prompt_id)

    # Validate collection if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")

    updated_prompt = Prompt(
        id=existing.id,
        title=prompt_data.title or existing.title,
        content=prompt_data.content or existing.content,
        description=prompt_data.description or existing.description,
        collection_id=prompt_data.collection_id or existing.collection_id,
        created_at=existing.created_at,
        updated_at=get_current_time(),
    )

    return storage.update_prompt(prompt_id, updated_prompt)


    # Handle PATCH for partially updating prompts



@app.patch("/prompts/{prompt_id}", response_model=Prompt)
def patch_prompt(prompt_id: str, prompt_data: PromptUpdate):
    """Partially update an existing prompt.

    Args:
        prompt_id: The unique identifier of the prompt to update.
        prompt_data: The data to update in the prompt.

    Returns:
        The updated Prompt object.

    Raises:
        HTTPException: If the prompt is not found.
    """
    existing_prompt = get_existing_prompt(prompt_id)

    # Update only the fields provided in the request
    updated_data = {key: value for key, value in prompt_data.model_dump().items() if value is not None}
    updated_data['updated_at'] = get_current_time()

    updated_prompt = existing_prompt.model_copy(update=updated_data)

    return storage.update_prompt(prompt_id, updated_prompt)



@app.delete("/prompts/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: str):
    """Delete an existing prompt by its unique identifier.

    Args:
        prompt_id: The unique identifier of the prompt to delete.

    Returns:
        None

    Raises:
        HTTPException: If the prompt is not found, raises a 404 error.
    """
    if not storage.delete_prompt(prompt_id):
        raise HTTPException(status_code=404, detail="Prompt not found")
    return None


# ============== Collection Endpoints ==============
@app.get("/collections", response_model=CollectionList)
def list_collections():
    """Retrieve a comprehensive list of all collections with a count.

    Returns:
        CollectionList: A list of all available collections with a total count.
    """
    collections = storage.get_all_collections()
    return CollectionList(collections=collections, total=len(collections))


@app.get("/collections/{collection_id}", response_model=Collection)
def get_collection(collection_id: str):
    """Retrieve a collection by its unique identifier.

    Args:
        collection_id: The unique identifier of the collection to retrieve.

    Returns:
        Collection: The Collection object if found.

    Raises:
        HTTPException: If the collection is not found, raises a 404 error.
    """
    collection = storage.get_collection(collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection


@app.post("/collections", response_model=Collection, status_code=201)
def create_collection(collection_data: CollectionCreate):
    """Create a new collection.

    Args:
        collection_data: The data required to create a new collection.

    Returns:
        Collection: The newly created Collection object.
    """
    collection = Collection(**collection_data.model_dump())
    return storage.create_collection(collection)


@app.delete("/collections/{collection_id}", status_code=204)
def delete_collection(collection_id: str):
    """Delete a collection and disassociate related prompts.

    Args:
        collection_id: The unique identifier of the collection to delete.

    Returns:
        None

    Raises:
        HTTPException: If the collection is not found, raises a 404 error.
    """
    # Proceed to delete the collection as planned
    if not storage.delete_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found")

    # Fetch all prompts with this collection_id
    prompts_to_update = storage.get_prompts_by_collection(collection_id)
    # Update each prompt to disassociate from the collection
    for prompt in prompts_to_update:
        updated_prompt = Prompt(
            id=prompt.id,
            title=prompt.title,
            content=prompt.content,
            description=prompt.description,
            collection_id=None,  # Disassociate the prompt
            created_at=prompt.created_at,
            updated_at=get_current_time(),
        )
        storage.update_prompt(prompt.id, updated_prompt)

    return None


@app.post("/prompts/{prompt_id}/tags", response_model=Prompt)
def add_tag_to_prompt(prompt_id: str, tag_data: Tag):
    """Add a new tag to a prompt.

    Args:
        prompt_id: The unique identifier of the prompt.
        tag_data: The tag data to add.

    Returns:
        The updated Prompt with new tag.

    Raises:
        HTTPException: If the prompt is not found or tag already exists.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not available")

    # Check for duplicate tag
    if any(tag.name.lower() == tag_data.name.lower() for tag in prompt.tags):
        raise HTTPException(
            status_code=400, detail="Tag already exists for this prompt."
        )

    # Add tag to prompt
    prompt.tags.append(tag_data)
    storage.update_prompt(prompt_id, prompt)

    return prompt


@app.delete("/prompts/{prompt_id}/tags/{tag_id}", response_model=Prompt)
def remove_tag_from_prompt(prompt_id: str, tag_id: str):
    """Remove a tag from a prompt.

    Args:
        prompt_id: The unique identifier of the prompt.
        tag_id: The unique identifier of the tag to remove.

    Returns:
        The updated Prompt without the tag.

    Raises:
        HTTPException: If the prompt or tag is not found.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not available")

    # Remove tag by tag_id
    updated_tags = [tag for tag in prompt.tags if tag.tag_id != tag_id]

    if len(updated_tags) == len(prompt.tags):
        raise HTTPException(status_code=404, detail="Tag not found.")

    prompt.tags = updated_tags
    storage.update_prompt(prompt_id, prompt)

    return prompt

