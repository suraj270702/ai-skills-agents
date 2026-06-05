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

Use the following skills when working on related files:

| File(s) / Context | Skill to load |
|-------------------|---------------|
| `*.tsx`, `*.jsx`, `components/**`, `app/**` | `.claude/skills/frontend-patterns/` |
| `*.ts` anywhere | `.claude/skills/coding-standards/typescript` |
| `app/api/**`, `server/**`, Hono routes | `.claude/skills/backend-patterns/`, `.claude/skills/api-design/`, `.claude/skills/hono-patterns/` |
| `*.sql`, `prisma/schema.prisma`, migrations | `.claude/skills/postgres-patterns/`, `.claude/skills/database-migrations/` |
| `tests/e2e/**`, `*.spec.ts` (Playwright) | `.claude/skills/e2e-testing/` |
| `Dockerfile`, `docker-compose.yml`, `.github/workflows/**` | `.claude/skills/docker-patterns/`, `.claude/skills/deployment-patterns/` |
| Any new feature from scratch | `.claude/skills/tdd-workflow/` |
| Security audit or auth-related code | `.claude/skills/security-review/` |
| Any iterative/agentic task | `.claude/skills/verification-loop/` |

When spawning subagents, always pass conventions from the respective skill into the agent's prompt.

---

## Agents

Delegate to these subagents for focused tasks:

| Task | Agent |
|------|-------|
| TypeScript / React / Hono code review | `.claude/agents/typescript-reviewer.md` |
| PostgreSQL schema, query, index review | `.claude/agents/database-reviewer.md` |
| Security vulnerabilities, auth, input validation | `.claude/agents/security-reviewer.md` |
| General quality, readability, patterns | `.claude/agents/code-reviewer.md` |
| Feature breakdown and implementation plan | `.claude/agents/planner.md` |
| Architect system design decisions | `.claude/agents/architect.md` |
| Run and debug Playwright E2E tests | `.claude/agents/e2e-runner.md` |
| Fix build or type errors | `.claude/agents/build-error-resolver.md` |
| Remove dead code, improve structure | `.claude/agents/refactor-cleaner.md` |
| Sync README, JSDoc, API docs | `.claude/agents/doc-updater.md` |
| Autonomous loop execution | `.claude/agents/loop-operator.md` |

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
├── .claude/                # ECC agents, skills, commands
└── CLAUDE.md
```
