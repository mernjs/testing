# Platform (multi-tenant SaaS layer)

Everything that makes this app a SaaS platform — rather than one company's
tools — lives here, with its pages in `src/app/(platform)/`. The brackets make
that a Next.js route group: it organises files without changing URLs
(`/signup`, `/onboarding`, `/workspace/invite` …).

The 18 business panels (HRMS, PMS, FMS …) stay in their own folders and are
unaware of this layer beyond calling `getDb()`, which is company-scoped.

## Layout

| Path | What it does |
|---|---|
| `tenancy/` | Company registry, host → company routing, the company-scoped DB layer, per-company caching, provisioning a new company |
| `website/` | Neutral starter website published for every new company (Home, Services, About, Contact, Privacy) |
| `branding/` | Company logo, wordmark and colour (`getCompanyBrand`, `BrandProvider`, branded titles, logo uploads). UI in `src/app/(platform)/settings/branding` |
| `onboarding/` | Setup wizard catalog (industries, department templates, role presets, panels) and progress |
| `signup.ts` | Self-serve sign-up: pending sign-ups, email verification, hand-off sign-in, the approval queue (approve/reject) |
| `console/` | Platform owner console (cross-company, raw DB): company list/detail, suspend/reactivate, platform KPIs, access guard. UI in `src/app/(platform)/console` |
| `invitations.ts` | Team invitations and acceptance (creates HRMS employee + login) |
| `settings.ts` | Platform-wide settings (sign-up mode) |
| `email/` | Outgoing email behind a swappable provider (`EMAIL_PROVIDER`: Resend, console) |
| `domains/` | Hostname attach/verify/SSL behind a swappable provider (`DOMAIN_PROVIDER`: Vercel, manual) |
| `domains/custom.ts` | A company's own domains: add, TXT ownership check, primary, remove, daily re-check (UI in `src/app/(platform)/settings/domains`, cron `/api/platform/domains/cron`) |
| `request.ts` | Request origin / client key helpers |

## Where future phases go

| Phase | Folder |
|---|---|
| Plans, trials, subscriptions, module entitlements | `billing/` |
| Event bus, Trigger → Condition → Action workflows | `events/`, `workflows/` |
| Company dashboard, global search, notifications, audit | `search/`, `notifications/`, `audit/` |
| AI engine, integrations, import/migration | `ai/`, `integrations/`, `import/` |

## Rules

- Platform-level collections (shared by all companies) are listed in
  `tenancy/collections.ts` → `GLOBAL_COLLECTIONS` and read via `getPlatformDb()`.
  Everything else is company-scoped by default.
- Provider credentials (Resend, Vercel, …) are server-side env vars only.
- Anything that links to "this company's website" (sitemap, robots, canonical /
  Open Graph URLs, JSON-LD, SEO crawler, certificate verification, payment
  links) uses `companySiteUrl()` from `tenancy/site-url.ts`, never `siteUrl`
  from `src/lib/seo.ts` (that constant is the platform owner's own origin).
