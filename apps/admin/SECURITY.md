# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public GitHub issue**.

Report it privately by emailing: **dendatsiv@gmail.com**

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fix (optional)

You will receive a response within **72 hours**. Once the issue is confirmed and patched, a disclosure will be coordinated with you.

## Security Considerations

This is an internal admin panel with restricted access. The following controls are in place:

- **Authentication** — JWT-based login with OTP verification
- **Role-based access control** — `admin` and `user` roles; sensitive routes are guarded
- **HTTPS only** — all API communication is over TLS
- **Environment variables** — secrets are stored in Vercel environment variables, never in source code
- **No sensitive data in the bundle** — API keys and credentials are injected at build time via `@ngx-env/builder`

## Out of Scope

The following are not considered vulnerabilities for this project:

- Issues in development-only dependencies
- Theoretical attacks without a working proof of concept
- Vulnerabilities in outdated browsers not targeted by this app
