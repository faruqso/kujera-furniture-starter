# Security Policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch.

| Version | Supported |
| ------- | --------- |
| Latest `main` | Yes |
| Older forks / tags | Best effort |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report them privately using one of these channels:

1. **GitHub Security Advisories (preferred):**  
   [Create a private security advisory](https://github.com/faruqso/kujera-furniture-starter/security/advisories/new)

2. **Email:**  
   Contact the maintainer via the email listed on their [GitHub profile](https://github.com/faruqso).

Include as much detail as you can:

- What you found and where (file, URL, or component)
- Steps to reproduce
- Impact (e.g. data exposure, unauthorized CMS access)
- Any suggested fix, if you have one

We aim to acknowledge reports within a few business days and will keep you updated on remediation.

## Scope notes

- The demo **cart and checkout are client-side only** — no real payments are processed.
- The **`/admin` CMS UI** on the live demo does not allow saves without GitHub OAuth / auth setup. See [docs/decap-setup.md](docs/decap-setup.md).
- Forks that enable production CMS saves are responsible for securing their own OAuth credentials and repo access.

Thank you for helping keep Kujera Furniture Starter safe for everyone.
