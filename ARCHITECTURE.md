# Architecture

Next.js App Router exports static HTML from `src/app` at build time. The foundation has one route and the framework's 404. There are no API endpoints, runtime integrations, project environment secrets, analytics services or external assets.

Later phases will add canonical reading routes and one set of reviewed portfolio records. Desktop views will consume the same content and share a reducer-based window model. Theme components and their CSS will live under individual theme roots. The browser receives public content only. Topology content will be conceptual and any future terminal will resolve deterministic fixtures locally.

See the [decision records](docs/decisions/) for routes, rendering, styling and dependencies. The provider and response header policy are pending hosting discovery.
