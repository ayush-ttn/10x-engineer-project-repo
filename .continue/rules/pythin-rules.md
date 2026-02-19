---
name: FastAPI and Python Best Practices
description: Core architectural and coding guidelines for the FastAPI project
---

## General Python Guidelines
* Write PEP-8 compliant code and use `snake_case` for variables/functions and `PascalCase` for classes.
* Use strict type hints for all function arguments and return types.
* Write concise, Google-style docstrings for all classes and complex functions.
* Prefer list comprehensions over `map()` and `filter()` for readability.

## Modularity & Anti-Clutter Rules
* **Single Responsibility:** Each module (file) should do one thing. If a router file exceeds 200 lines, split it into smaller sub-routers.
* **Separation of Concerns:** Keep business logic (services/CRUD) strictly separated from API transport logic (routers). Routers should only handle request parsing and response calling.
* **No "Utils" Dumping Ground:** Avoid creating a generic `utils.py`. Instead, create specific modules like `security.py`, `date_helpers.py`, or `string_formatters.py`.
* **DRY (Don't Repeat Yourself):** If logic is used in more than two places, move it to a shared dependency or a service layer.
* **Explicit Imports:** Always use absolute imports (e.g., `from app.core.config import settings`) rather than relative imports to maintain clarity as the project grows.

## FastAPI Best Practices
* Use Pydantic v2 models for all request and response payload validations.
* Leverage FastAPI's Dependency Injection (`Depends`) for shared logic, database sessions, and authentication.
* Avoid hardcoding configuration variables; rely on `pydantic-settings` to manage environment variables.
* Raise `fastapi.HTTPException` for expected errors with clear detail messages and proper HTTP status codes.

## Async vs. Sync Rules
* Define endpoints with `async def` only when performing asynchronous I/O operations (like async database queries or HTTP requests).
* Define endpoints with a standard `def` if the function contains synchronous blocking code or heavy CPU-bound computations.
* Always prioritize asynchronous client libraries (such as `httpx` over `requests`) to prevent blocking the event loop.

## Routing and Structure
* Use standard RESTful conventions for route names (e.g., use plural nouns like `/users/{user_id}` instead of `/get_user`).
* Modularize the application using `APIRouter` across different files instead of dumping all routes into `main.py`.

## Test-Driven Development (TDD) Workflow
* **Test-First Generation:** Always provide a `pytest` test case *before* or *alongside* any new feature implementation. 
* **Red-Green-Refactor:** 1. Write a failing test that defines the expected behavior and API contract.
    2. Write the minimum amount of code (FastAPI endpoint/service) to make the test pass.
    3. Refactor for performance and readability while ensuring tests remain green.
* **FastAPI TestClient:** Use `fastapi.testclient.TestClient` (or `httpx.AsyncClient` for async endpoints) to verify status codes and JSON response bodies.
* **Mocking Dependencies:** Use `pytest-mock` or FastAPI's `app.dependency_overrides` to mock database sessions or external API calls during testing.
* **Coverage Requirement:** Ensure every new endpoint has at least one "Happy Path" test (200 OK) and one "Edge Case" test (e.g., 404 Not Found or 422 Validation Error).