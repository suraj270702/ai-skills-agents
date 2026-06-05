# Stack Extension: Next.js + Hono.js + PostgreSQL

> **How to use:** Append this entire file to the bottom of your existing `CLAUDE.md`.
> Everything here is additive — no existing sections are modified.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Hono.js on Node.js |
| Database | PostgreSQL (Prisma ORM) |
| Testing | Vitest (unit), Playwright (E2E) |
| Package Manager | pnpm (default) |

---

## Skills

Use the following skills in the `.ai/skills/` directory when working on related tasks/files:

| Context / Files | Skill Path | Description |
|-----------------|------------|-------------|
| `*.tsx`, `*.jsx`, components | `.ai/skills/frontend-patterns/` | Frontend development patterns for React, Next.js, state management, and UI. |
| `*.ts` anywhere | `.ai/skills/coding-standards/` | Baseline cross-project coding conventions. |
| `app/api/**`, `server/**` | `.ai/skills/backend-patterns/` | Backend architecture, database optimization, and server best practices. |
| API design | `.ai/skills/api-design/` | REST API design patterns (resource naming, status codes, error handling, etc.). |
| Database schemas / queries | `.ai/skills/postgres-patterns/` | PostgreSQL database query optimization and schema design patterns. |
| DB Migrations | `.ai/skills/database-migrations/` | Database migration best practices, rollbacks, and zero-downtime deployments. |
| `tests/e2e/**`, `*.spec.ts` | `.ai/skills/e2e-testing/` | Playwright E2E testing patterns, Page Object Model, and flaky test strategies. |
| Docker configuration | `.ai/skills/docker-patterns/` | Docker and Compose patterns for local development and orchestration. |
| Deployment | `.ai/skills/deployment-patterns/` | Deployment workflows, CI/CD pipelines, and health check patterns. |
| Accessibility auditing | `.ai/skills/accessibility/` | Audit and improve web accessibility following WCAG 2.2 guidelines. |
| React Accessibility | `.ai/skills/frontend-a11y/` | Practical accessibility patterns (semantic HTML, ARIA, focus) for React/Next.js. |
| React patterns | `.ai/skills/react-patterns/` | React 18/19 patterns (boundaries, form actions, Suspense, data fetching). |
| React Performance | `.ai/skills/react-performance/` | React and Next.js performance optimization (waterfalls, bundle size, renders). |
| React component testing | `.ai/skills/react-testing/` | Component testing with React Testing Library, Vitest/Jest, MSW, and axe. |
| Redis integrations | `.ai/skills/redis-patterns/` | Redis caching, distributed locks, rate limiting, and pub/sub. |
| Modern web best practices | `.ai/skills/best-practices/` | Modern web development security, compatibility, and quality rules. |
| Web audits | `.ai/skills/web-audit/` | Comprehensive audits covering performance, accessibility, and SEO. |
| Technical SEO | `.ai/skills/seo/` | Optimize web visibility, rankings, sitemaps, robots.txt, and metadata. |
| Performance optimization | `.ai/skills/performance/` | Performance tuning, Core Web Vitals, speed, and layout shift resolution. |
| Core Web Vitals | `.ai/skills/core-web-vitals/` | Optimize page experience metrics (LCP, INP, CLS) for better rankings. |
| TDD workflows | `.ai/skills/tdd-workflow/` | Enforce test-driven development (write-tests-first) with 80%+ test coverage. |
| Session verification | `.ai/skills/verification-loop/` | Session verification loops to ensure code correctness and test suites. |
| Next.js Turbopack | `.ai/skills/nextjs-turbopack/` | Turbopack compilation and bundler optimizations. |
| Node.js crypto / Keccak | `.ai/skills/nodejs-keccak256/` | Safe Ethereum Keccak-256 hashing patterns avoiding standard SHA3-256 mismatch. |
| UI/UX design rules | `.ai/skills/frontend-design-direction/` | Product-specific frontend design direction and aesthetic rules. |

When spawning subagents, always pass conventions from the respective skill into the agent's prompt.

---

## Agents

Delegate to these specialized subagents in the `.ai/agents/` directory for focused tasks:

| Agent File | Purpose / When to Use |
|------------|-----------------------|
| `typescript-reviewer.md` | Expert TypeScript/JavaScript code reviewer for type safety, async correctness, and patterns. |
| `react-reviewer.md` | Expert React/JSX code reviewer for hook correctness, render performance, and client/server boundaries. |
| `database-reviewer.md` | PostgreSQL specialist for query optimization, schema design, security, and performance. |
| `security-reviewer.md` | Security vulnerability detection and remediation specialist (OWASP Top 10, secrets, inputs). |
| `code-reviewer.md` | General expert code reviewer for quality, structure, and maintainability. |
| `planner.md` | Expert planning specialist for mapping complex features and large-scale refactoring. |
| `architect.md` | Software architecture specialist for system design, scalability, and technical decisions. |
| `code-architect.md` | Designs feature architectures and provides detailed implementation blueprints. |
| `a11y-architect.md` | Accessibility Architect specializing in WCAG 2.2 compliance for inclusive user experience. |
| `seo-specialist.md` | Technical SEO audits, metadata review, schema markup, and performance optimization. |
| `e2e-runner.md` | End-to-end testing specialist for running and writing Playwright tests. |
| `build-error-resolver.md` | Diagnoses and resolves general build/compilation and TypeScript errors quickly. |
| `react-build-resolver.md` | Fixes React-specific compile errors, hydration mismatches, and bundler configurations. |
| `code-simplifier.md` | Refines and simplifies code for clarity and maintainability while preserving behavior. |
| `tdd-guide.md` | Test-Driven Development guide enforcing test-first coding standards. |
| `type-design-analyzer.md` | Analyzes type structures for safety, invariants, encapsulation, and type-system design. |

---

## Commands

| Command | When to use |
|---------|------------|
| `/plan` | Before starting any non-trivial feature |
| `/code-review` | Before every PR — runs typescript-reviewer + security-reviewer |
| `/build-fix` | When TypeScript, Next.js, or Prisma build fails |
| `/quality-gate` | Final check before merging |
| `/test-coverage` | Check unit + E2E coverage gaps |
| `/update-docs` | After API changes, schema changes, or new components |
| `/learn` | End of session — extract reusable patterns |
| `/skill-create` | Generate a new skill from git history |

---

## Key Conventions

### Frontend (Next.js + React + Tailwind)
- Use App Router (`app/`) — no Pages Router
- Server Components by default; `"use client"` only when needed
- Co-locate styles with components using Tailwind utility classes
- No inline styles; no CSS modules unless Tailwind is insufficient
- All props and API responses must be fully typed — no `any`

### Backend (Hono.js)
- Group routes by domain: `routes/users.ts`, `routes/posts.ts`
- Validate all inputs with Zod at the route level
- Use `HTTPException` for known errors; global `app.onError` for unknowns
- Type env variables via `c.env` — never `process.env` directly in handlers
- Keep handlers thin — business logic in a `services/` layer

### Database (PostgreSQL + Prisma)
- All schema changes go through Prisma migrations — never raw `ALTER TABLE`
- Add indexes for every foreign key and frequent query filter
- Use `select` in Prisma queries — never fetch full rows unnecessarily
- Wrap multi-step operations in transactions

### TypeScript
- Strict mode on — `"strict": true` in tsconfig
- Prefer `type` over `interface` for unions; `interface` for object shapes
- No implicit `any` — lint rule enforced
- Shared types live in `types/` at project root

### Testing
- Unit tests with Vitest — co-located as `*.test.ts`
- E2E tests with Playwright in `tests/e2e/`
- Minimum 80% unit coverage on `services/` and `lib/`
- Every new Hono route gets at least one integration test

---

## Hono-Specific Patterns

```typescript
// Route structure
const app = new Hono()
app.route('/users', usersRoute)
app.route('/posts', postsRoute)

// Input validation with Zod
const route = new Hono().post(
  '/create',
  zValidator('json', createSchema),
  async (c) => {
    const data = c.req.valid('json')  // fully typed
    return c.json(await userService.create(data))
  }
)

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Typed env
type Env = { Bindings: { DATABASE_URL: string; JWT_SECRET: string } }
const app = new Hono<Env>()
```

---

## File Structure Reference

```
project-root/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route groups
│   ├── api/                # Next.js API routes (if any)
│   └── layout.tsx
├── components/             # Shared React components
├── server/                 # Hono.js backend
│   ├── routes/             # Route files per domain
│   ├── services/           # Business logic
│   ├── middleware/         # Auth, logging, rate-limit
│   └── index.ts            # App entry, route mounting
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── types/                  # Shared TypeScript types
├── lib/                    # Shared utilities (client + server)
├── tests/
│   └── e2e/                # Playwright tests
├── .ai/                    # Unified AI agents, skills, commands, rules
├── .claude/                # Directory junction linking to .ai/ (for Claude Code)
├── GEMINI.md               # Gemini entry point instructions
└── CLAUDE.md               # Claude Code entry point instructions
```
