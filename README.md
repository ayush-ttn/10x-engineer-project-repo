
# PromptLab: An AI-driven Incident Management API

**Effortless Incident Management, Reinvented with AI**

---

## Project Overview
PromptLab is a backend service designed for managing prompts and their collections. It provides APIs to efficiently create, organize, and handle prompts and collections, ensuring an efficient workflow and ease of management. The current focus is on setting the foundation for a full-stack application that can scale as the needs of prompt management grow.

### Key Features
- 📋 RESTful API supporting prompt and collection creation, updates, retrieval, and deletion.
- 🛠 Highly modular architecture using FastAPI and Pydantic.
- ⚡ In-memory data persistence mimicking database interactions with scope for future extensions.


---

## Setup Instructions

### Prerequisites

- Python 3.10+
- FastAPI
- Git for version control

### Installation

To set up the backend locally:

**Option 1: Virtual environment (recommended on macOS/Linux)**

On macOS with Homebrew Python (or when you see "externally-managed-environment"), use a venv:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Leave the venv activated whenever you work on the backend. To deactivate later: `deactivate`.

**Option 2: System Python (if allowed)**

```bash
cd backend
pip install -r requirements.txt
python main.py
```

This will start the FastAPI server at: [http://localhost:8000](http://localhost:8000)

### Testing

Run unit tests to ensure everything is working smoothly:

```bash
$ cd backend
$ pytest tests/ -v
```

---

## Full-Stack Application (Frontend + Backend)

The React frontend (Week 4) connects to the backend API. To run and verify the complete application:

**Terminal 1 — Backend:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Verify:

- [ ] Prompts display in a list/grid
- [ ] Can create a new prompt (modal or form)
- [ ] Can edit an existing prompt
- [ ] Can delete a prompt (with confirmation)
- [ ] Collections list and create/delete work
- [ ] Search and filter by collection work
- [ ] Loading states, error messages, and empty states appear as expected
- [ ] Layout is responsive (try a narrow viewport)

**Frontend tests:**

```bash
cd frontend
npm run test:run
npm run build
```

CI (`.github/workflows/ci.yml`) runs both backend tests and frontend tests + build on push and pull requests.

---

## API Endpoints Reference

### Overview
Utilize the following RESTful endpoints to interact with the PromptLab API. Full documentation is available via automatically generated API docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Endpoints Listing

- **GET** `/health`: Check API service health status.
- **GET** `/prompts`: Retrieve all prompts in the system.
- **POST** `/prompts`: Create a new prompt entry.
- **GET** `/prompts/{id}`: Retrieve a prompt by ID.
- **PUT** `/prompts/{id}`: Update an existing prompt by ID.
- **PATCH** `/prompts/{id}`: Partial update to an existing prompt based on provided fields.
- **DELETE** `/prompts/{id}`: Remove a prompt by its ID.
- **GET** `/collections`: List all collections.
- **POST** `/collections`: Create a new collection.
- **GET** `/collections/{id}`: Obtain details of a specific collection by ID.
- **DELETE** `/collections/{id}`: Delete a specified collection and manage prompt orphaning.

---

## Data Models

### Prompt Model
```python
from pydantic import BaseModel, Field
from typing import Optional
import datetime

class Prompt(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime]
    collection_id: Optional[str]
```

### Collection Model
```python
class Collection(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime.datetime
```

These models dictate the structure and validation of data transacted within this API.

---

## Usage Examples

### Create a Prompt
Use the API to store a new prompt:
```bash
curl -X POST "http://localhost:8000/prompts" -H "accept: application/json" -H "Content-Type: application/json" -d '{"title": "Server Down", "content": "Investigate server outage", "collection_id": "network-issues"}'
```

### Retrieve All Prompts
Fetch a list of all prompts:
```bash
curl -X GET "http://localhost:8000/prompts" -H "accept: application/json"
```

### Update an Existing Prompt
```bash
curl -X PUT "http://localhost:8000/prompts/{id}" -H "accept: application/json" -H "Content-Type: application/json" -d '{"title": "Updated Title", "content": "New Content"}'
```

---

## Docker Setup

If you prefer running the application in a Docker container, follow these steps:

### Build the Docker Image

Make sure you are inside the `promptlab` root directory and run:

```bash
# Build the Docker image
docker build -t promptlab-api ./backend
```

### Run the Docker Container

Once the image is built, start a container using:

```bash
# Run the Docker container
docker run -p 8000:8000 promptlab-api
```

This will start the FastAPI server inside a Docker container, accessible at: [http://localhost:8000](http://localhost:8000)

### Docker Notes
- The Dockerfile uses the Python 3.10-slim image, which is lightweight and efficient.
- The application is set to run using `uvicorn` on port 8000 by default.
- Ensure Docker is installed and running on your system before executing these commands.

---

## Tech Stack
- **Backend Framework**: FastAPI
- **Data Models**: Pydantic
- **Test Framework**: Pytest
- **Version Control**: Git

---

## Need Assistance?

If you have any questions or need some help:
- Dive into the FastAPI [documentation](https://fastapi.tiangolo.com/)
- Reach out via the project forums
- Engage with the AI tools integrated within this project for smooth navigation and issues resolving.

---

Good luck, and enjoy the development journey in PromptLab! 🚀
