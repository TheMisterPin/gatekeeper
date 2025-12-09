 Gatekeeper

**Gatekeeper** is a modern visitor and contractor arrival experience built on Next.js. It centralizes your daily schedule, streamlines check-ins with built-in consent capture, and produces branded badges in a single flow.

## Why Gatekeeper
- **See everything at a glance.** Grouped schedules show each host's visitors, with live filters for name, host, and date so front-desk teams stay ahead of arrivals.
- **Guide arrivals with confidence.** Open any appointment to walk guests through mandatory data/biometric consent, capture a photo from the kiosk camera, and lock in attendance in one click.
- **Print-ready badges.** Instantly generate a badge that includes visitor details, host, date, and the captured photo—ready for self-serve printing or export.

## Product walk-through
1. **Schedule board** – The `/schedule` experience lists today's appointments, grouped by host with department and location context when available. Search, host, and date pickers help staff triage traffic fast.
2. **Arrival check-in modal** – Selecting an appointment opens an arrival modal where operators can toggle the camera, take or retake a photo, record main and biometric consent, and confirm check-in.
3. **Badge download** – After confirmation, Gatekeeper assembles a badge image with visitor, company, host, and date information using the captured headshot for an on-brand printout.

## Technology stack
- **Framework**: Next.js 16 (App Router) with TypeScript and React 19.
- **UI**: Tailwind CSS 4, Radix UI primitives, and Shadcn-inspired components.
- **Data**: Prisma ORM targeting SQL Server (configurable via `DATABASE_URL`).
- **Tooling**: ESLint, Storybook 8, and pnpm workspaces for dependency management.

## Getting started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Configure environment**
   - Create a `.env` file with at least `DATABASE_URL` pointing to your SQL Server instance (see `prisma.config.ts`).
   - Optional: add any runtime secrets required by your hosting environment.
3. **Run the app**
   ```bash
   pnpm dev
   ```
   Navigate to `http://localhost:3000` to access the login and schedule experiences.

## Core scripts
- `pnpm dev` – Start the Next.js dev server.
- `pnpm build` – Create an optimized production build.
- `pnpm start` – Serve the production build.
- `pnpm lint` – Run ESLint.
- `pnpm test` – Execute the test suite with `tsx --test`.
- `pnpm storybook` – Launch Storybook locally; `pnpm storybook:build` to generate the static bundle.

## Architecture notes
- **Stateful scheduling controller** powers filtering, host/date options, API-driven appointment loading, and groups results by host.
- **Consent-aware check-in flow** guards confirmation until mandatory consent is recorded and persists check-ins via `/api/appointments/checkin/:id`.
- **Camera + badge utilities** handle live video capture, snapshot storage, and badge image generation for visitor printouts.

## Contributing
1. Fork or branch from `main`.
2. Create focused commits with clear messages.
3. Open a PR with a short summary of changes and how to validate them locally.

---
Built to make welcoming people seamless, secure, and on-brand.