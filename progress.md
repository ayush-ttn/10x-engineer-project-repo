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
- Made sure that the relevent test is available and is passed (manually done by developer, do not run the commands automatically) without changing anything in the test case.

### Context for Next Steps
This file provides the necessary background and project setup insights to jump into subsequent tasks efficiently. For next steps, continue with Task 1.3 to address timestamp updates in PUT requests.