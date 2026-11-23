# 0001 Static Next.js App Router

Accepted for local scaffolding. Starting with an empty worktree allows either framework. React + Vite offers a lean client build and supports multiple HTML entry points. Rendering React content into each HTML page would require a separate prerender setup or duplicated markup with its default client entry. Next.js App Router has more framework conventions and heavier build tooling. Static export generates route HTML and metadata at build time, supports direct links and lets reading content work before enhancement.

Use Next.js static export, directory index output and canonical routes proposed as `/about/`, `/projects/`, `/projects/<slug>/`, `/resume/` and `/contact/`. The desktop can open the same content in a window. Build known slugs from reviewed source and use the canonical URL when sharing. Keep the desktop state ephemeral and keep normal navigation and Back/Forward available. Phase 0 builds only the neutral homepage and framework 404. A framework change requires a written tradeoff.

Use Node 22.23.5 and npm 10.9.2. Next.js 16.4.6 declares Node >=20.9.0. Use Node's built-in test runner for export checks. Adopt Playwright for browser checks when UI work starts. Evaluate Vitest and React Testing Library for fast reducer and DOM behavior checks when those components exist. No browser test dependency is needed for the artifact checks.

Sources [Next static export](https://nextjs.org/docs/app/guides/static-exports), [Vite build](https://vite.dev/guide/build) and [Playwright accessibility](https://playwright.dev/docs/accessibility-testing).
