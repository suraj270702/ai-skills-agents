const fs = require('fs');
const path = require('path');
const os = require('os');

function log(message) {
  console.log(`[AI Setup] ${message}`);
}

function logError(message, err) {
  console.error(`[AI Setup] ERROR: ${message}`, err || '');
}

// 1. Move/Rename sanity check (in case user runs it directly)
const aiDir = path.resolve(__dirname, '.ai');
const claudeDir = path.resolve(__dirname, '.claude');

if (!fs.existsSync(aiDir)) {
  if (fs.existsSync(claudeDir) && !fs.lstatSync(claudeDir).isSymbolicLink()) {
    log('Moving .claude to .ai...');
    fs.renameSync(claudeDir, aiDir);
  } else {
    fs.mkdirSync(aiDir, { recursive: true });
    log('Created .ai directory.');
  }
}

// 2. Setup Claude link
try {
  if (fs.existsSync(claudeDir)) {
    const stat = fs.lstatSync(claudeDir);
    if (stat.isSymbolicLink() || stat.isDirectory()) {
      log('Removing existing .claude directory/link...');
      fs.rmSync(claudeDir, { recursive: true, force: true });
    }
  }
  const type = os.platform() === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(aiDir, claudeDir, type);
  log(`Created Claude link: .claude -> .ai (${type})`);
} catch (err) {
  logError('Failed to create .claude link. You may need to run this command in a terminal with appropriate permissions, or run as administrator on Windows.', err);
}

// 3. Setup Workflows
const workflowsSrcDir = path.join(aiDir, 'workflows');
const workflowsDestDir = path.resolve(__dirname, '.agents', 'workflows');

try {
  // If old location exists but new one doesn't, migrate files
  const oldWorkflowsDir = path.resolve(__dirname, '.agents', 'workflows');
  if (fs.existsSync(oldWorkflowsDir) && !fs.existsSync(workflowsSrcDir)) {
    log('Migrating workflows from .agents/workflows to .ai/workflows...');
    fs.mkdirSync(workflowsSrcDir, { recursive: true });
    const files = fs.readdirSync(oldWorkflowsDir);
    files.forEach(file => {
      const src = path.join(oldWorkflowsDir, file);
      const dest = path.join(workflowsSrcDir, file);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
      }
    });
  } else {
    // Ensure new location exists
    fs.mkdirSync(workflowsSrcDir, { recursive: true });
  }

  // Ensure dest location (.agents/workflows) exists and copy files from .ai/workflows back to it
  if (fs.existsSync(workflowsDestDir)) {
    fs.rmSync(workflowsDestDir, { recursive: true, force: true });
  }
  fs.mkdirSync(workflowsDestDir, { recursive: true });
  
  if (fs.existsSync(workflowsSrcDir)) {
    const files = fs.readdirSync(workflowsSrcDir);
    files.forEach(file => {
      const src = path.join(workflowsSrcDir, file);
      const dest = path.join(workflowsDestDir, file);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
      }
    });
    log('Synchronized workflows from .ai/workflows to .agents/workflows.');
  }
} catch (err) {
  logError('Failed to set up workflows.', err);
}

// 4. Setup Cursor Rules
const cursorRulesDir = path.resolve(__dirname, '.cursor', 'rules');
try {
  if (fs.existsSync(cursorRulesDir)) {
    fs.rmSync(cursorRulesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(cursorRulesDir, { recursive: true });
  log('Created .cursor/rules directory.');

  const rulesSrcDir = path.join(aiDir, 'rules');
  
  const getFiles = (dir) => {
    if (!fs.existsSync(dir)) return [];
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(filePath));
      } else if (file.endsWith('.md')) {
        results.push(filePath);
      }
    });
    return results;
  };

  const rulesFiles = getFiles(rulesSrcDir).map(file => ({ file, srcDir: rulesSrcDir }));
  const workflowsFiles = getFiles(workflowsSrcDir).map(file => ({ file, srcDir: workflowsSrcDir }));
  const files = [...rulesFiles, ...workflowsFiles];

  files.forEach(({ file, srcDir }) => {
    const relPath = path.relative(srcDir, file);
    // Flatten the path structure: replace separators with dashes
    const name = relPath.replace(/[\\/]/g, '-').replace(/\.md$/, '');
    const content = fs.readFileSync(file, 'utf8');

    let globs = '*';
    let description = `${name.replace(/-/g, ' ')} rules`;
    let fileBody = content;
    let frontmatter = {};

    if (content.trim().startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        const fmText = parts[1];
        fileBody = parts.slice(2).join('---').trim();
        
        fmText.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) return;
          
          if (trimmed.startsWith('-') && frontmatter.paths) {
            const val = trimmed.substring(1).trim().replace(/['"]/g, '');
            frontmatter.paths.push(val);
            return;
          }

          const colonIndex = trimmed.indexOf(':');
          if (colonIndex > 0) {
            const key = trimmed.substring(0, colonIndex).trim();
            let val = trimmed.substring(colonIndex + 1).trim();
            if (val === '' || val === '[]' || val === '-') {
              frontmatter[key] = [];
            } else {
              frontmatter[key] = val.replace(/['"]/g, '');
            }
          }
        });
      }
    }

    if (frontmatter.globs) {
      globs = frontmatter.globs;
    } else if (frontmatter.paths) {
      if (Array.isArray(frontmatter.paths)) {
        globs = frontmatter.paths.map(p => p.replace(/^\*\*?\//, '')).join(', ');
      } else {
        globs = frontmatter.paths.replace(/^\*\*?\//, '');
      }
    } else {
      if (relPath.includes('typescript')) {
        globs = '*.ts, *.tsx, *.js, *.jsx, tsconfig.json';
      }
    }

    if (frontmatter.description) {
      description = frontmatter.description;
    } else {
      const matchHeading = fileBody.match(/^#\s+(.+)$/m);
      if (matchHeading) {
        description = matchHeading[1].trim();
      }
    }

    const finalContent = `---
description: ${description}
globs: ${globs}
---
${fileBody}`;

    const destPath = path.join(cursorRulesDir, `${name}.mdc`);
    fs.writeFileSync(destPath, finalContent, 'utf8');
    log(`Generated Cursor Rule: .cursor/rules/${name}.mdc`);
  });
} catch (err) {
  logError('Failed to set up Cursor rules.', err);
}

// 5. Ensure CLAUDE.md, GEMINI.md, and .cursorrules exist
const claudeMdPath = path.resolve(__dirname, 'CLAUDE.md');
const geminiMdPath = path.resolve(__dirname, 'GEMINI.md');
const cursorrulesPath = path.resolve(__dirname, '.cursorrules');

const baseInstructions = `# Developer Assistant Instructions (CLAUDE.md / GEMINI.md / .cursorrules)

This repository uses a unified AI configuration located in the \`.ai/\` directory.
- Rules: \`.ai/rules/\` (compiled to \`.cursor/rules/\` for Cursor)
- Skills: \`.ai/skills/\`
- Custom Agents: \`.ai/agents/\`
- Custom Commands: \`.ai/commands/\`
- Workflows: \`.ai/workflows/\` (compiled to \`.cursor/rules/\` for Cursor, and linked to \`.agents/workflows/\` for Antigravity)

## Commands and Workflow

To build, test, and check code quality, please refer to the stack documentation:
[CLAUDE-STACK.md](file:///CLAUDE-STACK.md)

For specific instructions:
- **Claude Code users**: The \`.claude/\` folder is linked directly to \`.ai/\`.
- **Cursor users**: Automated rules are compiled under \`.cursor/rules/\` with globs.
- **Gemini / Codex users**: Read rules under \`.ai/rules/\` and refer to stack documentation.

---

## Custom Agents (\`.ai/agents/\`)

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

## Skills (\`.ai/skills/\`)

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
`;
try {
  fs.writeFileSync(claudeMdPath, baseInstructions, 'utf8');
  log('Created/updated CLAUDE.md');
  
  fs.writeFileSync(geminiMdPath, baseInstructions, 'utf8');
  log('Created/updated GEMINI.md');

  fs.writeFileSync(cursorrulesPath, baseInstructions, 'utf8');
  log('Created/updated .cursorrules');
} catch (err) {
  logError('Failed to write top-level markdown instruction files.', err);
}

log('AI Configuration Setup Complete!');
