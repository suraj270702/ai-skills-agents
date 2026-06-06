---
description: Start the Autonomous Backend Feature Pipeline sequence to build an API, Database, or Service feature
---

When the user types `/backend-feature <backend_feature_description>`, orchestrate the development process strictly using the custom agents, skills, and rules defined in [agents.md](../agents.md).

### Execution Sequence:

1. **Act as the Product Manager (@pm), Planner (@planner), & Architect (@architect)**:
   - **Role**: Analyze database schema requirements, API endpoint routes, cache patterns, and server permissions.
   - **Action**: Draft the backend specification inside `production_artifacts/Technical_Specification.md`. Include database entity relationships, HTTP endpoints request/response schemas, caching models, and security requirements.
   - **Rules & Skills**: Load [api-design](../../.ai/skills/api-design/SKILL.md) and [best-practices](../../.ai/skills/best-practices/SKILL.md). Check [development-workflow.md](../../.ai/rules/common/development-workflow.md).
   - **Gate**: Pause and wait for explicit user approval. Re-run specification generation if user adds inline comments or provides chat feedback. Do not proceed until user explicitly approves.

2. **Shift context, act as the Code Architect (@code-architect) & Type Design Analyzer (@type-design-analyzer)**:
   - **Role**: Blueprint database structure, migrations, model relations, and interfaces.
   - **Action**: Outline the list of migrations files, controller structures, model interfaces, data-flow diagrams, and schema layouts, auditing type boundaries for domain safety.
   - **Rules & Skills**: Check [typescript/patterns.md](../../.ai/rules/typescript/patterns.md) and [common/patterns.md](../../.ai/rules/common/patterns.md). Load [postgres-patterns](../../.ai/skills/postgres-patterns/SKILL.md).

3. **Shift context, act as the TDD Guide (@tdd-guide)**:
   - **Role**: Enforce test-first programming for backend endpoints.
   - **Action**: Write failing integration tests verifying API endpoint routing, middleware authorization, error handling, status codes, and DB operations.
   - **Rules & Skills**: Check [testing.md](../../.ai/rules/common/testing.md) and [typescript/testing.md](../../.ai/rules/typescript/testing.md). Load [tdd-workflow](../../.ai/skills/tdd-workflow/SKILL.md).

4. **Shift context, act as the Full-Stack Developer (@engineer)**:
   - **Role**: Write clean, secure, and performant backend code.
   - **Action**: Implement physical migration scripts, models, controllers, routers, and caching logic (e.g. Redis). Save files to the workspace. Ensure all files compile cleanly. If typescript build or DB connection failures occur, act as [build-error-resolver](../../.ai/agents/build-error-resolver.md) to diagnose and fix.
   - **Rules & Skills**: Check [coding-style.md](../../.ai/rules/common/coding-style.md) and [typescript/coding-style.md](../../.ai/rules/typescript/coding-style.md). Load [backend-patterns](../../.ai/skills/backend-patterns/SKILL.md) and [redis-patterns](../../.ai/skills/redis-patterns/SKILL.md). Run tests until they pass.

5. **Shift context, act as the Security Reviewer (@security-reviewer)**:
   - **Role**: Perform threat modeling and secure API data input.
   - **Action**: Audit input validation schemas, check for SQL injection vectors, evaluate authentication policies, prevent secret exposures, and implement rate limits.
   - **Rules & Skills**: Check [security.md](../../.ai/rules/common/security.md) and [typescript/security.md](../../.ai/rules/typescript/security.md). Load [security-review](../../.ai/skills/security-review/SKILL.md).

6. **Shift context, act as the Database Reviewer (@database-reviewer)**:
   - **Role**: Audit database migration safety and query efficiency.
   - **Action**: Run query optimizations (`EXPLAIN` analysis), check for non-blocking index additions, verify table locks, and review transactional rollbacks.
   - **Rules & Skills**: Check [performance.md](../../.ai/rules/common/performance.md). Load [database-migrations](../../.ai/skills/database-migrations/SKILL.md).

7. **Shift context, act as the E2E Runner (@e2e-runner)**:
   - **Role**: Run integrated E2E verification loop.
   - **Action**: Execute backend route test scripts, verify Redis key state cycles, and compile E2E walkthrough results.
   - **Rules & Skills**: Check [testing.md](../../.ai/rules/common/testing.md). Load [verification-loop](../../.ai/skills/verification-loop/SKILL.md).

8. **Shift context, act as the Code Reviewer (@code-reviewer), TypeScript Reviewer (@typescript-reviewer), & Code Simplifier (@code-simplifier)**:
   - **Role**: Clean up code complexity.
   - **Action**: Refactor backend layers for simple maintainability, extract shared helpers, simplify database query layouts, clean up log outputs, check code formatting, and ensure the test suite is green.
   - **Rules & Skills**: Load [best-practices](../../.ai/skills/best-practices/SKILL.md) and check [coding-style.md](../../.ai/rules/common/coding-style.md).
