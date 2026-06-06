---
description: Start the Autonomous Frontend Feature Pipeline sequence to build a UI feature
---

When the user types `/frontend-feature <ui_feature_description>`, orchestrate the development process strictly using the custom agents, skills, and rules defined in [agents.md](../agents.md).

### Execution Sequence:

1. **Act as the Product Manager (@pm), Planner (@planner), & Architect (@architect)**:
   - **Role**: Analyze the user's frontend feature requirements, layout designs, and routes.
   - **Action**: Draft the UI specification inside `production_artifacts/Technical_Specification.md`. Include executive summary, functional requirements, component structures, styling, state management, accessibility parameters, and SEO specifications.
   - **Rules & Skills**: Load [best-practices](../../.ai/skills/best-practices/SKILL.md) and [coding-standards](../../.ai/skills/coding-standards/SKILL.md). Check [development-workflow.md](../../.ai/rules/common/development-workflow.md) and [patterns.md](../../.ai/rules/common/patterns.md).
   - **Gate**: Pause and wait for explicit user approval. Re-run specification generation if user adds inline comments or provides chat feedback. Do not proceed until user explicitly approves.

2. **Shift context, act as the Code Architect (@code-architect) & Type Design Analyzer (@type-design-analyzer)**:
   - **Role**: Define code directories, component structures, props interfaces, and client state boundaries.
   - **Action**: Outline component files list, React component props types, state providers, and page layouts, auditing type boundaries for domain safety.
   - **Rules & Skills**: Check [typescript/patterns.md](../../.ai/rules/typescript/patterns.md) and [common/patterns.md](../../.ai/rules/common/patterns.md). Load [frontend-design-direction](../../.ai/skills/frontend-design-direction/SKILL.md).

3. **Shift context, act as the TDD Guide (@tdd-guide)**:
   - **Role**: Enforce write-tests-first development to ensure 80%+ test coverage.
   - **Action**: Create test files and write failing unit/integration tests for components, helper hooks, and state providers using Vitest and React Testing Library.
   - **Rules & Skills**: Check [testing.md](../../.ai/rules/common/testing.md) and [typescript/testing.md](../../.ai/rules/typescript/testing.md). Load [tdd-workflow](../../.ai/skills/tdd-workflow/SKILL.md) and [react-testing](../../.ai/skills/react-testing/SKILL.md).

4. **Shift context, act as the Full-Stack Developer (@engineer)**:
   - **Role**: Translate the specifications and blueprints into clean, DRY frontend code.
   - **Action**: Write code for page views, UI components, state contexts, custom hooks, and styling (using Tailwind CSS). Save all files into the codebase. Ensure the code builds cleanly. If typescript or React compile errors occur, act as [build-error-resolver](../../.ai/agents/build-error-resolver.md) or [react-build-resolver](../../.ai/agents/react-build-resolver.md) to fix them.
   - **Rules & Skills**: Check [coding-style.md](../../.ai/rules/common/coding-style.md) and [typescript/coding-style.md](../../.ai/rules/typescript/coding-style.md). Load [frontend-patterns](../../.ai/skills/frontend-patterns/SKILL.md) and [react-patterns](../../.ai/skills/react-patterns/SKILL.md). Run tests until they pass.

5. **Shift context, act as the Accessibility Architect (@a11y-architect) & SEO Specialist (@seo-specialist)**:
   - **Role**: Ensure WCAG compliance and optimal search ranking.
   - **Action**: Audit component markup for semantic HTML, focus outlines, ARIA roles, and screen-reader accessibility. Review page metadata, title tags, canonical URLs, and structured data layouts.
   - **Rules & Skills**: Load [accessibility](../../.ai/skills/accessibility/SKILL.md), [frontend-a11y](../../.ai/skills/frontend-a11y/SKILL.md), and [seo](../../.ai/skills/seo/SKILL.md).

6. **Shift context, act as the React Reviewer (@react-reviewer) & SEO Specialist (@seo-specialist)**:
   - **Role**: Measure performance, eliminate re-renders, and optimize Web Vitals metrics.
   - **Action**: Analyze Core Web Vitals targets:
     - **Largest Contentful Paint (LCP)**: Optimize image sizing, asset loading, and server rendering.
     - **Cumulative Layout Shift (CLS)**: Ensure proper aspect ratios, dimension containers, and fonts layout.
     - **Interaction to Next Paint (INP)**: Eliminate execution blocks, leverage debouncing/throttling, and optimize event listeners response.
     - **First Input Delay (FID)**: Check main-thread activity.
   - **Rules & Skills**: Check [performance.md](../../.ai/rules/common/performance.md) and [common/hooks.md](../../.ai/rules/common/hooks.md). Load [core-web-vitals](../../.ai/skills/core-web-vitals/SKILL.md), [performance](../../.ai/skills/performance/SKILL.md), [web-audit](../../.ai/skills/web-audit/SKILL.md), and [react-performance](../../.ai/skills/react-performance/SKILL.md).

7. **Shift context, act as the E2E Runner (@e2e-runner)**:
   - **Role**: Run functional E2E validation.
   - **Action**: Write and run Playwright E2E integration test suites for core user flows. Compile results.
   - **Rules & Skills**: Check [testing.md](../../.ai/rules/common/testing.md). Load [e2e-testing](../../.ai/skills/e2e-testing/SKILL.md) and [verification-loop](../../.ai/skills/verification-loop/SKILL.md).

8. **Shift context, act as the Code Reviewer (@code-reviewer), TypeScript Reviewer (@typescript-reviewer), & Code Simplifier (@code-simplifier)**:
   - **Role**: Clean up code complexity.
   - **Action**: Refactor complex hooks/render loops, clean up variables, check styling tokens, perform a final review of the clean code architecture, and ensure all unit/E2E test suites remain green.
   - **Rules & Skills**: Load [best-practices](../../.ai/skills/best-practices/SKILL.md) and check [coding-style.md](../../.ai/rules/common/coding-style.md).
