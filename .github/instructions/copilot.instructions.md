---
description: Use these instructions when making any changes to the current project
---
# FastAPI Project Rules & Standards

You are a senior Python developer. Follow these rules strictly for all code generation, refactoring, and documentation tasks.

## 1. Python & FastAPI Best Practices
- **Framework:** FastAPI with Python 3.10+ and Pydantic v2.
- **Async Usage:** Use `async def` only for I/O bound tasks (DB, API calls). Use standard `def` for CPU-bound logic to avoid event loop blocking.
- **Dependencies:** Use FastAPI `Depends()` for database sessions, authentication, and shared logic.
- **Error Handling:** Always raise `fastapi.HTTPException` with appropriate status codes (400, 401, 404, 500) and clear detail messages.
- **Client Libraries:** Use `httpx` for asynchronous HTTP requests; avoid the synchronous `requests` library.

## 2. File Naming & Project Structure
- **Casing:** Use strict `snake_case.py` for all files and directories. Never use `kebab-case` or `PascalCase`.
- **Modularity:** - Keep files under 200 lines. Split large routers into sub-routers using `APIRouter`.
    - Separate concerns: `routers/` for API logic, `schemas/` for Pydantic models, `services/` or `crud/` for business logic.
    - No "utils.py" dumping grounds. Use specific names (e.g., `security_utils.py`).
- **Imports:** Use absolute imports (e.g., `from app.core.config import settings`).

## 3. Test-Driven Development (TDD)
- **Workflow:** You must follow the **Red-Green-Refactor** cycle.
- **Requirement:** Generate a `pytest` test case *before* or *simultaneously* with any implementation.
- **Test Structure:** Place tests in a root `tests/` directory mirroring the `app/` structure. Files must start with `test_`.
- **Tools:** Use `fastapi.testclient.TestClient` and `pytest-mock` for dependency injection overrides.

## 4. Documentation Standards (Google Style)
- **Format:** Use Google-style docstrings for all functions, classes, and modules.
- **Structure:** Include `Args:`, `Returns:`, and `Raises:` sections.
- **API Reference:** All public endpoints must be documented in `docs/API_REFERENCE.md` with:
    - HTTP Method and Path.
    - Pydantic request/response examples.
    - Error response formats.

## 5. Workflow Constraints
- **Approval First:** Propose a plan and analyze the task before editing code. DO NOT modify files until the user explicitly approves the plan.
- **Rubric Compliance:** Always cross-reference `GRADING_RUBRIC.md` and `PROJECT_BRIEF.md` before finalizing code to ensure maximum points.
- **Progress Tracking:** Update or reference `progress.md` to maintain the session state.