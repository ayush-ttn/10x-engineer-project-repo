---
name: FastAPI File and Directory Naming Conventions
description: Strict guidelines for creating and naming files, directories, and modules
---

## General Python File Naming
* Always use strict `snake_case.py` for all Python scripts.
* **Never** use `camelCase`, `PascalCase`, or `kebab-case` for file names (e.g., use `user_profile.py`, absolutely not `UserProfile.py` or `user-profile.py`).
* Keep filenames concise, descriptive, and entirely lowercase.

## FastAPI Component Naming
Depending on the project's layout (either domain-driven or layer-driven), use the following patterns when generating new files:
* **Routers/Endpoints:** Use the plural form of the resource (e.g., `users.py`, `orders.py`). If inside a domain-specific folder, name it `router.py`.
* **Database Models (SQLAlchemy/SQLModel):** Name the file `models.py` if inside a domain folder, or `[entity]_model.py` (e.g., `user_model.py`) if in a centralized directory.
* **Pydantic Schemas:** Name the file `schemas.py` if inside a domain folder, or `[entity]_schema.py` (e.g., `user_schema.py`) if centralized.
* **Business Logic / CRUD:** Name files `service.py` or `crud.py` (or `[entity]_service.py` / `[entity]_crud.py`) for logic decoupled from the router.
* **Dependencies:** Place reusable FastAPI `Depends` functions in a `dependencies.py` or `deps.py` file.

## Test Naming (Pytest)
* **Crucial:** All test files MUST begin with the `test_` prefix so `pytest` can automatically discover them (e.g., `test_users.py`, `test_auth_service.py`).
* Test files should reside in a root `tests/` directory and structurally mirror the `src/` or `app/` directory (e.g., `tests/routers/test_users.py`).

## Configuration and Standard Files
* Ecosystem and configuration files should use their standard conventional naming and casing (e.g., `Dockerfile`, `README.md`, `.env`, `.gitignore`, `alembic.ini`).
* Store environment and configuration loaders in a `core/` or `config/` directory (e.g., `core/config.py`).