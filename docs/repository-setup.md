# Repository setup

[itsjustgiio/portfolio-os](https://github.com/itsjustgiio/portfolio-os) is the public source repository. GitHub reported `main`, size 0 and no detected license. An anonymous `git ls-remote --symref origin` returned no refs, so there was no remote README, LICENSE or .gitignore to inspect. The workspace already had a Git checkout with that origin and an unborn `main`. Initial `git status --short` showed only the supplied, untracked TODO.md. No commit history established how the checkout was created.

The workstation has Windows PowerShell 5.1, Git 2.47.0.windows.2, Node 22.16.0, npm 10.9.2 and Codex CLI 0.171.0-alpha.13. Git reports the Credential Manager helper. GitHub CLI was unavailable on PATH. Anonymous read access was verified. Authenticated permissions and credential scope still need owner verification. The [GitHub verification](github-verification.md) documents the active workflows, branch protection status and owner settings to review. Avoid creating or exporting a token for anonymous reads.

The package is private and named `portfolio-os`. The working site title is Giovanni OS. The logo, production domain and existing website host need owner confirmation. No project copyright license has been selected. Keep upstream dependency notices with any applicable redistribution and verify rights per asset before adding it.

## Workflow

Select the Node version in `.nvmrc` and use npm 10.9.2. Run commands from the repository root. In PowerShell, `npm.cmd` works if script execution policy blocks the npm shim.

| Command                   | Purpose                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `npm ci --ignore-scripts` | Install from the npm lockfile without dependency lifecycle scripts |
| `npm run dev`             | Serve the development site on loopback                             |
| `npm run typecheck`       | Generate Next route types and check strict TypeScript              |
| `npm run lint`            | Run ESLint and fail on warnings                                    |
| `npm run format:check`    | Check scaffold formatting                                          |
| `npm run format`          | Apply scaffold formatting                                          |
| `npm run build`           | Export static site files to `out/`                                 |
| `npm test`                | Check the generated HTML and static artifact                       |
| `npm audit`               | Review dependency advisories                                       |

Use `feat/*`, `fix/*` or `docs/*` branches. Until rulesets are confirmed, use manual review of the exact commit and the PR checklist before merge. After publication is approved, verify a test PR goes green, review Dependabot alert and security update settings, and check whether a ruleset can require CI and review before merging. A repository maintainer should confirm the signed-in account's role and effective credential permissions without sharing credentials. Read-only access suffices for inspection. Keep write or admin scopes limited to authorized publishing or settings work.

## Hosting

Production delivery is a static export. The preview mechanism, DNS ownership, current host, HTTPS, headers and cache settings remain unknown. Before picking a provider, verify directory index routing, preview isolation, header support and HTTPS. Use short-lived or revalidated HTML and long-lived caching for fingerprinted assets after checking the provider. Keep the existing site available through any future cutover.
