# Giovanni OS

Giovanni OS is a browser-based portfolio planned around an XP-inspired desktop and accessible reading pages. The Phase 0 scaffold provides a neutral homepage.

**Screenshot placeholder** — Add an approved desktop screenshot when the first shell is implemented.

## Setup and usage

Use Node from `.nvmrc` and npm 10.9.2.

```sh
npm ci --ignore-scripts
npm run dev
```

Open http://127.0.0.1:3000. Set `NEXT_TELEMETRY_DISABLED=1` in your shell to match CI. Run the same checks as CI before opening a pull request.

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
npm test
```

The build writes a static site to `out/`. The tests inspect its HTML and require a build first.

The export contains public content only. Keep credentials and private source material outside the repository. See the security notes for review and hosting requirements.

## Project notes

- [Architecture](ARCHITECTURE.md) and [decisions](docs/decisions/)
- [Security](SECURITY.md) and [content approvals](CONTENT_INVENTORY.md)
- [Product requirements](docs/product-requirements.md) and [roadmap](TODO.md)
- [Repository setup and workflow](docs/repository-setup.md)
