# GEMINI.md

## Project Overview

This project is a Hotel Management System built with Next.js, React, and TypeScript. It uses Supabase for the database and provides a comprehensive system for managing hotel operations, including reservations, room selection, customizations, and special offers. The frontend is built with Shadcn UI components and Tailwind CSS for styling. The project also includes end-to-end tests with Playwright.

## Building and Running

### Prerequisites

- Node.js and pnpm

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
pnpm run build
```

### Running in Production Mode

```bash
pnpm run start
```

### Running Tests

The project uses Playwright for end-to-end testing.

To run the tests, use the following command:

```bash
pnpm playwright test
```

## Development Conventions

### Code Style

The project uses Biome for code formatting and linting.

- To format the code: `pnpm run format`
- To lint the code: `pnpm run lint`

### State Management

The project uses Zustand for state management, particularly for handling user selections in the reservation process. The main store is located at `/stores/user-selections-store.ts`.

### Database Schema

The database schema is defined in two SQL files:

- `supabase-schema.sql`: Defines the core booking system schema, including orders, order items, and hotel proposals.
- `supabase-content-schema.sql`: Defines the schema for content management, including room types, customization options, special offers, and translations.

### Component Architecture

The project follows a component-based architecture, with reusable UI components located in `/components/ui` and feature-specific components in `/components/features`. The main application logic is in the `/app` directory, following the Next.js App Router structure.

A detailed architecture for the "Selection Summary" feature can be found in `/components/selection-summary/COMPONENT_ARCHITECTURE.md`.

### End-to-End Testing

End-to-end tests are located in the `/e2e` directory. The Playwright configuration is in `e2e/playwright.config.ts`.
