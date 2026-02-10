# Project Progress

## Introduction
This document tracks the progress of the PromptLab project tasks week by week. It captures completed tasks, issues encountered, and key decisions made. Use it for reference in future work or to provide context in new project interactions.

## Week 1: Backend Foundation

### Completed Tasks

#### Task 1.1: Understand the Codebase
- Successfully evaluated the architecture, main models, storage layer, and API endpoints.
- Key Points:
  - **API Layer**: Utilizes FastAPI for routing and handling HTTP requests.
  - **Data Models**: `Prompt` and `Collection` with Pydantic for validation.
  - **Storage**: In-memory storage to mimic database operations.

#### Task 1.2: Fix Bug #1 - GET /prompts/{id} Returns 500
- Fixed issue where a nonexistent prompt caused a 500 error.
- Implemented a 404 error response with a JSON format: `{"error": "Prompt not available"}`.
- Documented the changes with appropriate function docstrings.
- Made sure that the relevant test is available and is passed (manually done by developer, do not run the commands automatically) without changing anything in the test case.

#### Task 1.3: Fix Bug #2 - PUT Doesn't Update Timestamp
- Updated the `update_prompt` function to correctly set the `updated_at` field to the current time.
- Replaced JSONResponse with HTTPException in both `get_prompt` and `update_prompt` for consistent error handling.
- Retained comprehensive docstrings for improved maintainability.
- Verified that existing tests cover this functionality and passed successfully without modification.

#### Task 1.4: Fix Bug #3 - Sorting is Backwards
- Corrected the sorting logic in the `sort_prompts_by_date` function to utilize the `descending` parameter correctly.
- Updated the corresponding endpoint to ensure prompts are returned in descending order, with the newest first.
- Verified the resolution by running the specific sorting test, which passed successfully.

### Context for Next Steps
With the sorting logic corrected, the next step is to address Task 1.5 related to the Collection Deletion issue. This involves determining a strategy for handling orphaned prompts.

