# Storybook guide

This project includes Storybook to preview and document UI components in isolation.

## Running Storybook

From the repository root:

- `pnpm storybook` — start Storybook locally at http://localhost:6006.
- `pnpm storybook:build` — generate the static build under `storybook-static/`.

> **Note:** If your environment restricts access to public registries, you may need to point npm to `https://registry.npmjs.org` in `.npmrc` before installing dependencies.

## Writing stories

1. Create a `*.stories.tsx` file next to the component (e.g., `src/components/arrival-check-in-modal.stories.tsx`).
2. Export a `Meta` definition with a descriptive `title`, `component`, and default `args` that reflect realistic props.
3. Export `StoryObj` entries for important states: empty/loaded lists, disabled/loading controls, and interaction-heavy scenarios.
4. Use `fn()` from `@storybook/test` for callback props so actions appear in the Storybook "Actions" panel.
5. Import global styles in `.storybook/preview.ts` if the component relies on Tailwind or shared CSS (already wired for `src/app/globals.css`).

## Recommended coverage

- **Lists and filters:** default view, filtered variants, and empty states so stakeholders can validate content density and sorting.
- **Modals and forms:** loading/disabled states, validation edge cases, and success states to clarify button availability.
- **Media inputs:** camera/photo placeholders versus captured content to verify layout stability.

Keep stories focused: prefer small, purposeful examples over exhaustive prop permutations. Reuse shared fixture objects across stories to keep them consistent with unit tests.
