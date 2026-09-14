<!-- codex-workflow-id: viettran-edgeAI/codex_workflow -->
<!-- codex-workflow-managed-start -->
# AGENTS.md

## Design Principles

- Keep modules cohesive, interfaces explicit, coupling minimal, and behavior
  testable, replaceable, and reusable.
- Define proportionate acceptance and verification before implementation. Never
  weaken coverage, assertions, or failure visibility to save time or tokens.
- Avoid unnecessary process or safeguards; preserve unrelated user work and use
  verified facts in durable documentation.

## Working State

- `deployment state`: planning or executing a broad, possibly multi-session
  deployment plan.
- `leaf state`: otherwise, including general questions and small bounded
  operations.

## Project Documentation

Use the durable project documents under `agent_docs/`:

- `project_overview.md`: goals, architecture, workflow, and major decisions.
- `project_core_tech.md`: concise special technology or architecture notes.
- `project_structure.md`: layout, modules, components, and ownership.
- `project_progress.md`: goal, overall progress, current position, next milestone.
- `project_diary.md`: distilled decisions, discarded approaches, mistakes, and
  reusable lessons.
- `latest_session_work.md`: detailed handoff evidence and continuation point.
- Module-specific documents, when present.

In deployment state, you own `project_progress.md`, `project_diary.md`, and
`latest_session_work.md`. Before closure, directly record the current goal and
continuation state, concise lasting lessons, and the verified deployment
handoff in their canonical documents. Archivist owns other assigned project and
public documentation from verified facts, including overview, structure, core
technologies, and module documents, and performs the closing documentation and
reporting handoff. Require concise edits that remove stale or redundant detail,
assign module documents explicitly, and perform a direct user-requested
document edit yourself outside deployment.

Keep raw logs, temporary reasoning, and short-lived checkpoints out of durable
documents; give each fact one canonical home. Never delete a main project
document without warning and a second explicit confirmation.

## Route Selection

Select one of these routes: **Light** works directly in leaf state without subagents;
**Medium** keeps planning, diagnosis, implementation, and verification with the
main agent and uses bounded support from `~/.codex/codex_workflow/medium_route.md`;
**Heavy** delegates bounded production, verification, documentation,
project-context, and Internet research under `~/.codex/codex_workflow/heavy_route.md`.

Follow the user's route selection. Use Light when none is selected; do not infer
Medium or Heavy. Keep the route until the user changes it or the session ends.
Enter deployment state for Medium or Heavy only when the work is substantive.

## Rollout Efficiency

Batch independent reads, searches, metadata checks, and other known-input
operations. Keep dependencies and overlapping mutations sequential. In Medium or
Heavy, dispatch independent workers, wait for the
relevant set, and synthesize their reports once.

Read personalization and project-local instructions from the protected regions
at the end of this file. Apply them over workflow defaults subject to higher
instruction priority.

## Required Documentation Read

On the first `deployment state` entry under either Medium or Heavy, immediately
create one persistent Companion with `agent_type="companion"`,
`task_name="companion"`, and `fork_turns="none"`, or reuse the existing target.
Do this before planning, modifying files, or dispatching any other worker. Reuse
that Companion after route changes; do not create a second one.

Give its first assignment the current route, goal, relevant constraints, and a
bounded diary/module intake or other substantial context consolidation. It
retains supporting detail and returns only a task-relevant director brief.

If you have not already completed the session-level intake, directly read the
complete current `agent_docs/` framework exactly once: overview, core
technology, structure, progress, diary, latest session work, and every
module-specific Markdown document. This one direct read is shared across Medium
and Heavy. Never repeat it later in the session. Use retained context or assign
Companion a bounded diary/module intake, large synthesis, delta, or conflict
check when freshness or detailed supporting context matters. Missing or
unreadable required documents leave deployment entry incomplete; report the
intake blocker.

Do not overuse Companion. Each rollout reloads its persistent context. Combine
related questions, reuse earlier findings, and avoid status-only requests, tiny
lookups already answerable from main context, or repeated broad summaries. Use
it when one consolidated result replaces multiple main reads or tool turns,
suppresses bulky evidence, or will be reused later.

## Platform Paths

Interpret `/` as a platform-neutral separator and translate paths for the
current operating system and shell.
<!-- codex-workflow-managed-end -->

<!-- codex-workflow-project-personalization-start -->
<!-- codex-workflow-project-personalization-end -->

<!-- codex-workflow-project-local-instructions-start -->
# AGENTS.md

Instructions for AI coding agents working in this repository. Cline, VS Code agent mode, and most other tools read this file automatically. Students: read it too. These are the rules your AI partner is being held to, and they are the same rules you are graded against.

## What this project is

One student's Khmer Living Archive, built in ICT 340 at AUPP. Every student builds the same four-feature skeleton (browse and search, contributor accounts, own-your-entries, submit-review-publish) around their own collection of Khmer culture. Features arrive in three sprints. Build only what the current task asks for; do not build ahead.

## Stack facts

- Next.js 15, App Router, React 19.
- JavaScript only. No TypeScript, no .ts or .tsx files, ever.
- Plain React. No CSS frameworks, no component libraries, no state libraries.
- Styling follows the existing pattern: inline style objects (see `app/page.js`) or a plain CSS file.
- `collection.config.js` is the single source of the archive's identity (name, description, curator, source). Read from it; never hard-code those values.

## Hard rules

1. Do not add dependencies. The three in `package.json` are the whole list. If a task seems to need a package, stop and say so instead of installing it.
2. Do not touch `package.json`, `package-lock.json`, `next.config.mjs`, or `.gitignore` unless the task explicitly names them.
3. Never write an API key, token, or password into any file. This repository is public.
4. Keep diffs scoped to what was asked. If completing the task honestly requires touching another file, say which file and why before editing it.
5. One component per file in `components/`, plain function components, roughly 80 lines or less. If a component wants to be bigger, split it.
6. Khmer text is first-class content, not an edge case. Never strip, transliterate, or "fix" it. Sample data comes from the student's real entries, never lorem ipsum.

## Working style

- For anything beyond a one-file change, state a short plan before writing code.
- Explain changes plainly. The student must be able to defend every line in a code review; write code and explanations that make that possible.
- The student reviews and approves every diff. Expect rejections and make them easy: small steps, clear boundaries.
<!-- codex-workflow-project-local-instructions-end -->
