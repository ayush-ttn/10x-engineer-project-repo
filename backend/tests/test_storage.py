from app.storage import Storage
from app.models import Prompt, Collection, generate_id, get_current_time


class TestStorage:
    """Tests for in-memory Storage class"""

    def setup_method(self):
        """Initialize storage for tests"""
        self.storage = Storage()

    def test_store_and_retrieve_prompt(self):
        """Test storing and retrieving a prompt"""
        prompt = Prompt(
            id=generate_id(),
            title="Test Title",
            content="Test Content",
            description="Test Description",
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )

        self.storage.create_prompt(prompt)
        retrieved = self.storage.get_prompt(prompt.id)

        assert retrieved is not None
        assert retrieved.title == "Test Title"

    def test_update_prompt(self):
        """Test updating a stored prompt"""
        prompt = Prompt(
            id=generate_id(),
            title="Title Before",
            content="Content Before",
            description="Description Before",
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )

        self.storage.create_prompt(prompt)
        prompt.title = "Title After"
        self.storage.update_prompt(prompt.id, prompt)

        updated = self.storage.get_prompt(prompt.id)
        assert updated.title == "Title After"

    def test_delete_prompt(self):
        """Test deleting a stored prompt"""
        prompt = Prompt(
            id=generate_id(),
            title="ToDelete",
            content="Content",
            description="Description",
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )

        self.storage.create_prompt(prompt)
        self.storage.delete_prompt(prompt.id)

        assert self.storage.get_prompt(prompt.id) is None

    def test_store_and_retrieve_collection(self):
        """Test storing and retrieving a collection"""
        collection = Collection(
            id=generate_id(),
            name="Test Collection",
            description="Test Description",
            created_at=get_current_time(),
        )

        self.storage.create_collection(collection)
        retrieved = self.storage.get_collection(collection.id)

        assert retrieved is not None
        assert retrieved.name == "Test Collection"

    def test_delete_collection(self):
        """Test deleting a stored collection"""
        collection = Collection(
            id=generate_id(),
            name="ToDelete",
            description="Description",
            created_at=get_current_time(),
        )

        self.storage.create_collection(collection)
        self.storage.delete_collection(collection.id)

        assert self.storage.get_collection(collection.id) is None
