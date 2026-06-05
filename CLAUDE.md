# Developer Assistant Instructions (CLAUDE.md / GEMINI.md / .cursorrules)

This repository uses a unified AI configuration located in the `.ai/` directory.
- Rules: `.ai/rules/` (compiled to `.cursor/rules/` for Cursor)
- Skills: `.ai/skills/`
- Custom Agents: `.ai/agents/`
- Custom Commands: `.ai/commands/`

## Commands and Workflow

To build, test, and check code quality, please refer to the stack documentation:
[CLAUDE-STACK.md](file:///CLAUDE-STACK.md)

For specific instructions:
- **Claude Code users**: The `.claude/` folder is linked directly to `.ai/`.
- **Cursor users**: Automated rules are compiled under `.cursor/rules/` with globs.
- **Gemini / Codex users**: Read rules under `.ai/rules/` and refer to stack documentation.

---

## Custom Agents (`.ai/agents/`)

Specialized subagents are available for focused tasks:

- **typescript-reviewer**: Expert TypeScript/JavaScript code reviewer for type safety, async correctness, and patterns.
- **react-reviewer**: Expert React/JSX code reviewer for hook correctness, render performance, and client/server boundaries.
- **database-reviewer**: PostgreSQL database specialist for query optimization, schema design, security, and performance.
- **security-reviewer**: Security vulnerability detection and remediation specialist (OWASP Top 10, secrets, inputs).
- **code-reviewer**: General expert code reviewer for quality, structure, and maintainability.
- **planner**: Expert planning specialist for mapping complex features and large-scale refactoring.
- **architect**: Software architecture specialist for system design, scalability, and technical decisions.
- **code-architect**: Designs feature architectures and provides detailed implementation blueprints.
- **a11y-architect**: Accessibility Architect specializing in WCAG 2.2 compliance for inclusive user experience.
- **seo-specialist**: Technical SEO audits, metadata review, schema markup, and performance optimization.
- **e2e-runner**: End-to-end testing specialist for running and writing Playwright tests.
- **build-error-resolver**: Diagnoses and resolves general build/compilation and TypeScript errors quickly.
- **react-build-resolver**: Fixes React-specific compile errors, hydration mismatches, and bundler configurations.
- **code-simplifier**: Refines and simplifies code for clarity and maintainability while preserving behavior.
- **tdd-guide**: Test-Driven Development guide enforcing test-first coding standards.
- **type-design-analyzer**: Analyzes type structures for safety, invariants, encapsulation, and type-system design.

---

## Skills (`.ai/skills/`)

The following skills are available to load for specific contexts:

- **frontend-patterns**: Frontend development patterns for React, Next.js, state management, and UI.
- **coding-standards**: Baseline cross-project coding conventions.
- **backend-patterns**: Backend architecture, database optimization, and server best practices.
- **api-design**: REST API design patterns (resource naming, status codes, error handling, etc.).
- **postgres-patterns**: PostgreSQL database query optimization and schema design patterns.
- **database-migrations**: Database migration best practices, rollbacks, and zero-downtime deployments.
- **e2e-testing**: Playwright E2E testing patterns, Page Object Model, and flaky test strategies.
- **docker-patterns**: Docker and Compose patterns for local development and orchestration.
- **deployment-patterns**: Deployment workflows, CI/CD pipelines, and health check patterns.
- **accessibility**: Audit and improve web accessibility following WCAG 2.2 guidelines.
- **frontend-a11y**: Practical accessibility patterns (semantic HTML, ARIA, focus) for React/Next.js.
- **react-patterns**: React 18/19 patterns (boundaries, form actions, Suspense, data fetching).
- **react-performance**: React and Next.js performance optimization (waterfalls, bundle size, renders).
- **react-testing**: Component testing with React Testing Library, Vitest/Jest, MSW, and axe.
- **redis-patterns**: Redis caching, distributed locks, rate limiting, and pub/sub.
- **best-practices**: Modern web development security, compatibility, and quality rules.
- **web-audit**: Comprehensive audits covering performance, accessibility, and SEO.
- **seo**: Optimize web visibility, rankings, sitemaps, robots.txt, and metadata.
- **performance**: Performance tuning, Core Web Vitals, speed, and layout shift resolution.
- **core-web-vitals**: Optimize page experience metrics (LCP, INP, CLS) for better rankings.
- **tdd-workflow**: Enforce test-driven development (write-tests-first) with 80%+ test coverage.
- **verification-loop**: Session verification loops to ensure code correctness and test suites.
- **nextjs-turbopack**: Turbopack compilation and bundler optimizations.
- **nodejs-keccak256**: Safe Ethereum Keccak-256 hashing patterns avoiding standard SHA3-256 mismatch.
- **frontend-design-direction**: Product-specific frontend design direction and aesthetic rules.
