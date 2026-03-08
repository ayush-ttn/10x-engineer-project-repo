# PromptLab Frontend

React frontend for PromptLab (Vite + React + Tailwind CSS).

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000` (or set `VITE_API_URL`)

## Setup

```bash
npm install
cp .env.example .env   # optional: edit VITE_API_URL if needed
```

## Development

```bash
npm run dev
```

Open http://localhost:5173. Ensure the backend is running on port 8000.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Tests

```bash
npm run test        # watch mode
npm run test:run    # single run
```

## Project structure

- `src/api/` — API client and endpoints (prompts, collections)
- `src/components/` — Shared UI (Button, Modal, EmptyState, etc.) and layout (Header, Sidebar)
- `src/pages/` — Page components (PromptDetail, PromptForm, CollectionList, etc.)
