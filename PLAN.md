# Sales and Sales UI Continuation Plan

## Goal
Complete the sales settings integration end-to-end and get clean validation results for sales and sales-ui tasks.

## Current State
- Deterministic Nx command execution is stable using static output and no cache.
- `@org/sales` and `@org/sales-ui` now pass `build`, `typecheck`, and `lint`.
- Current warning-only state:
	- `@org/sales:lint` = 0 warnings
	- `@org/sales-ui:lint` = 0 warnings (reduced from 120)
- Typecheck is clean for `@org/sales-ui`.
- Nx Cloud auth warning remains non-blocking for local runs.

## Progress
- [x] 1. Stabilize task execution and collect final status
- [x] 2. Resolve build and typecheck issues first
- [x] 3. Finish sales-ui backend integration
- [x] 4. Validate lint and formatting (blocking issues only)
- [x] 5. Final verification
- [x] Optional: reduce remaining sales lint warnings outside touched paths
- [ ] Optional: decide Prisma generated-files commit policy for this branch

## Plan
1. Stabilize task execution and collect final status
- Stop relying on a hanging TUI session.
- Run a clean non-TUI command for deterministic output.
- Capture exact failed targets, if any.

2. Resolve build and typecheck issues first
- Fix sales and sales-ui compile/type errors before lint.
- Verify imports, types, generated client usage, and module boundaries.

3. Finish sales-ui backend integration
- Wire API layer and hooks to backend endpoints.
- Ensure settings pages load current values and submit updates correctly.
- Add minimal loading and error state handling where missing.

4. Validate lint and formatting
- Run lint for sales and sales-ui after typecheck passes.
- Address only relevant lint violations and avoid unrelated refactors.

5. Final verification
- Re-run targeted Nx tasks for sales and sales-ui.
- Confirm no regressions in dependent projects touched by the change.
- Summarize changed files, outcomes, and any remaining risks.

## Suggested Commands
```bash
npm exec prisma generate
npx nx run-many -t build typecheck lint -p @org/sales @org/sales-ui --outputStyle=static --nxBail --skip-nx-cache
```

## Exit Criteria
- sales and sales-ui build, typecheck, and lint pass. ✅
- Settings UI reads and updates backend data successfully. ✅
- No unresolved errors remain in touched code. ✅
