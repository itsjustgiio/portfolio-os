# Giovanni OS

Giovanni OS is a browser-based portfolio with a Luna-inspired XP desktop and accessible reading pages. The Phase 1 slice includes working application windows and five simulated portfolio servers.

[Desktop](docs/screenshots/xp-desktop-1366x768.png) · [Start menu](docs/screenshots/xp-start-menu-1366x768.png) · [Mobile](docs/screenshots/xp-mobile-390x844.png)

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

The build writes a static site to `out/`. Tests cover the export and window manager. Browser tests exercise the static build using a temporary loopback server. With Google Chrome installed, run:

```powershell
$env:DESKTOP_BROWSER = "chrome"
npm.cmd run test:browser
```

To use Playwright Chromium, run `npm exec -- playwright install chromium` and leave `DESKTOP_BROWSER` unset. Set `DESKTOP_SCREENSHOTS=1` to regenerate the reference screenshots. Window titles accept arrow keys to move and Shift with arrow keys to resize. The taskbar Portfolio link opens the static reading pages.

The meadow wallpaper in `public/artwork/green-meadow.webp` was created and supplied by Giovanni Carrion. The shell icons and Luna-inspired chrome are original CSS in `src/desktop`. The topology uses an original generated tower illustration in `public/artwork/topology-server-tower.webp`. The [Windows Icon Archive](https://limehawk.github.io/windows-icon-archive/) catalogs extracted system graphics and served as a visual reference. The export contains public content only. Keep credentials and private source material outside the repository.

## Project notes

- [Architecture](ARCHITECTURE.md) and [decisions](docs/decisions/)
- [Security](SECURITY.md) and [content approvals](CONTENT_INVENTORY.md)
- [Product requirements](docs/product-requirements.md) and [roadmap](TODO.md)
- [Repository setup and workflow](docs/repository-setup.md)
