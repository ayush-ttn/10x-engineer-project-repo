---
name: Google Python Docstring Standard
description: Enforces the Google-style documentation format for all Python modules, classes, and functions.
invokable: true
---
Add the doc string to the selected code or file follow these rules cloesly while adding the documentation:

## General Docstring Rules
* Use triple double quotes `"""Docstring here."""`.
* For single-line docstrings, keep the quotes on the same line.
* For multi-line docstrings, put the summary on the first line, followed by a blank line, and then the detailed description.
* Maintain the indentation of the code so that the documentation does not break it.

## Function and Method Structure
All non-trivial functions (especially FastAPI endpoints and CRUD logic) must include these sections in order:

1.  **Args:** List each parameter by name, followed by a colon and a space. Describe its role. (Type hints are already in the signature, but can be clarified here if complex).
2.  **Returns:** Describe the return value and its type.
3.  **Raises:** List all exceptions that are intentionally raised by the function (e.g., `fastapi.HTTPException`).
4.  **Yields:** Use this instead of "Returns" for generator functions (like database session dependencies).

## Example Template
Follow this exact structure for all new code:

def create_user(db: Session, user: UserCreate) -> User:
    """
    Creates a new user record in the database.

    This function hashes the password before persistence and checks for 
    existing email constraints.

    Args:
        db: The SQLAlchemy database session dependency.
        user: The Pydantic schema containing user registration data.

    Returns:
        User: The newly created SQLAlchemy user model instance.

    Raises:
        HTTPException: 400 error if the email is already registered.
    """
    ...