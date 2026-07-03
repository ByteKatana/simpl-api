# Security Policy

Simpl:API is a versatile headless CMS built for flexibility—from personal projects to enterprise-scale automation. Model
any content structure with custom Entry Types through a modern Simpl:API Studio or programmable REST API. Secure your
workflows with granular Role-Based Access Control for both users and API keys, per-API-key rate limiting, seamless OAuth
2.0 authentication across 10+ providers, and comprehensive audit logs alongside request analytics.

## Description

This project is a headless CMS currently under active development. Security is managed by the maintainer in their free
time. We appreciate all reports and contributions to improve the project's security posture.

## Reporting Security Issues

How to report vulnerabilities:

- **Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**
  Instead, contact the project owner/maintainer directly via their GitHub
  profile [ByteKatana](https://github.com/ByteKatana).
- Required formats:
    - Please include as much of the information listed below as you can to help us better understand and resolve the
      issue:
        - The type of issue (e.g., buffer overflow, SQL injection, or cross-site scripting)
        - Full paths of source file(s) related to the manifestation of the issue
        - The location of the affected source code (tag/branch/commit or direct URL)
        - Any special configuration required to reproduce the issue
        - Step-by-step instructions to reproduce the issue
        - Proof-of-concept or exploit code (if possible)
        - Impact of the issue, including how an attacker might exploit the issue
        - Expected response time: As this is a personal project, please allow for reasonable time for review and
          response.

## Security Requirements

Users and contributors are expected to:

- Keep all dependencies updated regularly (especially critical ones like `react`, `next`, `next-auth`, `prisma`, and
  `mongodb`).
- Follow secure configuration guidelines, especially regarding environment variables (`.env`), which should never be
  committed to version control.
- Ensure API routes are properly authenticated and authorized.

## Vulnerability Handling Process

- All reports are reviewed by the maintainer.
- Fixes are prioritized based on severity and impact on users.
- Disclosure is managed on a case-by-case basis, typically aiming for transparency once a fix is ready.

## Supported Versions

Only the latest development version is actively supported due to the nature of this project's current status (0.x).

## Hardening Recommendations

- Ensure all sensitive environment variables are defined correctly and not exposed.
- Implement robust authentication via `next-auth` as recommended in its documentation.
- Use secure practices when handling user input and database queries.

## Help

For common security-related problems or configuration mistakes:

- Check your application (both client and server) logs for suspicious activity.
- Verify your environment variables are configured correctly for your deployment environment.

## Authors

- ByteKatana (Maintainer)

