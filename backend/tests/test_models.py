import pytest
from pydantic import ValidationError
from app.models import PromptCreate, Prompt, CollectionCreate, Collection, Tag
from app.models import generate_id, get_current_time


class TestModels:
    """Tests for Pydantic models in PromptLab"""

    def test_prompt_creation_success(self):
        """Test successful creation of a Prompt from PromptCreate."""
        data = {
            "title": "Valid Title",
            "content": "Valid content",
            "description": "A valid description",
        }

        prompt = PromptCreate(**data)
        prompt_full = Prompt(
            **prompt.dict(),
            id=generate_id(),
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )

        assert prompt_full.title == data["title"]
        assert prompt_full.content == data["content"]
        assert prompt_full.description == data["description"]
        assert prompt_full.id is not None
        assert prompt_full.created_at is not None

    def test_prompt_create_validation_failure(self):
        """Ensure ValidationError when creating Prompt with invalid data."""
        data = {
            "title": "",  # Title is too short
            "content": "",
        }

        with pytest.raises(ValidationError):
            PromptCreate(**data)

    def test_collection_creation_success(self):
        """Test successful creation of a Collection from CollectionCreate."""
        data = {"name": "Collection name", "description": "A detailed description"}

        collection = CollectionCreate(**data)
        collection_full = Collection(
            **collection.dict(), id=generate_id(), created_at=get_current_time()
        )

        assert collection_full.name == data["name"]
        assert collection_full.description == data["description"]
        assert collection_full.id is not None

    def test_collection_create_validation_failure(self):
        """Ensure ValidationError when creating Collection with invalid data."""
        data = {
            "name": "",  # Name is too short
        }

        with pytest.raises(ValidationError):
            CollectionCreate(**data)

    def test_create_tag(self):
        """Test creating a single tag."""
        tag = Tag(tag_id=generate_id(), name="test-tag")
        assert tag.name == "test-tag"

    def test_add_tag_to_prompt(self):
        """Test associating tags with a prompt."""

        prompt = Prompt(
            id=generate_id(),
            title="Test Prompt",
            content="test",
            description="",
            created_at=get_current_time(),
            updated_at=get_current_time(),
            tags=[],
        )

        # Associate tag with prompt
        tag = Tag(tag_id=generate_id(), name="important")
        prompt.tags.append(tag)
        assert len(prompt.tags) == 1
        assert prompt.tags[0].name == "important"

        another_tag = Tag(tag_id=generate_id(), name="urgent")
        prompt.tags.append(another_tag)
        assert len(prompt.tags) == 2
        assert prompt.tags[1].name == "urgent"
