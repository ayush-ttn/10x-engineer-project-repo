# API Reference Documentation

## Table of Contents

1. [Health Check](#health-check)
2. [Prompt Endpoints](#prompt-endpoints)
   - [GET /prompts](#get-prompts)
   - [GET /prompts/{prompt_id}](#get-prompt-id)
   - [POST /prompts](#post-prompts)
   - [PUT /prompts/{prompt_id}](#put-prompts-id)
   - [PATCH /prompts/{prompt_id}](#patch-prompts-id)
   - [DELETE /prompts/{prompt_id}](#delete-prompts-id)
3. [Collection Endpoints](#collection-endpoints)
   - [GET /collections](#get-collections)
   - [GET /collections/{collection_id}](#get-collections-id)
   - [POST /collections](#post-collections)
   - [DELETE /collections/{collection_id}](#delete-collections-id)

---

## Health Check

### GET /health

- **Description:** Checks the health status of the API.
- **Request:** None

```json
GET /health
```

- **Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

- **Error Responses:** None

- **Authentication:** None

---

## Prompt Endpoints

### GET /prompts

- **Description:** Retrieves a list of prompts with optional filtering.
- **Request:**

```json
GET /prompts?collection_id={optional}&search={optional}
```

- **Response:**

```json
{
  "prompts": [
    {
      "id": "123",
      "title": "Prompt Title",
      "content": "Prompt content...",
      "description": "Detailed prompt description",
      "collection_id": "1",
      "created_at": "2021-01-01T10:00:00Z",
      "updated_at": "2021-01-01T10:00:00Z"
    }
  ],
  "total": 2
}
```

- **Error Responses:**
  - 422 Unprocessable Entity

- **Authentication:** None

### GET /prompts/{prompt_id}

- **Description:** Retrieves a prompt by its unique identifier.
- **Request:**

```json
GET /prompts/{prompt_id}
```

- **Response:**

```json
{
  "id": "123",
  "title": "Prompt Title",
  "content": "Prompt content...",
  "description": "Detailed prompt description",
  "collection_id": "1",
  "created_at": "2021-01-01T10:00:00Z",
  "updated_at": "2021-01-01T10:00:00Z"
}
```

- **Error Responses:**
  - 404 Not Found: {"error": "Prompt not available"}

- **Authentication:** None

### POST /prompts

- **Description:** Creates a new prompt.
- **Request:**

```json
POST /prompts
{
  "title": "New Prompt",
  "content": "Prompt content...",
  "description": "Description here",
  "collection_id": "1"  // Optional
}
```

- **Response:**

```json
{
  "id": "124",
  "title": "New Prompt",
  "content": "Prompt content...",
  "description": "Description here",
  "collection_id": "1",
  "created_at": "2021-02-01T10:00:00Z",
  "updated_at": "2021-02-01T10:00:00Z"
}
```

- **Error Responses:**
  - 400 Bad Request: {"error": "Collection not found"}
  - 422 Unprocessable Entity

- **Authentication:** None

### PUT /prompts/{prompt_id}

- **Description:** Updates an existing prompt.
- **Request:**

```json
PUT /prompts/{prompt_id}
{
  "title": "Updated Prompt Title",
  "content": "Updated content...",
  "description": "Updated description",
  "collection_id": "2"
}
```

- **Response:**

```json
{
  "id": "123",
  "title": "Updated Prompt Title",
  "content": "Updated content...",
  "description": "Updated description",
  "collection_id": "2",
  "created_at": "2021-01-01T10:00:00Z",
  "updated_at": "2021-03-01T10:00:00Z"
}
```

- **Error Responses:**
  - 404 Not Found: {"error": "Prompt not available"}
  - 404 Not Found: {"error": "Collection not found"}
  - 422 Unprocessable Entity

- **Authentication:** None

### PATCH /prompts/{prompt_id}

- **Description:** Partially updates a prompt.
- **Request:**

```json
PATCH /prompts/{prompt_id}
{
  "title": "Partially Updated Title"  // Optional fields
}
```

- **Response:**

```json
{
  "id": "123",
  "title": "Partially Updated Title",
  "content": "Prompt content...",
  "description": "Description here",
  "collection_id": "1",
  "created_at": "2021-01-01T10:00:00Z",
  "updated_at": "2021-03-01T10:10:00Z"
}
```

- **Error Responses:**
  - 404 Not Found: {"error": "Prompt not available"}
  - 422 Unprocessable Entity

- **Authentication:** None

### DELETE /prompts/{prompt_id}

- **Description:** Deletes an existing prompt.
- **Request:**

```json
DELETE /prompts/{prompt_id}
```

- **Response:** None (204 No Content)

- **Error Responses:**
  - 404 Not Found: {"error": "Prompt not found"}

- **Authentication:** None

---

## Collection Endpoints

### GET /collections

- **Description:** Retrieves a complete list of all collections.
- **Request:**

```json
GET /collections
```

- **Response:**

```json
{
  "collections": [
    {
      "id": "1",
      "name": "First Collection",
      "created_at": "2021-01-01T12:00:00Z"
    }
  ],
  "total": 1
}
```

- **Error Responses:**
  - 422 Unprocessable Entity

- **Authentication:** None

### GET /collections/{collection_id}

- **Description:** Retrieves a specific collection.
- **Request:**

```json
GET /collections/{collection_id}
```

- **Response:**

```json
{
  "id": "1",
  "name": "First Collection",
  "created_at": "2021-01-01T12:00:00Z"
}
```

- **Error Responses:**
  - 404 Not Found: {"error": "Collection not found"}

- **Authentication:** None

### POST /collections

- **Description:** Creates a new collection.
- **Request:**

```json
POST /collections
{
  "name": "New Collection"
}
```

- **Response:**

```json
{
  "id": "2",
  "name": "New Collection",
  "created_at": "2021-02-01T12:00:00Z"
}
```

- **Error Responses:**
  - 422 Unprocessable Entity

- **Authentication:** None

### DELETE /collections/{collection_id}

- **Description:** Deletes a collection and disassociates related prompts.
- **Request:**

```json
DELETE /collections/{collection_id}
```

- **Response:** None (204 No Content)

- **Error Responses:**
  - 404 Not Found: {"error": "Collection not found"}

- **Authentication:** None
