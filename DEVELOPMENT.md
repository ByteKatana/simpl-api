# Development Guide

Thank you for your interest in contributing to `simpl-api`! This guide provides instructions on setting up your
development environment and the conventions we follow.

## Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [MongoDB](https://www.mongodb.com/) (v6+) (Replica Set required for prisma)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

## Setup

> [!TIP]
> **Quick Start**
> 
> To easily get started development, you can use dev containers configuration provided in the `.devcontainers` directory.
> It will automatically install all the dependencies, configure databases, setup email testing server (via mailpit) and the environment variables for you in a docker container.
> To learn more about devcontainers, visit [https://containers.dev/](https://containers.dev/).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ByteKatana/simpl-api.git
   cd simpl-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the `.env.example` file to `.env` and fill in the required variables. **Never commit your `.env` file to version
   control.**

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Development Workflow

- **Branching:** Please create a new branch for each feature or bug fix. See Branch naming conventions in
  the [CONTRIBUTING.md](CONTRIBUTING.md#branch-naming-convention).
- **Commit Messages:** Follow the guidelines defined in the [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages).
- **Code Style:** We use `Prettier` and `ESLint`. Please run `npm run lint` or `npm run format` (if available) before
  submitting.

## Testing

**SKIP THIS SECTION UNTIL THIS NOTICE IS REMOVED**

We prioritize testing to ensure stability.

- **Unit Tests:** `npm test` (using Jest)
- **E2E Tests:** `npm run cypress:open` (using Cypress)

Please ensure all tests pass before opening a Pull Request.