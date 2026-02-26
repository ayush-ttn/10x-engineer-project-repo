"""API tests for PromptLab

These tests verify the API endpoints work correctly.
Students should expand these tests significantly in Week 3.
"""

from fastapi.testclient import TestClient


class TestHealth:
    """Tests for health endpoint."""

    def test_health_check(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestPrompts:
    """Tests for prompt endpoints."""

    def test_create_prompt(self, client: TestClient, sample_prompt_data):
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == sample_prompt_data["title"]
        assert data["content"] == sample_prompt_data["content"]
        assert "id" in data
        assert "created_at" in data

    def test_list_prompts_empty(self, client: TestClient):
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert data["prompts"] == []
        assert data["total"] == 0

    def test_list_prompts_with_data(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        client.post("/prompts", json=sample_prompt_data)

        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 1
        assert data["total"] == 1

    def test_get_prompt_success(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        response = client.get(f"/prompts/{prompt_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == prompt_id

    def test_get_prompt_not_found(self, client: TestClient):
        """Test that getting a non-existent prompt returns 404.

        NOTE: This test currently FAILS due to Bug #1!
        The API returns 500 instead of 404.
        """
        response = client.get("/prompts/nonexistent-id")
        # This should be 404, but there's a bug...
        assert response.status_code == 404  # Will fail until bug is fixed

    def test_delete_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        # Delete it
        response = client.delete(f"/prompts/{prompt_id}")
        assert response.status_code == 204

        # Verify it's gone
        get_response = client.get(f"/prompts/{prompt_id}")
        # Note: This might fail due to Bug #1
        assert get_response.status_code in [404, 500]  # 404 after fix

    def test_update_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        # Update it
        updated_data = {
            "title": "Updated Title",
            "content": "Updated content for the prompt",
            "description": "Updated description",
        }

        import time

        time.sleep(0.1)  # Small delay to ensure timestamp would change

        response = client.put(f"/prompts/{prompt_id}", json=updated_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

        # NOTE: This assertion will fail due to Bug #2!
        # The updated_at should be different from original
        # assert data["updated_at"] != original_updated_at  # Uncomment after fix

    def test_sorting_order(self, client: TestClient):
        """Test that prompts are sorted newest first.

        NOTE: This test might fail due to Bug #3!
        """
        import time

        # Create prompts with delay
        prompt1 = {"title": "First", "content": "First prompt content"}
        prompt2 = {"title": "Second", "content": "Second prompt content"}

        client.post("/prompts", json=prompt1)
        time.sleep(0.1)
        client.post("/prompts", json=prompt2)

        response = client.get("/prompts")
        prompts = response.json()["prompts"]

        # Newest (Second) should be first
        assert prompts[0]["title"] == "Second"  # Will fail until Bug #3 fixed

    def test_patch_prompt_partial_update(self, client: TestClient, sample_prompt_data):
        """Test partially updating a prompt with PATCH request.

        PATCH should only update provided fields and preserve others.
        """
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_content = create_response.json()["content"]
        original_description = create_response.json()["description"]

        # Patch only the title
        patch_data = {"title": "New Title Only"}
        response = client.patch(f"/prompts/{prompt_id}", json=patch_data)
        assert response.status_code == 200
        data = response.json()

        # Title should be updated
        assert data["title"] == "New Title Only"
        # Content and description should remain unchanged
        assert data["content"] == original_content
        assert data["description"] == original_description
        # Timestamp should be updated
        assert data["updated_at"] != create_response.json()["updated_at"]

    def test_patch_prompt_update_multiple_fields(
        self, client: TestClient, sample_prompt_data
    ):
        """Test updating multiple fields with PATCH."""
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        # Patch multiple fields
        patch_data = {"title": "Updated Title", "content": "Updated content here"}
        response = client.patch(f"/prompts/{prompt_id}", json=patch_data)
        assert response.status_code == 200
        data = response.json()

        assert data["title"] == "Updated Title"
        assert data["content"] == "Updated content here"

    def test_patch_prompt_not_found(self, client: TestClient):
        """Test PATCH request on non-existent prompt returns 404."""
        patch_data = {"title": "New Title"}
        response = client.patch("/prompts/nonexistent-id", json=patch_data)
        assert response.status_code == 404
        assert response.json()["detail"] == "Prompt not available"

    def test_patch_prompt_empty_update(self, client: TestClient, sample_prompt_data):
        """Test PATCH with no fields provided preserves all data."""
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_data = create_response.json()

        # Patch with empty/None fields
        patch_data = {"title": None, "content": None, "description": None}
        response = client.patch(f"/prompts/{prompt_id}", json=patch_data)
        assert response.status_code == 200
        data = response.json()

        # All fields should remain unchanged
        assert data["title"] == original_data["title"]
        assert data["content"] == original_data["content"]
        assert data["description"] == original_data["description"]


class TestCollections:
    """Tests for collection endpoints."""

    def test_create_collection(self, client: TestClient, sample_collection_data):
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_collection_data["name"]
        assert "id" in data

    def test_list_collections(self, client: TestClient, sample_collection_data):
        client.post("/collections", json=sample_collection_data)

        response = client.get("/collections")
        assert response.status_code == 200
        data = response.json()
        assert len(data["collections"]) == 1

    def test_get_collection_not_found(self, client: TestClient):
        response = client.get("/collections/nonexistent-id")
        assert response.status_code == 404

    def test_delete_collection_with_prompts(
        self, client: TestClient, sample_collection_data, sample_prompt_data
    ):
        """Test deleting a collection that has prompts.

        NOTE: Bug #4 - prompts become orphaned after collection deletion.
        This test documents the current (buggy) behavior.
        After fixing, update the test to verify correct behavior.
        """
        # Create collection
        col_response = client.post("/collections", json=sample_collection_data)
        collection_id = col_response.json()["id"]

        # Delete collection
        client.delete(f"/collections/{collection_id}")

        # The prompt still exists but has invalid collection_id
        # This is Bug #4 - should be handled properly
        prompts = client.get("/prompts").json()["prompts"]
        if prompts:
            # Prompt exists with orphaned collection_id
            assert prompts[0]["collection_id"] is None


class TestTags:
    """Tests for tagging system endpoints."""

    def test_add_tag_to_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        tag_json = {"name": "important"}

        # Add tag to the prompt
        response = client.post(f"/prompts/{prompt_id}/tags", json=tag_json)
        assert response.status_code == 200
        data = response.json()
        assert "tags" in data
        assert "important" in [tag["name"] for tag in data["tags"]]

    def test_remove_tag_from_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        tag_json = {"name": "important"}

        # Add and then remove the tag
        prompt_response = client.post(f"/prompts/{prompt_id}/tags", json=tag_json)
        tag_id = prompt_response.json()["tags"][0]["tag_id"]

        response = client.delete(f"/prompts/{prompt_id}/tags/{tag_id}")
        assert response.status_code == 200

        # Verify tag removal
        get_response = client.get(f"/prompts/{prompt_id}")
        data = get_response.json()
        assert all(tag["tag_id"] != 1 for tag in data.get("tags"))

    def test_filter_prompts_by_tags(self, client: TestClient, sample_prompt_data):
        # Create a prompt first and tag it
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        tag_json = {"name": "urgent"}
        client.post(f"/prompts/{prompt_id}/tags", json=tag_json)

        # Filter prompts based on the tag
        response = client.get("/prompts?tags=urgent")
        assert response.status_code == 200

        for prompt in response.json()["prompts"]:
            assert any(tag["name"] == "urgent" for tag in prompt.get("tags"))


class TestTagEdgeCases:
    """Edge case tests for the tagging system."""

    def test_add_duplicate_tag_to_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        tag_json = {"name": "duplicate-tag"}

        # Add the same tag twice
        client.post(f"/prompts/{prompt_id}/tags", json=tag_json)
        response = client.post(f"/prompts/{prompt_id}/tags", json=tag_json)
        assert response.status_code == 400
        assert response.json()["detail"] == "Tag already exists for this prompt."

    def test_add_tag_exceeding_length(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        long_tag_json = {"name": "x" * 256}  # Assuming 100 is max length

        response = client.post(f"/prompts/{prompt_id}/tags", json=long_tag_json)
        assert response.status_code == 422  # Ensure we expect the 422 response

    def test_remove_tag_in_use(self, client: TestClient, sample_prompt_data):
        # Create two prompts and a shared tag
        response1 = client.post("/prompts", json=sample_prompt_data)
        prompt_id1 = response1.json()["id"]

        sample_prompt_data2 = sample_prompt_data.copy()
        sample_prompt_data2["title"] = "Another Prompt"
        response2 = client.post("/prompts", json=sample_prompt_data2)
        prompt_id2 = response2.json()["id"]

        tag_json = {"name": "shared-tag"}
        prompt_response1 = client.post(f"/prompts/{prompt_id1}/tags", json=tag_json)
        tag_id1 = prompt_response1.json()["tags"][0]["tag_id"]

        # Remove from one prompt
        response = client.delete(f"/prompts/{prompt_id1}/tags/{tag_id1}")
        assert response.status_code == 200

        # Make sure the tag still exists for the second prompt
        get_response = client.get(f"/prompts/{prompt_id2}")
        assert any(
            tag["name"] == "shared-tag" for tag in get_response.json().get("tags")
        )

    def test_case_sensitivity_in_tags(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        tag_json_lower = {"name": "case-sensitive"}
        tag_json_upper = {"name": "CASE-SENSITIVE"}

        # Add tags with different cases
        client.post(f"/prompts/{prompt_id}/tags", json=tag_json_lower)
        response = client.post(f"/prompts/{prompt_id}/tags", json=tag_json_upper)

        # Verify case sensitivity based on system design
        # Assuming tags should be case-insensitive and considered duplicates
        assert response.status_code == 400
        assert response.json()["detail"] == "Tag already exists for this prompt."
