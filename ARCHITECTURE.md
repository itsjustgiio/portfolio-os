# Architecture

Next.js App Router exports static HTML from `src/app` at build time. The export includes the XP desktop, ordinary reading pages, five statically generated project category routes and a shared 404. There are no API endpoints, runtime integrations, project environment secrets, analytics services or external assets.

The desktop and reading pages share local content in `src/portfolio`. The framework-independent window reducer and typed application registry in `src/desktop` own app identity, stacking, state and geometry. The Luna CSS module and React pointer adapter render the desktop. Only the first-visit Welcome flag persists in browser storage.

My Network Places connects a simulated core to five portfolio servers. The typed portfolio data supplies labels and TEST-NET-1 documentation addresses. The diagram and list share the app registry and open portfolio folders through the window manager. A future terminal would use deterministic local fixtures. See the [decision records](docs/decisions/) for routes, rendering, styling and dependencies. The provider and response header policy are pending hosting discovery.
