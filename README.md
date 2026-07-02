<h1 style="text-align: center;">Simpl:API</h1>
<div  style="text-align: center;" >

![License Badge](https://img.shields.io/github/license/bytekatana/simpl-api) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/a61bb176b6c34b35bc96892e004e1469)](https://app.codacy.com/gh/ByteKatana/simpl-api/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) ![GitHub package.json version](https://img.shields.io/github/package-json/v/:user/:repo)

Versatile headless CMS from personal portfolio to enterprise automation

📖 **Documentation**: <br> New documentation coming soon. <br> <small>(with new Simpl:API Studio update)</small>
</div>

<hr>

## ⚡ Overview

Simpl:API is a versatile headless CMS built for flexibility—from personal projects to enterprise-scale automation. Model
any content structure with custom Entry Types through a modern Simpl:API Studio or programmable REST API. Secure your
workflows with granular Role-Based Access Control for both users and API keys, per-API-key rate limiting, seamless OAuth
2.0 authentication across 10+ providers, and comprehensive audit logs alongside request analytics.

## ✨ Features

* 🏗️ **Custom Content Modeling (Entry Types)**: Use the powerful builder to define custom structured data types (called
  Entry Types) that fit your project's specific needs.
* 📝 **Content Management via Studio & API**: Effortlessly create, process, and delete content within your defined Entry
  Types using the intuitive Simpl:API Studio UI or directly via the robust Simpl:API REST API endpoints.
* 🔒 **RBAC & Permission Groups**: Secure your application with Role-Based Access Control (RBAC). Create permission
  groups
  to manage granular access for both users and API Keys, ensuring the right people and services have the right level of
  access.
* 🔧 **API Key Management with Rate Limiting**: Generate API Keys with built-in fixed-window rate limiting. Control the
  frequency of requests per API Key to protect your services and manage resource usage effectively. Other rate limiting
  methods are planned for future updates.
* 📈 **Dashboard Statistics & Detailed Logging**: Gain insights into your API usage with statistical data displayed on
  the
  Studio dashboard. Monitor every request with per-request logs, including response times, status codes, and rate limit
  tracking.
* 🛡️ **Comprehensive Authentication**: Support for 10+ OAuth providers (including Google, GitHub, GitLab, Bitbucket,
  Apple,
  and more) alongside traditional email and password registration. Advanced features like Passkeys, OTP, and 2FA are
  currently in the roadmap.
* 🎨 **Modern Studio UI**: A state-of-the-art management interface built with React, Next.js, shadcn/ui, and TanStack,
  providing a seamless experience for modeling content and managing your API ecosystem.

### 🚀 Use Case Scenarios

**Some of the use cases for Simpl:API include:**

#### 1. Personal Blog or Portfolio

* **Setup**: Create an "Article" Entry Type with fields for `title`, `slug`, `content`, `cover_image`, and `tags`.
* **Workflow**: Use the Simpl:API Studio to write and publish your posts.
* **Consumption**: On your personal website (built with Next.js or Astro), fetch the articles using a restricted API
  Key. This allows you to decouple your content management from your site's code.

#### 2. Inventory & E-commerce Data Processing

* **Setup**: Define a "Product" Entry Type with fields for `sku`, `price`, `stock_quantity`, and `status`.
* **Workflow**: Your warehouse management system or a cron job can actively update the `stock_quantity` and `price` via
  the REST API endpoints. You can use this data to trigger automated systems to do things like send out stock and price
  alerts, or display the change in a line graph and more.
* **Monitoring**: Use the Studio dashboard to track how often your inventory system updates data and monitor logs to
  ensure all automated updates are succeeding.
* **Security**: Create a specific "Inventory Update" Permission Group for the API Key used by your warehouse system,
  restricting it to only update the "Product" entry type without allowing deletions or structural changes.

#### 3. Mobile App Configuration & Remote Features

* **Setup**: Create a "Config" Entry Type with fields for `feature_flags`, `api_endpoint_overrides`, and
  `maintenance_mode`.
* **Workflow**: Update app settings instantly through the Studio without needing to push a new version to the App Store.
* **Consumption**: Your mobile application fetches this configuration at startup. Use Rate Limiting to ensure that even
  with a large user base, the configuration endpoint remains stable and protected from excessive polling.

...and many more. These are just few examples of the many use cases Simpl:API can help you solve.

## 📦 Installation & Usage

Basic installation instructions are provided below. For more details check the [documentation]()

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/download-center/community)
- [Docker](https://docs.docker.com/get-docker/) (optional)
- [Docker Compose](https://docs.docker.com/compose/install/) (optional)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/simpl-api.git
   cd simpl-api
   ```
2. Run the build script
   ```bash
   npm run build
   ```
3. Start the application
   ```bash
   npm run start
   ```
4. Open [http://localhost:3000/setup](http://localhost:3000/setup) with your browser to complete the setup process.

## 🙋🏻‍♂️ Support

If you have any questions or need help, you can create an issue on
the [GitHub repository](https://github.com/ByteKatana/simpl-api/issues) or reach out to us on [Discord]() or [Matrix]().

## 🧱 Tech Stack

**Language:** <br> [![Typescript][Typescript]][Typescript-url]

**Runtime:** <br> [![Node.js][Node.js]][Node-url]

**Framework:** <br> [![Next][Next.js]][Next-url] [![React][React.js]][React-url]

**Database:** <br> [![MongoDB][MongoDB]][MongoDB-url] [![Prisma][Prisma]][Prisma-url] [![Redis][Redis]][Redis-url]

**Authentication:** <br> [![NextAuth][next-auth]][next-auth-url]

**Simpl:API Studio (UI):** <br>
[![shadcn/ui][shadcn]][shadcn-url] [![Tanstack][Tanstack]][Tanstack-url] [![Zustand][Zustand]][Zustand-url] [![Tailwind CSS][Tailwind]][Tailwind-url] [![Zod][Zod]][Zod-url]

**Tools:** <br>
[![ESLint][ESLint]][ESLint-url] [![Prettier][Prettier]][Prettier-url]

**Testing:** <br>
[![Jest][Jest]][Jest-url] [![Testing Library][Testing-Library]][Testing-Library-url] [![Cucumber][Cucumber]][Cucumber-url] [![Cypress][Cypress]][Cypress-url]

**Others:**

- **Email:** [nodemailer](https://nodemailer.com/about/)
- **Testing:** [node-mocks-http](https://github.com/eugef/node-mocks-http)

## 🗺️ Roadmap

You can check the [project's kanban board](https://github.com/users/ByteKatana/projects/2) to find out about what is
going on with the project.

## 🤜🤛 Contributing

If you find this project interesting, and want to contribute, please read
the [contributing guidelines](CONTRIBUTING.md).

## 🧾 License

This is an open-sourced software licensed under the [AGPL v3](LICENSE).

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Typescript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white

[Typescript-url]: https://www.typescriptlang.org/

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white

[Next-url]: https://nextjs.org/

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[React-url]: https://reactjs.org/

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white

[Node-url]: https://nodejs.org/en/

[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white

[MongoDB-url]: https://www.mongodb.com/

[next-auth]: https://img.shields.io/badge/v5-blue?logo=data:image/svg%2Bxml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjIzMiIgdmlld0JveD0iMCAwIDIxMCAyMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjA4LjY4NyAzMS44NTlMMzAuMDk0NyAxNjcuNzNDOC4xNjM4OCAxMjcuOTY2IDAuNTY3NTU5IDc5Ljk5NzUgMCA1MS4yMjc1VjMzLjYxODFDMCAzMS4wNTY3IDIuNzc4OCAyOS41NjI4IDQuMTY4NTEgMjkuMTM1NkMzMy41NjE3IDIwLjI3NzggOTMuMjQ2NSAyLjMwNTI0IDk2LjgzNzggMS4yODA2OUMxMDAuNDI5IDAuMjU2MTM4IDEwMy40NjQgMCAxMDQuNTM0IDBIMTA0LjYzMUMxMDUuNyAwIDEwOC43MzUgMC4yNTYxMzggMTEyLjMyNyAxLjI4MDY5QzExNS45MTggMi4zMDUyNCAxNzUuNjAzIDIwLjI3NzggMjA0Ljk5NiAyOS4xMzU2QzIwNi4wMyAyOS40NTMzIDIwNy44MzIgMzAuMzYxMyAyMDguNjg3IDMxLjg1OVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMjhfNjEpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMDkzOCAxNjcuOTUyTDIwOC42ODYgMzIuMDgxNUMyMDguOTgxIDMyLjU5ODMgMjA5LjE2NCAzMy4xODQyIDIwOS4xNjQgMzMuODQwNlY1MS40NUMyMDguMjAyIDEwMC4yMjMgMTg3LjAzOCAyMDQuMTcyIDExMC4wODEgMjI5Ljc4NkMxMDkuMDEzIDIzMC4yMTMgMTA2LjQ5IDIzMS4wNjcgMTA0Ljk1MSAyMzEuMDY3SDEwNC4yMTJDMTAyLjY3MyAyMzEuMDY3IDEwMC4xNSAyMzAuMjEzIDk5LjA4MTQgMjI5Ljc4NkM2Ny41MTkzIDIxOS4yODEgNDUuMzQxNSAxOTUuNiAzMC4wOTM4IDE2Ny45NTJaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMTI4XzYxKSIvPgo8cGF0aCBkPSJNMTExLjc0IDEuMjgzMjVDMTA4LjE0NyAwLjI1NjY1IDEwNS4xMSAwIDEwNC4wNCAwTDEwMy43MTkgMjMxLjMwNUgxMDQuMzYxQzEwNS45MDEgMjMxLjMwNSAxMDguNDI1IDIzMC40NSAxMDkuNDk0IDIzMC4wMjJDMTg2LjQ4OSAyMDQuMzU3IDIwNy42NjMgMTAwLjIgMjA4LjYyNSA1MS4zMjk5VjMzLjY4NTNDMjA4LjYyNSAzMS4xMTg4IDIwNS44NDUgMjkuNjIxNiAyMDQuNDU0IDI5LjE5MzlDMTc1LjA0NyAyMC4zMTgxIDExNS4zMzMgMi4zMDk4NSAxMTEuNzQgMS4yODMyNVoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8xMjhfNjEpIiBmaWxsLW9wYWNpdHk9IjAuMjEiLz4KPGVsbGlwc2UgY3g9IjEwNC45MDUiIGN5PSIxMTQuMjA5IiByeD0iNDcuODAxIiByeT0iNDcuNDgwMiIgZmlsbD0iI0UzRTJGQSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTk2LjI0MzUgMTI0LjQ3NUM5Mi42MDc3IDEyNC43OTYgODMuNDExMSAxMjMuMTkyIDc4LjkxOTcgMTE5LjM0MkM3NC4wOTcxIDExNS4yMDggNzEuNTQxIDEwOS43MTggNzEuNTQxIDEwMS42OTdDNzEuNTQxIDkxLjc0NjkgODAuNTIzOSA4MS4xNjU0IDkzLjAzNTUgODEuNDg2MUMxMDQuOTE5IDgxLjc5MDcgMTEyLjkzNCA4OC40ODk0IDExNC41MyA5OS4xMzA3QzExNS4zNjMgMTA0LjY4NCAxMTQuNTE0IDEwNy4zNTMgMTEzLjg1NCAxMDkuNDI2QzExMy43NTIgMTA5Ljc0OSAxMTMuNjU0IDExMC4wNTcgMTEzLjU2OCAxMTAuMzU5QzExMy4yNDcgMTExLjQyOSAxMTIuNzk4IDExMy43NiAxMTMuNTY4IDExNC41M0MxMTQuMzM3IDExNS4zIDEyNi4wNzkgMTI2LjYxNCAxMzEuODU0IDEzMi4xNzRDMTMyLjM4OCAxMzIuODE2IDEzMy40NTggMTM0LjQyIDEzMy40NTggMTM1LjcwM1YxNDEuNzk5QzEzMy40NTggMTQyLjc2MSAxMzMuMjAxIDE0My4wODIgMTMyLjE3NSAxNDMuMDgySDExOS4zNDJDMTE4LjU5NCAxNDIuOTc1IDExNy4wOTYgMTQyLjI0OCAxMTcuMDk2IDE0MC4xOTVDMTE3LjA5NiAxMzguMDA2IDExNi44NjMgMTM3LjY4NCAxMTYuMzk2IDEzNy4wMzlDMTE2LjMxNiAxMzYuOTI4IDExNi4yMjggMTM2LjgwNyAxMTYuMTM0IDEzNi42NjZDMTE1LjQ5MiAxMzUuNzAzIDExNC4yMDkgMTM1LjcwMyAxMTIuOTI2IDEzNS43MDNDMTExLjY0MyAxMzUuNzAzIDExMC42OCAxMzUuMzgyIDExMC4wMzkgMTM0Ljc0MUMxMDkuMzk3IDEzNC4wOTkgMTA5LjM5NyAxMzMuMTM3IDEwOS43MTggMTMxLjg1NEMxMTAuMDM5IDEzMC41NyAxMDkuNzE4IDEyOS4yODcgMTA5LjA3NiAxMjguOTY2QzEwOC45NzQgMTI4LjkxNSAxMDguODU2IDEyOC44NDggMTA4LjcyMyAxMjguNzcyQzEwOC4wMTkgMTI4LjM3MiAxMDYuODk2IDEyNy43MzQgMTA1LjU0NyAxMjguMDA0QzEwMy45NDMgMTI4LjMyNSAxMDEuNjk3IDEyOC4wMDQgMTAwLjQxNCAxMjYuNzIxQzk5LjEzMSAxMjUuNDM3IDk3LjUyNjcgMTI0LjQwMSA5Ni4yNDM1IDEyNC40NzVaTTg3LjU4MTQgMTAwLjA5NEM5MC4yMzkxIDEwMC4wOTQgOTIuMzkzNiA5Ny45MzkzIDkyLjM5MzYgOTUuMjgxNkM5Mi4zOTM2IDkyLjYyMzkgOTAuMjM5MSA5MC40Njk0IDg3LjU4MTQgOTAuNDY5NEM4NC45MjM3IDkwLjQ2OTQgODIuNzY5MiA5Mi42MjM5IDgyLjc2OTIgOTUuMjgxNkM4Mi43NjkyIDk3LjkzOTMgODQuOTIzNyAxMDAuMDk0IDg3LjU4MTQgMTAwLjA5NFoiIGZpbGw9InVybCgjcGFpbnQzX2xpbmVhcl8xMjhfNjEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTI4XzYxIiB4MT0iMTkuNTY5NSIgeTE9Ijk2LjU2NDQiIHgyPSI5Ny41MjY5IiB5Mj0iMTUuMDc4MiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNDVGRkM4Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFEQkJGMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMTI4XzYxIiB4MT0iNzMuNzg1NiIgeTE9IjE0My43MjQiIHgyPSIxNzAuNjcxIiB5Mj0iMTkwLjg4NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRDE0QUU4Ii8+CjxzdG9wIG9mZnNldD0iMC41NTIyMjgiIHN0b3AtY29sb3I9IiNCNjI4RTMiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODMxNUZEIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8xMjhfNjEiIHgxPSIxNTUuOTE0IiB5MT0iMjEuODE1MiIgeDI9IjE1NS45MTQiIHkyPSIxODIuNTQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMyMEFCRjUiLz4KPHN0b3Agb2Zmc2V0PSIwLjM5ODA5MyIgc3RvcC1jb2xvcj0iIzJBOENDMyIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBMTA0REMiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzEyOF82MSIgeDE9IjkwLjE0ODEiIHkxPSI5OS40NTE3IiB4Mj0iMTI5LjI4NyIgeTI9IjEzOC45MTIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZFNUIwMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRkIyMDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=&style=for-the-badge&label=NextAuth&labelColor=black

[next-auth-url]: https://next-auth.js.org/

[Tanstack]: https://img.shields.io/badge/Tanstack-000000?style=for-the-badge&logo=tanstack&logoColor=white

[Tanstack-url]: https://tanstack.com/

[Prisma]: https://img.shields.io/badge/Prisma-3978FF?style=for-the-badge&logo=prisma&logoColor=white

[Prisma-url]: https://www.prisma.io/

[shadcn]: https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui&logoColor=fff&style=for-the-badge

[shadcn-url]: https://ui.shadcn.com/

[Tailwind]: https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white

[Tailwind-url]: https://tailwindcss.com/

[Zustand]: https://img.shields.io/badge/zustand-602c3c?style=for-the-badge&logo=data:image/png%3Bbase64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEVHcExXQzpKQDlFV16lpqyGh4tPPTdWT0weHRU7LRZGQzmxYjlaTkZsbmywVyxtXDSFhISXm6WWpcaytb6bm56gprY0LiiXmp2prLamsMa0XS42MSxkTUVDSkuyYzGihXdDV2GprbmedVxaRD1kTUWUdGFGOCN4a2OfpbI0SFFAMSddTkbCc0dWQiGFRypXQyJUQCBcTTWviDVXQyJcUDjlqCWxjkG+hBTiohtURD6lr8lORTtDVVZmPyxwSipaRSJDOzaWpsyYqMyYqM2dq8tPOjBERTs6QUKTcCeKaCJvViZdSDK4iSngoiDvqx7KkRuGEi1hAAAAOXRSTlMApZ78cB8hCAMQO/j/FOH4KlT1wFfJTjaY6SxtVexFn3Tn2sN6d671mVuJ+/PPN9CT6TfpS4C9jJaVLRihAAAAi0lEQVQIHXXBxRKCUAAF0Es/QMDubsVuGrv1///GBQ4bx3PwgwC8gFCRohs8QrQV0ZtKOZ9JcgBmU8MwqFa9kjNTUWB58f2jPOjU9juTBTbPq+vIar972MZjwPr1uDvqCFw2wQpQVm/t7Oo9gAgAFtrtZNtMFQFp7nkWU5IQECfjYbuQFvBFRJHgjw9L0A80UmaGpAAAAABJRU5ErkJggg%3D%3D

[Zustand-url]: https://github.com/pmndrs/zustand

[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white

[Redis-url]: https://redis.io/

[Zod]: https://img.shields.io/badge/Zod-38B2AC?style=for-the-badge&logo=zod&logoColor=white

[Zod-url]: https://zod.dev/

[ESLint]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white

[ESLint-url]: https://eslint.org/

[Prettier]: https://img.shields.io/badge/Prettier-000000?style=for-the-badge&logo=prettier&logoColor=white

[Prettier-url]: https://prettier.io/

[Jest]: https://img.shields.io/badge/Jest-974259?style=for-the-badge&logo=jest&logoColor=white

[Jest-url]: https://jestjs.io/

[Testing-Library]: https://img.shields.io/badge/Testing-Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white

[Testing-Library-url]: https://testing-library.com/

[Cucumber]: https://img.shields.io/badge/Cucumber-71BF44?style=for-the-badge&logo=cucumber&logoColor=white

[Cucumber-url]: https://cucumber.io/

[Cypress]: https://img.shields.io/badge/Cypress-00595D?style=for-the-badge&logo=cypress&logoColor=white

[Cypress-url]: https://www.cypress.io/
