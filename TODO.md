# Giovanni OS — Master Task List (TODO.md)

**Status:** Official development checklist for Giovanni OS. The GitHub repository is newly created and empty.  
**Research date:** 2026-11-22 (America/New_York).  
**Scope:** A browser-based, interactive portfolio with Windows XP as its default desktop, optional Kali Linux and Mac OS X Tiger interfaces, and shared IT, Cybersecurity, AI, Professional, and Personal content.

## How to use this document

- Keep this file as `TODO.md` in the repository, updating checkboxes only after verification. Store architectural decisions in `docs/decisions/`.
- `[ ]` means **not completed**. Mark `[x]` only after implementation and verification; the repository starts empty.
- Every phase ends with **exit criteria**. Don't merge a phase just because the page looks right.
- This file is the project roadmap and task tracker. Specific dependency and hosting choices must be documented before implementation; do not guess configuration values.
- Do not build all three OS themes at once. Ship a functional XP-only vertical slice before extending the underlying desktop shell.

## Research distilled into project decisions

1. **A real desktop simulation has a lot of hidden state.** A Windows XP portfolio creator on r/webdev reported that window-opening pathways, gradients, metadata, and content took substantial time; build window/state logic before adding visual flourishes. https://www.reddit.com/r/webdev/comments/1gi1c3v/
2. **The portfolio still needs standard navigation.** A Kali-inspired portfolio explicitly serves crawlable content and direct résumé/contact links before the desktop shell mounts. https://github.com/Sammieblz/my-portfolio-site
3. **Don't reinvent every interaction.** SharpXP uses `react-rnd` for dragging/resizing, Zustand for stores, and XP.css as a styling reference. Evaluate package health, compatibility and licensing before adopting any of these. https://github.com/asharpie/SharpXP
4. **Accessibility must be architectural.** A retro React portfolio shares its approach to keyboard-accessible windows and semantic HTML on r/reactjs. https://www.reddit.com/r/reactjs/comments/1qugnwy/
5. **No fictional accomplishments.** DhirajOS documents projects from source evidence and distinguishes real deployments from demos and experiments. Build a content provenance field and verified status labels. https://github.com/uppadadhiraj/dhiraj-os
6. **Simulate terminals and scans.** The Kali-style portfolio above uses a safe virtual filesystem and terminal that never executes host/server commands.
7. **Start without a backend.** Next.js supports starting with static content and adding server features only if justified. https://nextjs.org/docs/app/getting-started/deploying
8. **Protect at the output boundaries.** OWASP recommends safe text rendering and treats CSP as defense in depth, not the primary XSS prevention mechanism. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

## Initial project decisions and setup tasks

- [ ] **Repository connection:** The repository is new and empty. Record its URL, clone it locally, verify remote, default branch, Git status and GitHub permissions before scaffolding.
- [ ] **Project identity:** Confirm repo name, package name, site title, logo, public domain, and whether the existing website is deployed through Vercel, Cloudflare, GitHub Pages, another host, or a custom server.
- [ ] **Workstation:** Check Node and package-manager versions, OS/shell, installed Codex workflow, Git remote/auth, and whether the repo is locally cloned. Prefer lockfile-based reproducibility.
- [ ] **Hosting constraints:** Identify static export vs server deployment, preview URL mechanism, DNS ownership, HTTPS, custom headers and cache behavior before selecting routing/CSP configuration.
- [ ] **Visual fidelity:** Determine Windows XP inspiration vs pixel-perfect replica, legally sourced wallpaper/icons/fonts/sounds, and whether original artwork will be created instead.
- [ ] **Mac meaning:** Confirm Mac OS X Tiger 10.4 ('Aqua' era) rather than classic Mac OS 9. Current plan assumes Tiger only as a proposal.
- [ ] **Kali meaning:** Confirm preferred visual generation (e.g., XFCE contemporary Kali versus historical Kali). Screenshot reference is not a source of freely licensed UI assets.
- [ ] **Mobile baseline:** Decide minimal supported width, whether windows become full-screen mobile panels, and whether OS switching is available on mobile. Proposed: launcher/panels, not freeform dragging.
- [ ] **Privacy/content approvals:** Confirm exact full name, graduation date, GPA inclusion/omission, approved photos, public contact information, and which experiences may be published. Don't copy private lab diagrams, teammate details or sensitive screens.
- [x] **App list:** Approve which OS-specific apps are genuinely needed; defer toys, audio, login screens, games, and third-party widgets until MVP works.
- [ ] **Resume strategy:** Identify authoritative PDF file, update workflow, and whether professional info is mirrored as crawlable HTML.
- [ ] **Analytics/contact:** Confirm whether to use analytics (default none) and whether contact is a mailto link (preferred for MVP) or a form requiring anti-abuse controls.

## Definition of MVP

Owner-approved shell scope and wireframe decisions (2026-11-23) specify Windows XP Luna by default, direct entry to the desktop, first-visit Welcome, a taskbar OS selector, Start menu, draggable windows and a simplified mobile layout. Desktop shortcuts are My Computer, My Network Places, My Documents, Resume and Recycle Bin. The MVP includes five simulated portfolio servers and uses original or appropriately licensed assets. Kali Linux and Mac OS X are deferred to later phases.

A visitor can open the site, immediately recognize the Windows XP-inspired desktop, open the Start menu and windowed apps, browse the five portfolio areas, explore a clearly *simulated* topology, open a project case study, and access a current résumé and contact link on desktop and mobile. Nothing requires using the terminal; no real scanning, authentication, persistent uploads, or external service access is necessary.

---

## Phase 0 — Discovery, scope, design references, and repository safety

### 0A. Connect and initialize the empty repository
- [ ] Record Git remote, default branch, and `git status`; confirm there are no preexisting project files or uncommitted changes before scaffolding.
- [x] Verify whether GitHub created a README, LICENSE or `.gitignore`; inspect any present files before scaffolding the application.
- [x] Start with no integrations, API endpoints, environment secrets, or unnecessary dependencies; document each one only if introduced.
- [ ] Confirm the newly created empty repository is cloned and the expected Git remote is configured.
- [x] After scaffolding, document the actual install, development, build and test commands from `package.json`.
- [x] Check whether a copyright license exists and whether third-party code/assets need attribution.
- [x] Create `docs/repository-setup.md` describing repository initialization, tooling versions and development workflow.

### 0B. Product specification
- [x] Create `docs/product-requirements.md` with target visitors: recruiters, other engineers, friends, and the owner.
- [x] Define top visitor actions: view résumé, inspect infrastructure, read competition case study, contact, and switch OS.
- [x] Draw XP homepage wireframe with icon placement, Start menu, taskbar, and default open window (if any).
- [x] Draft screens for Kali and Tiger separately without implementing them.
- [x] Write interaction matrix for icon single-click, double-click, touch tap, keyboard Enter, Escape, Start menu, and window buttons.
- [x] Specify loading behavior and a no-JavaScript/low-motion fallback.
- [x] Define success criteria: no dead-end navigation, no broken external links, core content accessible without drag or terminal.
- [x] Define postponed features and explicitly mark them out of scope for MVP.

### 0C. Technical decisions (ADRs)
- [x] Evaluate **Next.js App Router** vs **React + Vite** against SEO, hosting, public routes, complexity, and current repo scaffolding. No framework change without a written tradeoff.
- [x] Decide whether each app gets a canonical `/about`, `/projects/...`, `/resume` shareable URL as well as an in-desktop window.
- [x] Evaluate **react-rnd** versus custom pointer/keyboard window management; test touch behavior, z-order and license.
- [x] Evaluate **React Flow** for the topology; inspect keyboard support and whether a static SVG/list fallback is simpler.
- [x] Evaluate **XP.css** only after checking compatibility, appearance, stylesheet scope, and license. Avoid accidentally applying XP styles to Kali/Mac.
- [x] Decide app/window state approach: plain React context/reducer first vs Zustand if complexity warrants it.
- [x] Evaluate Tailwind and component-scoped CSS for the three conflicting OS themes.
- [x] Choose unit test and browser test runners based on actual stack; suggested Vitest/React Testing Library and Playwright if compatible.
- [x] Record decisions and reasons in `docs/decisions/0001-*.md` etc.

### 0D. Repo foundations and hygiene
- [x] Create or update README with purpose, screenshot placeholder, setup, usage, architecture, and security notes.
- [x] Create `TODO.md`, `ARCHITECTURE.md`, `SECURITY.md`, `CONTENT_INVENTORY.md`, `CHANGELOG.md`, `.env.example` **only if environment variables are actually needed**.
- [x] Make `.gitignore` cover `.env*` except `.env.example`, build artifacts, coverage, OS temp files, local caches, and editor secrets.
- [x] Use one supported Node runtime version in `.nvmrc`/`.node-version`/engines after verifying tooling needs.
- [x] Configure TypeScript strict mode, formatting, linting, import alias and consistent filenames.
- [x] Pin versions through lockfile; use clean installs in CI.
- [x] Add GitHub CI workflow with type-check, lint, tests, and production build; verify it succeeds on a test PR.
- [ ] Enable Dependabot alerts and appropriate updates; verify functionality in repo settings.
- [ ] Configure branch protection/rulesets **only if permitted by actual account/repo plan**, otherwise document manual review rules.
- [x] Establish branch naming `feat/*`, `fix/*`, `docs/*`, and PR checklist with screenshots and test evidence.
- [ ] Check GitHub token/credential permissions for local Codex; minimum required privileges, no token in files.

**Phase 0 exit:** Empty repository successfully initialized, decisions documented, CI green, clean build, no known secrets, XP wireframe approved, and MVP boundaries accepted.

---

## Phase 1 — Windows XP desktop shell (functional before decorative)

See the [proposed first implementation tasks](docs/phase-1-first-slice.md).

### 1A. Shared desktop model
- [ ] Define `OperatingSystem = 'xp' | 'kali' | 'tiger'` and app IDs; validate IDs centrally.
- [ ] Define app registry with ID, name, icon, route, window defaults, mobile presentation, and OS-specific labels.
- [ ] Define window state: instance ID, app ID, title, open/minimized/maximized, focused, bounds, z-index, and optional navigation context.
- [ ] Implement pure window reducer/store: open, activate, minimize, restore, maximize, move, resize, close, switch OS.
- [ ] Decide whether multiple windows of same app can open; test duplicates and restore behavior.
- [ ] Clamp window bounds to usable viewport/taskbar; address resizing viewport while window is open.
- [ ] Make restore position deterministic and prevent z-index growing unbounded across long sessions.
- [ ] Ensure pointer events never interfere with internal controls/text selection.
- [ ] Write unit tests for window state transitions and initial bounds.

### 1B. Desktop surface
- [ ] Create XP desktop layout and classic blue taskbar in responsive CSS.
- [ ] Implement custom or properly licensed Bliss-inspired wallpaper asset with documented provenance.
- [ ] Use original/approved icons resembling My Computer, My Documents, My Network Places, Recycle Bin and portfolio apps.
- [ ] Implement desktop icon focus, selected state, tooltip, activation by keyboard, mouse and touch.
- [ ] Implement Start button/menu with opening, nested list navigation if needed, escape-to-close, and focus return.
- [ ] Add running app buttons to taskbar with minimize/restore behavior.
- [ ] Add clock using client-side local time without server hydration mismatch.
- [ ] Implement title bar, icon, close/minimize/maximize controls, keyboard-accessible alternatives to dragging.
- [ ] Add context menu only if it serves a real purpose, accessible through keyboard as well.
- [ ] Add small System/OS selector control but keep Kali/Tiger disabled or clearly labeled Coming Later until implemented.
- [ ] Use optional startup sequence with skip button; avoid forcing repeated waits.
- [ ] Prefer user-initiated audio; initial mode muted and reduced-motion option honored.

### 1C. Apps and routes
- [ ] Implement About Me window with verified, up-to-date copy.
- [ ] Implement My Computer listing five portfolio areas as virtual drives/folders.
- [ ] Implement My Documents showing case studies and downloadable files.
- [ ] Implement My Network Places linking to a topology placeholder.
- [ ] Implement résumé window and direct document open/download path.
- [ ] Implement GitHub/LinkedIn shortcuts using approved public URLs; open external links safely with `noopener noreferrer` where appropriate.
- [ ] Provide canonical HTML routes for About, Projects, Resume, and Contact (or equivalent static content) for search engines and sharing.
- [ ] Add error/not-found states for invalid app ID, deleted project ID and missing assets.

### 1D. Browser and device checks
- [ ] Test open/close/minimize/maximize/focus with mouse and keyboard.
- [ ] Test two windows competing for focus; switch apps repeatedly and ensure taskbar consistency.
- [ ] Test 1366×768, 1920×1080, and narrow mobile widths; verify windows stay accessible.
- [ ] Confirm mobile uses app launcher or readable panels rather than tiny off-screen draggable windows.
- [ ] Check reduced motion, focus indicators, contrast, and readable 200%-zoom behavior.
- [ ] Run screenshot-based visual tests for key XP states.

**Phase 1 exit:** XP desktop, menu, windows, taskbar and essential apps work by mouse, touch and keyboard; no navigation trapping; initial content reachable from ordinary URLs.

---

## Phase 2 — Shared portfolio content, topology, and homelab documentation

### 2A. Content schema and source-of-truth
- [ ] Define typed entities: `Person`, `Project`, `Experience`, `Competition`, `Award`, `Credential`, `PortfolioNode`, `VirtualFile`, and `ExternalLink`.
- [ ] Add unique stable IDs and slugs; avoid depending on displayed titles for navigation.
- [ ] Track evidence/source for important factual claims, dates, tools and results; don't invent metrics or status.
- [ ] Label projects as LIVE, DEMO, CONCEPT, ARCHIVED, LOCAL ONLY or IN PROGRESS based on validated status.
- [ ] Build one content inventory and review each project against GitHub, resume or personal documentation.
- [ ] Build link check for all internal and external URLs.
- [ ] Make all OS themes read from the same data rather than duplicating text.
- [ ] Decide local TS/JSON/MDX only after checking the actual existing content format.

### 2B. Five main areas
- [ ] **IT Infrastructure:** inventory services, host grouping, project purpose, stack, ownership, architecture, screenshots, troubleshooting lessons.
- [ ] **Cybersecurity:** BSidesNYC 2026 (team second), BSides Delaware 2026 (team first, per user), TENEX/Microsoft (solo first among eligible), Google Defense Readiness (solo second), research and labs; distinguish event participation from verified awards.
- [ ] **AI Projects:** World Merit RAG pipeline, FareFit, BridgeCoach, SereneScape, automotive diagnostic assistant *concept*; distinguish implemented features from proposals.
- [ ] **Professional:** education, current work experience, certifications, awards, resume, public GitHub and LinkedIn; verify dates and employment statuses before publishing.
- [ ] **Personal:** gym, car maintenance, hikes and friends, after reviewing photo consent, privacy and location metadata.
- [ ] Use case-study template: overview → problem → goal → architecture → your contribution → what happened → troubleshooting → outcome/evidence → next steps.
- [ ] Add reading-friendly alternatives to visually animated demos.

### 2C. Portfolio topology design
- [ ] Clarify that the *portfolio graph* is conceptual, not a real LAN inventory.
- [ ] Name six top-level nodes: `giovanni-core` plus IT, CYBER, AI, PROFESSIONAL, PERSONAL.
- [ ] Define typed `Node` (ID, label, description, status, link) and `Edge` (from/to, label) structures.
- [ ] Create default visual layout with core central and five spaced nodes; no overlapping labels at targeted sizes.
- [ ] Make node clicking open a detail panel/window; keyboard Enter and Space perform the same action.
- [ ] Add accessible list view for visitors who can't use a graph.
- [ ] Provide zoom/pan and reset buttons only if needed; prevent unexpected scroll capture.
- [ ] Make hover tooltips supplementary, never the only source of information.
- [ ] Decide whether expanding second-level nodes is actually useful; implement incrementally after testing clarity.
- [ ] Test that a direct project link works without navigating through the topology first.

### 2D. Homelab case study (separate from public topology)
- [ ] Make a private architecture inventory first: actual devices, hypervisors, networks, containers, ingress/egress, backups and dependencies.
- [ ] Create a second sanitized public diagram, replacing actual hostnames, addressing, tokens, DNS and identifiable endpoints with documentation values or generic labels.
- [ ] Avoid exposing IPs, port forwards, external hostnames, authentication panels, firewall policy dumps, API keys or machine-identifying screenshots.
- [ ] Do not show real uptime/status unless a safe, intentionally public monitoring feed is designed and threat-modeled later.
- [ ] Document Pi-hole, Docker/Portainer, Tailscale, Nginx Proxy Manager, DDNS, Jellyfin, Immich, Kavita, game server only after verifying present/current services.
- [ ] For each system describe reason installed, network role, dependency, setup steps at a safe abstraction level, lessons, troubleshooting, and non-sensitive screenshots.
- [ ] Explain trust boundaries and backup/restore plans without operationally exploitable details.
- [ ] Run EXIF removal and screenshot redaction review before committing images.

**Phase 2 exit:** All five areas have verified content, every node has a meaningful destination, topology supports keyboard/list view, homelab publication passes a privacy review, and all links work.

---

## Phase 3 — Kali Linux mode and safe terminal

### 3A. OS theme
- [ ] Approve precise Kali generation/desktop environment based on references; avoid a generic hacker-movie theme.
- [ ] Create Kali panel, desktop background, launcher, icons, file manager chrome, terminal styling, and system menu.
- [ ] Reuse the same window manager/app registry and content models; theme component wrappers only.
- [ ] Ensure app switching, focus, close/minimize and responsive modes behave as in XP.

### 3B. Terminal model, parser and virtual filesystem
- [ ] Define grammar and safe commands: `help`, `pwd`, `ls`, `cd`, `cat`, `whoami`, `clear`, `open`, `resume`, `nmap` (simulated only).
- [ ] Decide input quoting and whitespace rules; explicitly reject pipes, shell metacharacters, redirects, subprocess behavior and arbitrary commands.
- [ ] Build an in-memory virtual filesystem from approved portfolio data; no access to actual host or server files.
- [ ] Map `open <portfolio-item>` to known app IDs; never dynamically open arbitrary URL schemes.
- [ ] Implement `nmap` as a deterministic, clearly labeled demo against predefined portfolio nodes, using reserved documentation addresses if addresses are shown.
- [ ] Never execute shell commands or connect to targets based on typed input; no fetch to LAN IPs, port scans or WebSocket tunnels.
- [ ] Bound command length, output length, history size and render time to avoid browser freezes.
- [ ] Render output as text, never unsafe HTML, and escape any user-supplied string.
- [ ] Provide accessible suggestions, help text, command history navigation and clear errors.
- [ ] Test odd quotes, Unicode, HTML payloads, 10k-character commands, unknown paths, command chains, and spam submissions.
- [ ] Add an unmistakable 'SIMULATED PORTFOLIO ENVIRONMENT — NO REAL NETWORK SCANNING' notice.

### 3C. Security content integration
- [ ] Connect case studies to virtual paths such as `/cyber/bsides-nyc` and `/infra/homelab`.
- [ ] Support direct window opening from the network map and file manager.
- [ ] Optionally display mock log views only from reviewed static fixtures; never real incident logs from uncontrolled systems.

**Phase 3 exit:** Kali UI shares all content, commands are deterministic and safe, parser attacks display as inert text, and tests confirm there is no network or process execution path.

---

## Phase 4 — Mac OS X Tiger-inspired mode

### 4A. Visual fidelity and app mapping
- [ ] Approve Tiger vs Mac OS 9 using visual references and legal asset review.
- [ ] Implement wallpaper, Aqua-era title bars, menu bar, Dock, Finder-like file manager and app icons with original/approved assets.
- [ ] Reuse shared window model, routes, projects and file registry.
- [ ] Decide Mac-style close/minimize/zoom button behavior and menu keyboard shortcuts.
- [ ] Implement Finder navigation with folder locations mirroring XP and Kali content.
- [ ] Implement projects gallery and personal photo viewer with image alt text, optimized image sizes and back navigation.
- [ ] Include shareable links and resume in an obvious location; no reliance on discovering a Dock icon.
- [ ] Test click/keyboard/touch focus, Dock overflow and window bounds.

**Phase 4 exit:** Tiger theme works with the exact same content as XP and Kali, with no duplicated business data or regressions in navigation.

---

## Phase 5 — Switching, persistence, performance and polish

### 5A. Mode switching
- [ ] Decide whether switching preserves currently open app and navigation context, closes windows, or restores per-OS states; document it visibly.
- [ ] Implement OS switcher in each theme with keyboard control and readable labels.
- [ ] Ensure switcher never loses access to résumé/contact.
- [ ] Decide persistence policy; if storing preference locally, validate enum and fail safely on corrupt data.
- [ ] Treat any saved state as user-controlled/untrusted input and never embed its value as executable HTML/JS.
- [ ] Test switching while maximized, while a menu is open, and during animation.

### 5B. UX and performance
- [ ] Default to reduced animation; honor `prefers-reduced-motion` and add mute/audio opt-in.
- [ ] Lazy-load OS-specific code, terminal extras and large galleries where feasible.
- [ ] Avoid heavy canvas/3D effects unless justified by measured benefit.
- [ ] Track key performance measures: page load, largest contentful paint, layout shift, interaction latency, JS payload and mobile memory.
- [ ] Optimize images, fonts, and icon bundles; prefer locally hosted approved assets.
- [ ] Test site without JS for résumé and core project route accessibility.
- [ ] Add clear loading and fallback states for expensive visualizations.
- [ ] Ensure browser Back/Forward navigation remains meaningful with open-window deep links.

**Phase 5 exit:** Switching is stable, keyboard and mobile use remain practical, performance budget is checked in CI, and content works even if novelty interfaces fail.

---

## Phase 6 — Security engineering and automated/manual testing

### 6A. Threat model (repeat after any new backend feature)
- [ ] Define assets: public content, repository and CI credentials, domain/DNS, visitor browser, contact details, content assets.
- [ ] Define threat actors: malicious visitor input, dependency compromise, malicious contribution, leaked token, unsafe image or MDX content, accidental homelab exposure.
- [ ] Draw trust boundaries: public browser, static assets, build pipeline, host/CDN, third-party links; no home network trust boundary crossed.
- [ ] Inventory all input surfaces: terminal command string, URL/query/path, local storage, contact form if later added, project metadata, external embeds.
- [ ] Record mitigations, residual risk, security owner, and re-review triggers in `SECURITY.md`.

### 6B. Safe rendering and external resources
- [ ] Use normal React text binding for data; no `dangerouslySetInnerHTML` without explicit reviewed need.
- [ ] If using MDX, restrict compiled content to trusted build-time files and consider restricting allowed components; do not accept visitor-supplied executable MDX.
- [ ] Validate URL protocols (`https:`, `mailto:` where needed), reject `javascript:`, `data:` and unexpected schemes for navigation.
- [ ] Prefer local images/fonts; review licenses, metadata and third-party embed permissions.
- [ ] Test terminal text containing `<script>`, HTML entities, newlines, fake ANSI sequences and exceptionally long input.
- [ ] Review Next.js image remote domains if used; avoid arbitrary remote image URLs.

### 6C. Configuration, supply chain and deployment access
- [ ] Add CSP designed for **actual hosting mode**; prefer restrictive policy, test in report-only before enforcement if necessary, avoid unreviewed `unsafe-eval`/`unsafe-inline` exceptions.
- [ ] Set `X-Content-Type-Options: nosniff`, safe Referrer-Policy, and frame-embedding restrictions using CSP `frame-ancestors` where supported; assess COOP/Permissions-Policy based on requirements.
- [ ] Confirm static hosting can actually set expected headers; test response headers in deployed preview, not only config files.
- [ ] Enforce HTTPS and review HSTS applicability before enabling long-lived preload behavior.
- [ ] Ensure `.env` secrets and `.vercel`/host credentials are gitignored; run secret checks on tracked files/history.
- [ ] Enable Dependabot alerts/security updates and audit production dependencies; investigate findings before blindly upgrading.
- [ ] Review transitive package risks, release activity, license and maintenance before adding UI libraries.
- [ ] Restrict GitHub Actions permissions (`contents: read` by default), use pinned actions when feasible and avoid exposing secrets to untrusted PR code.
- [ ] Do not publish sourcemaps containing secrets or unreviewed internal code details; recognize public client source cannot hide secrets.
- [ ] Validate custom domain ownership and DNS changes carefully; keep existing site live until verified cutover.

### 6D. Tests
- [ ] Unit: app registry schema, route mapping, window reducer, terminal parser, virtual file lookup, sanitization/URL validation.
- [ ] Component: desktop icons, Start menu, window buttons, taskbar tabs, OS switcher, topology node selection.
- [ ] E2E: open résumé from desktop and from direct URL; open/close 2 windows; switch XP→Kali→Mac→XP; browser Back/Forward; mobile app launcher.
- [ ] E2E: terminal `help`, `ls`, `cat`, `nmap` demo, unknown command, XSS string and long input.
- [ ] E2E: topology accessible list navigation; every top-level node opens meaningful content.
- [ ] Accessibility: automated axe/Playwright on key screens plus manual keyboard/tab order/focus/screen reader checks.
- [ ] Browser: Chromium, Firefox, WebKit (or state any coverage limits) and selected real mobile browsers.
- [ ] Performance: measure at least one lower-end phone profile and representative desktop; keep measurable budget agreed with actual baseline.
- [ ] Content quality: verify awards, research descriptions, employment dates, screenshots and downloadable resume against source materials.
- [ ] Security: inspect built output and network logs for outbound requests to private IPs or unexpected services.

**Phase 6 exit:** All mandatory checks pass; no critical/high unresolved exploitable issues, secrets, unauthorized calls or broken primary routes; documented security review completed.

---

## Phase 7 — Preview, release and ongoing maintenance

### 7A. Preview and release
- [ ] Connect repo to a host only after verifying repo URL, build and deployment mode; deploy to preview subdomain not production domain.
- [ ] Ensure production site remains online and has a rollback path; record current DNS/hosting configuration safely.
- [ ] Test preview on desktop, phone, low bandwidth and keyboard-only scenarios.
- [ ] Test `/`, key project URLs, `/resume`, static PDF, contact method, robots.txt, sitemap and OG preview cards.
- [ ] Confirm page titles/descriptions and social preview show the owner and work, not generic 'Next App'.
- [ ] Confirm privacy policy/analytics status if services collect data.
- [ ] Run production build, audit, secret scan, link check, E2E and screenshot regression on release candidate commit.
- [ ] Collect feedback from a recruiter-like tester: can they find resume and 2 projects in under ~30 seconds (a target to test, not a guarantee)?
- [ ] Cut over domain after explicit approval; verify certificate, redirects, headers, routes and CDN cache afterward.
- [ ] Record release tag, deploy URL and rollback instructions.

### 7B. Maintain
- [ ] Keep a monthly dependency and content review checklist.
- [ ] Update certifications, work dates, resume and project status from actual evidence.
- [ ] Monitor broken links and deployment errors only through approved low-data tools.
- [ ] Schedule periodic security review after adding any form, API, CMS, hosting feature or real telemetry.
- [ ] Archive outdated screenshots and remove any accidental secret if discovered, following key rotation and Git history remediation practices.

**Phase 7 exit:** New domain deployment verified and recoverable; core visitor tasks remain usable across OS themes and devices.

---

## Proposed repository layout (do not impose before audit)

```text
.
├── README.md
├── TODO.md
├── ARCHITECTURE.md
├── SECURITY.md
├── CONTENT_INVENTORY.md
├── docs/
│   ├── repo-audit.md
│   ├── product-requirements.md
│   ├── decisions/
│   └── threat-model.md
├── public/
│   ├── assets/os/xp/
│   ├── assets/os/kali/
│   ├── assets/os/tiger/
│   ├── project-images/
│   └── resume.pdf
├── src/
│   ├── app/                    # If Next.js chosen; exact structure varies by framework
│   ├── components/
│   │   ├── desktop/
│   │   ├── window-manager/
│   │   ├── topology/
│   │   └── apps/
│   ├── operating-systems/
│   │   ├── xp/
│   │   ├── kali/
│   │   └── tiger/
│   ├── data/
│   ├── lib/
│   │   ├── virtual-filesystem/
│   │   └── terminal/
│   └── styles/
├── tests/
└── .github/
    ├── workflows/
    └── dependabot.yml
```

## Suggested PR / delivery sequence

1. `docs/discovery`: repository audit, requirements, diagrams, decision log, threat model.
2. `chore/foundation`: baseline tooling, CI, tests and security hygiene.
3. `feat/xp-shell`: desktop, taskbar, Start menu and window manager.
4. `feat/xp-apps`: Explorer, About, resume/contact and canonical URLs.
5. `feat/content-model`: verified project descriptions and shared virtual filesystem.
6. `feat/topology`: six-node conceptual network, interactions and accessible fallback.
7. `docs/homelab`: sanitized architecture case study and security review.
8. `feat/kali-desktop`: theme + apps + safe terminal parser, test fixtures.
9. `feat/tiger-desktop`: theme + Finder/Dock and project/personal galleries.
10. `feat/os-switcher`: state handling, persistence decision, mobile integration.
11. `test/hardening`: security, accessibility, browser, perf and link checks.
12. `chore/release`: preview, validation, cutover and rollback notes.

## Codex working agreement (paste into AGENTS.md after review)

- Inspect repository and current worktree before editing; show intended files and plan first for nontrivial changes.
- Work on ONE approved PR scope at a time; preserve existing user changes.
- Do not invent data, tool results, test outcomes, employment facts, network information or project deployments.
- Never contact private network targets or execute visitor input; all terminal/Nmap interactions are local simulation fixtures.
- Avoid adding backend endpoints, databases, auth, third-party scripts or tracking without a recorded decision and threat model update.
- Use least-privilege credentials and no secrets in chat output, commits, screenshots or logs.
- Report exact installed package versions from lockfiles; no unverified version claims.
- Before marking tasks complete, supply screenshots or test output and manual verification steps.
- After work, provide `git diff --stat`, changed paths, decisions, tests (pass/fail/not run), potential security risks and next PR.
- Do not merge/deploy automatically without explicit authorization.

## Primary research links

**Comparable codebases / implementations**
- SharpXP — https://github.com/asharpie/SharpXP
- DhirajOS — https://github.com/uppadadhiraj/dhiraj-os
- Windows XP React recreation — https://github.com/Cyanoxide/react-xp
- Kali-like portfolio with safe terminal and content routes — https://github.com/Sammieblz/my-portfolio-site
- React macOS desktop clone — https://github.com/gianlucajahn/macOS-react
- macOS desktop using react-rnd — https://github.com/Vairuh/Mac_OS
- XP.css — https://github.com/botoxparty/XP.css
- react-rnd — https://github.com/bokuweb/react-rnd

**Developer community**
- XP portfolio development account — https://www.reddit.com/r/webdev/comments/1gi1c3v/
- Accessibility-conscious retro portfolio — https://www.reddit.com/r/reactjs/comments/1qugnwy/
- XP-style portfolio and mobile tradeoff — https://www.reddit.com/r/react/comments/1sh10h4/

**Official documentation**
- Next.js setup — https://nextjs.org/docs/app/getting-started/installation
- Next.js deployment options — https://nextjs.org/docs/app/getting-started/deploying
- React Flow basics — https://reactflow.dev/learn/concepts/building-a-flow
- React Flow accessibility — https://reactflow.dev/learn/advanced-use/accessibility
- Playwright accessibility testing — https://playwright.dev/docs/accessibility-testing
- GitHub Dependabot — https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates
- GitHub ruleset availability — https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- OWASP XSS prevention — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP CSP — https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html

**Legal/asset review note:** Open-source UI libraries and stylesheets are not licenses to use Microsoft/Apple/Kali trademarks, copyrighted wallpapers, sound clips, or icon sets. Review each asset separately and prefer original or properly licensed substitutes.
