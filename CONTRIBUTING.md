# Contributing to simpl-api

First off, thanks for taking the time to contribute! ❤️

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

All types of contributions are encouraged and valued. See the Table of Contents for different ways to help and details
about how this project handles them. Please make sure to read the relevant section before making your contribution. It
will make it a lot easier for us maintainers and smooth out the experience for all involved.

> [!TIP] **Other ways to support the project**
>
> If you like the project but just don't have time to contribute, that's fine. There are other easy ways to support the
> project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Share it on social media
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Contributor License Agreement (CLA)

> [!NOTE]
>
> In order to accept your pull request, we need you to [sign](https://cla-assistant.io/ByteKatana/simpl-api)
> the [Contributor License Agreement](CLA.md). You only need to do this once to work on this project.

## Table of Contents

- [Contributor License Agreement (CLA)](#contributor-license-agreement-cla)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
        - [Before Submitting A Bug Report](#before-submitting-a-bug-report)
        - [How Do I Submit a (Good) Bug Report?](#how-do-i-submit-a-good-bug-report)
    - [Suggesting Enhancements](#suggesting-enhancements)
        - [Before Submitting a Bug Report](#before-submitting-a-bug-report)
        - [How Do I Submit an (Good) Enhancement](#how-do-i-submit-an-good-enhancement)
    - [Your First Code Contribution](#your-first-code-contribution)
    - [Improving The Documentation](#improving-the-documentation)
- [Styleguide](#styleguides)
    - [Commit Messages](#commit-messages)
    - [Pull Request Process](#pull-request-process)
        - [Branch Naming Convention](#branch-naming-convention)
- [Join The Project Team](#join-the-project-team)
- [License](#license)

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation]().

Before you ask a question, it is best to search for existing [Issues](https://github.com/ByteKatana/simpl-api/issues)
that might help you. In case you have
found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to
search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/ByteKatana/simpl-api/issues/new).
- Select the appropriate issue template.
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the
> necessary rights to the content, and that the content you contribute may be provided under the project license.

### Reporting Bugs

This section guides you through submitting a bug report for simpl-api.

#### Before Submitting A Bug Report

A well-written bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to
investigate the issue and provide as much information as possible in detail in your report. Please complete the
following steps in advance to ensure that your bug report is effective and helpful to fix any potential bug as fast as
possible.

- Make sure you are using the latest version of simpl-api.
- Determine if your bug is a bug and not an error on your side (e.g. using incompatible environment
  components/versions) (Make sure that you have read the [Documentation](). If you are looking for support, please
  check [this section](#i-have-a-question)).
- Check if the issue has already been reported (and potentially already solved) in
  the [Bug Tracker](https://github.com/ByteKatana/simpl-api/issues?q=label:bug).
- Also make sure to search the internet to see if users outside the project community have discussed the issue.
- Collect information about the bug:
    - Stack trace (Include the full stack trace of the error)
    - OS, Platform, and Version (Linux, Windows, macOS, x86, ARM, etc.)
    - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
    - Possibly your input and the output.
    - Can you reliably reproduce the bug? And also, can you reproduce it with older versions?

#### How Do I Submit A (Good) Bug Report?

> You must **never** report security related issues, vulnerabilities, or bugs including sensitive information to the
> issue tracker, or elsewhere in public. Instead, please check the [Security Policy](SECURITY.md).

We use the [Issue Tracker](https://github.com/ByteKatana/simpl-api/issues) to track bugs and errors. If you run into an
issue with the project:

- Open a new issue and fill out the template. (Since we can't be sure at this point if it is a bug or not, we ask you
  not to talk about a bug yet and not to label the issue.)
- Explain the behavior you are seeing and what you expected to see instead.
- Please provide as much information as possible and describe the steps to reproduce that someone else can follow to see
  the same behavior. This usually includes your code. For example, if you are reporting a bug in a function, include a
  minimal code snippet that demonstrates the issue.
- For good bug reports, you should isolate the problem and create a minimal test case. This means that you should try to
  reduce the code that reproduces the bug to the smallest possible amount of code that still reproduces the bug. This
  will help us to understand the problem better and to fix it faster.
- Once it's filled out:
    - The project will label the issue accordingly.
    - A team member will try to reproduce the issue with your provided steps. If there are no steps to reproduce, the
      issue will be marked as `needs-reproduction`. Bugs with the `needs-reproduction` label will not be addressed until
      they can be reproduced.
    - If the issue is reproducible, it will be marked `needs-fix` as well as possibly other labels (such as `critical`)
      and the issue will be left to be [implemented by someone](#your-first-code-contribution)

### Suggesting Enhancements

If you have an idea for a new feature, this section guides you through the process of submitting an enhancement
suggestion for simpl-api, including completely new features and minor improvements to existing functionality.
Following these steps will help maintainers and the community understand your suggestion:

#### Before Submitting an Enhancement Suggestion

- Make sure you are using the latest version of simpl-api.
- Check the [Documentation]() carefully and find out if your enhancement is already covered. Also, check the [Roadmap]()
  to see if your enhancement is already planned or already suggested in
  the [Issue Tracker](https://github.com/ByteKatana/simpl-api/issues?q=label:enhancement).
- If it is already suggested, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. If it is beyond the scope of the project,
  check if it is a good fit for advanced versions of simpl-api.

#### How Do I Submit an (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [Issues](https://github.com/ByteKatana/simpl-api/issues).

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Describe the current behavior and explain which behavior you expected to see instead and why. At this stage you can
  also tell us which alternatives don't work for you.
- You may want to include screenshots and/or videos to help you explain your suggestion. Please avoid using
  private information (e.g., sensitive data) for your demonstration. Also, please prefer using screen recorders that
  don't put watermarks on the screenshots/videos.
- Explain why this enhancement would be useful to the project. You may also want to point out to solutions of the other
  projects which could serve as inspiration.

### Your First Code Contribution

Unsure where to begin contributing to simpl-api?
First, check [CODE-OVERVIEW.md](CODE-OVERVIEW.md) to understand the project structure
and [CONTRIBUTING.md](CONTRIBUTING.md)
to understand the contribution process.
After that, you can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/ByteKatana/simpl-api/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) -
  issues which should only require a few lines of code,
- [Help wanted issues](https://github.com/ByteKatana/simpl-api/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) –
  issues which should be a bit more involved than `beginner` issues.

### Improving The Documentation

We welcome any contributions that improve the documentation for `simpl-api`. This includes:

- Correcting typos or grammar errors.
- Improving the clarity of existing explanations.
- Adding missing examples or tutorials.
- Updating the documentation to reflect changes in the code.
- Adding new translations for the documentation.

You can find the documentation on our [official documentation site](https://bytekatana.github.io/simpl-api-doc/).

## Styleguide

To ensure consistency and maintainable code quality, we follow these standards:

- **Code Formatting**: We use [Prettier](https://prettier.io/) to enforce consistent code formatting. Please ensure your
  code adheres to the project's formatting rules before submitting a Pull Request.
- **Linting**: We use [ESLint](https://eslint.org/) to catch potential issues and enforce best practices.
- **TypeScript**: This project is built with TypeScript. Please ensure all new code is type-safe and follows existing
  patterns.
- **Tailwind CSS**: We use [Tailwind CSS](https://tailwindcss.com/) for styling. Please follow standard Tailwind
  utilities and conventions.

### Commit Messages

To make commit messages standardized, easy to understand, and easily trackable, we adopted
the [EU System Git Commit Guidelines](https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/) for
simpl-api commit messages.

### Pull Request Process

- **Branch Naming**: Please name your branches descriptively, such as `feature/new-feature` or `bugfix/typo`. See the
  convention below for more details.
- **Pull Request Title**: The title should be concise and descriptive, summarizing the changes in a single line.
- **Pull Request Description**: Provide a detailed description of the changes, including any relevant context or
  background information using related template to branch type.
- **Code Review**: Your Pull Request will be reviewed by the project maintainers. Please be prepared to address any
  feedback or questions raised during the review process.
- **Merge Criteria**: Your Pull Request will be merged once it has been approved by the required number of reviewers and
  meets the project's quality standards.

#### Branch Naming Convention

Your branch name should follow the following format in the table:

| Branch Type   | Example                           | Description                                        |
|---------------|-----------------------------------|----------------------------------------------------|
| Feature       | `feature/new-feature`             | Describes a new feature or enhancement             |
| Bugfix        | `bugfix/typo`                     | Fixes a bug or typo                                |
| Hotfix        | `hotfix/critical-bug`             | Fixes a critical bug in production                 |
| Release       | `release/v1.0.0`                  | Releases a new version                             |
| Maintenance   | `maintenance/update-dependencies` | Updates dependencies or performs maintenance tasks |
| Documentation | `doc/improve-docs`                | Improves the documentation                         |
| Refactoring   | `refactor/code-cleanup`           | Refactors existing code                            |
| Style         | `style/improve-formatting`        | Improves code formatting or style consistency      |
| Performance   | `perf/optimize-performance`       | Optimizes performance or improves efficiency       |
| Design        | `design/improve-ui`               | Improves user interface or user experience         |
| Testing       | `test/add-tests`                  | Adds tests or improves test coverage               |
| Security      | `security/fix-security-issue`     | Fixes a security issue                             |
| Chore         | `chore/update-readme`             | Updates README or other non-code changes           |
| Revert        | `revert/rollback-commit`          | Reverts a previous commit                          |
| Localization  | `localize/translate-to-english`   | Translates the project to English                  |
| Configuration | `config/update-config`            | Updates configuration files                        |

## Join The Project Team

If you're passionate about `simpl-api` and would like to contribute more significantly, we'd love to have you on board!
We are always looking for help in areas like:

- Maintaining existing features.
- Fixing bugs.
- Implementing new features.
- Reviewing Pull Requests.
- Improving documentation and testing.

If you are interested in becoming a regular contributor or help out more actively, please reach out by opening an issue
or contacting the project owner directly. We appreciate your interest and look forward to working with you!

## License

By contributing to simpl-api, you agree that your contributions will be licensed under the [LICENSE](LICENSE) file in
the root directory of this source tree.
