# AGENTS.md

<!-- version: 2.0.0 -->

This file provides guidance to AI agents when working with code in the `simpl:api` repository.

## Project Overview

Simpl:API is a headless CMS that offers flexible content modeling, allowing you to create custom structured data types
and content within those types to gather data from your applications and services, as well as to process, visualize, and
display it in your applications and services. It uses TypeScript/Next.js for both the frontend and backend. More
technical details
can be found in the [CODE OVERVIEW](CODE-OVERVIEW.md).

## Principles

- Follow existing patterns in the surrounding code
- Write tests for new functionality. For E2E tests, follow Gherkin syntax using Cucumber.js. **Temporarly (until this
  notice is removed), ignore current tests which most tests are for deprecated codes and need to be updated or
  rewritten**
- Keep changes focused — avoid overengineering
- Separate PRs for frontend and backend changes. See [the Pull Request Process](CONTRIBUTING.md#pull-request-process)
  section of the Contributing Guide.
- Security: prevent any security vulnerability included but not limited to XSS, SQL injection, command injection
- Type-safety: prevent TS errors, ensure that code is type-safe and follows TypeScript best practices.
- Modularity: keep code organized and maintainable by using clear separation of concerns and following best practices
  for modularity and easy testing.

## Comments

- Always add JSDoc comments to new functions, methods, and classes.
- Only add an inline comment when it explains **why** something is done or reveals non-obvious logic that a reader must
  know to
  safely change the code. If the code is self-explanatory, no comment is needed.
- Never include links (Slack, GitHub, Jira, etc.) in code comments.

## Human Review Gates

Before running `git push`, stop and get explicit human approval. When changes are ready, show a summary of changes and
wait for instruction. "Open a PR" in a task description is intent, not permission to push without review.

## Commands

### Build & Run

```bash
npm run dev                          # To start development server (localhost:3000)
npm run build                        # To build the application for production
npm run start                        # To start the application in production mode
```

### Test

```bash
# Unit Tests
npm run test                                                    # Run all tests once and exit
npm run test:watch                                              # Run all tests watch changes

# E2E
npm run cypress:run -- --spec "path/to/file.steps.ts"          # Run Specific test
```

### Lint & Format

```bash
npm lint                         # ESLint
npm lint:fix                     # ESLint auto-fix
npm prettier:check               # Prettier check
npm prettier:write               # Prettier auto-format
npm typecheck                    # TypeScript check
```

## Architecture

See [CODE-OVERVIEW](CODE-OVERVIEW.md) for more details.