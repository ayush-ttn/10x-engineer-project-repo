from app.utils import sort_prompts_by_date
from app.models import Prompt, get_current_time
import time


class TestUtils:
    """Tests for utility functions"""

    def test_sort_prompts_by_date(self):
        """Ensure prompts are sorted by the `updated_at` timestamp"""
        prompt1 = Prompt(
            id="1",
            title="First",
            content="Content 1",
            description="Desc 1",
            collection_id=None,
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )
        time.sleep(0.1)  # Ensure a difference in time
        prompt2 = Prompt(
            id="2",
            title="Second",
            content="Content 2",
            description="Desc 2",
            collection_id=None,
            created_at=get_current_time(),
            updated_at=get_current_time(),
        )

        sorted_prompts = sort_prompts_by_date([prompt1, prompt2], descending=True)

        assert sorted_prompts[0].id == "2"
        assert sorted_prompts[1].id == "1"

    def test_sort_prompts_empty_list(self):
        """Test sorting on an empty list returns an empty list"""
        sorted_prompts = sort_prompts_by_date([], descending=True)
        assert sorted_prompts == []
