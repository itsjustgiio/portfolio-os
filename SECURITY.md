# Security

The repository maintainer owns security review. Report sensitive findings privately using a maintainer-approved channel and omit credentials and personal data from public issues.

The trust boundaries are GitHub and dependencies at build time, then host and public browser at delivery time. Contributions and package updates can run code during builds, so CI uses read-only contents access, pinned action commits and checkout without persisted credentials. External links will be reviewed before publication. Future portfolio content needs provenance, consent, screenshot redaction and metadata review.

Serve static output over HTTPS. Confirm the host's header support before composing and testing a CSP against the real export. Keep build and hosting credentials out of browser data and repository files. Use safe text rendering and protocol allowlists for future navigation fields.

Run npm audit and scan source and build output before release. Dependency advisories, compromised updates and hosting configuration remain residual risks. Revisit this model for hosting, user input, new integrations or telemetry, deployment credentials, or changes in public content.
