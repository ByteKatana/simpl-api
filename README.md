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
- [MongoDB](https://www.mongodb.com/download-center/community) (Replica Set Enabled)
- [Redis](https://redis.io/download)

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
the [GitHub repository](https://github.com/ByteKatana/simpl-api/issues).

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

[next-auth]: https://img.shields.io/badge/v5-blue?style=for-the-badge&label=NextAuth&labelColor=black

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
