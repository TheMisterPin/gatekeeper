# Testing guide

This project uses the native [`node:test`](https://nodejs.org/api/test.html) runner, executed through [`tsx`](https://tsx.is/), to avoid extra dependencies while still keeping the suite fast and type-safe. The tests focus on two layers:

- **Unit and interaction tests**: Render individual components as React elements and assert their props, disabled states, and the text they surface.
- **Flow coverage (pseudo-e2e)**: Exercises high-level UI flows by rendering full components with realistic props to ensure the wiring between controls, labels, and actions stays intact.

## What to test

- **Rendering contracts**: Empty states, required labels, and accessibility-critical text (e.g., consent messages, appointment summaries).
- **State-driven UI changes**: Disabled/enabled actions based on consent flags, captured images, or loading states.
- **Event wiring**: Ensure callbacks receive the right identifiers when buttons are triggered.
- **Data ordering and grouping**: Host grouping and chronological sorting for appointments.

## Writing new tests

1. Add new test files under `tests/unit/` using the `node:test` API (`describe`, `it`, and `mock`).
2. Import components directly from `@/components/...`; `tsx --test` honors the TypeScript path aliases.
3. Use the helpers in `tests/helpers/reactTree.ts` to traverse the React element tree:
   - `extractTextContent(node)` to grab visible text.
   - `findElementsByType(node, 'button')` to locate elements that carry handlers or disabled flags.
   - `findButtonByLabel(node, 'Label')` to target a specific action by its text.
4. Prefer passing explicit props to represent different states instead of mutating the rendered tree—this keeps tests deterministic and reusable.

## Running the suite

From the repository root:

- `pnpm test` — run all tests once.
- `pnpm test -- --watch` — rerun on file changes.

Because the runner relies only on local dependencies, the suite works in offline CI environments. If you need browser-level end-to-end coverage, start the Next.js dev server (`pnpm dev`) and integrate a browser runner such as Playwright; add those tests under `tests/e2e/` and gate them behind a separate script (for example, `pnpm test:e2e`).
