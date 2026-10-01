# Workspace audit

Scope: make the existing **Workspace** (`/workspace`) the company-level root. One
company = its users, roles, panels, features, its own subscription and data.
The **Platform Panel** (`/platform/*`) stays separate and is not touched,
except for one conditional link.

Legend for "Verified": `test: <name>` = a check in `scripts/test-workspace-access.ts`
that was run; `e2e` = covered by `scripts/e2e/workspace.e2e.mjs` (written, **not run
by the author**); `code read` = checked by reading the code only.

---

## 1. Inventory

### 1.1 Identity and sessions

| Thing | Where | Notes |
|---|---|---|
| Identity store | `admin_users` (company-scoped through `getDb()`) | `roles: string[]`, `permissionOverrides: Record<string, boolean>` |
| Workspace session | `src/lib/hub-auth.ts`, cookie `hub_session`, collection `hub_sessions` | No role gate: any account of the company can sign in |
| Admin session | `src/lib/admin-auth.ts`, cookie `admin_session`, collection `admin_sessions` | `super_admin` only |
| Single sign-on | `src/lib/cross-module-sso.ts` | Signing in to any panel mints a session in every panel the roles allow; sign-out destroys all of them, on every device |
| Role catalog | `src/lib/admin/role-catalog.ts` (built from each panel's `*-roles.ts`) | Assigned at `/admin/users` |
| Permission catalog | `src/lib/admin/permission-catalog.ts`, resolved by `src/lib/permission-overrides.ts` | Per-user overrides of single capabilities; `super_admin` always passes |
| Plan / modules | `src/lib/platform/billing/entitlements.ts` (`getEntitlements`), `onboarding/state.ts` (`enabledModules`) | Panel in plan + switched on |
| Company-wide data tier | `src/lib/platform/access.ts` (`accessibleAreas`) | Behind KPIs, search, recent activity, AI assistant |
| Tenant isolation | `getDb()` (company-scoped), `getPlatformDb()` (cross-company) | See findings F9 |

### 1.2 Workspace routes

| Route | What it does | Server-side check | Actions / APIs and their authorization |
|---|---|---|---|
| `/workspace/login` | Sign-in form | none (public); redirects when already signed in | `hubLoginAction`: `verifyHubCredentials` (lockout after 5 failures), then `provisionAccessibleSessions` |
| `/workspace/change-password` | Change own password | `getCurrentHubUser()` | `changeOwnHubPassword` on the signed-in user's own id |
| `/workspace` (Staff Hub) | Personal dashboard, company KPIs, panel tiles | layout + page: `getCurrentHubUser()`; layout also forces a pending password change | `hub-actions.ts` (search, ask, notifications): each calls `getCurrentHubUser()`; data filtered by `accessibleAreas(user)` |
| `/workspace/analytics/[panel]` | Read-only analytics per panel (fms, hrms, lms, messenger, pms, portal, prms, tms, workspace) | `getCurrentHubUser()` + a per-panel role check **in the page** | loaders in `src/lib/admin/panel-analytics.ts`, no own check (called only from this page and `/admin/analytics`) |
| `/workspace/notifications` | Own notifications | `getCurrentHubUser()` | `listNotifications(user.id)` — own rows only |
| `/workspace/invite`, `/workspace/handoff` | Accept invitation, post-sign-up hand-off | token based | unchanged, out of scope |

### 1.3 Company Admin routes (`/admin`, "Command Center")

Every page lives under `src/app/admin/(protected)/`. Before this work only the
**layout** checked the session for 33 of the 35 pages (see F1). Every server
action file calls `requireAdminUser()` in every exported action (checked: number
of exported actions = number of guards in each `actions.ts`). Every
`/api/admin/**/export` route (33 routes) calls `getCurrentAdminUser()` +
`hasAdminAccess()` and answers 401/403. All data goes through `getDb()`.

| Route(s) | What it does | Who (server) | APIs / actions |
|---|---|---|---|
| `/admin/login`, `/admin/change-password` | Admin sign-in, own password | public / admin session | `adminLoginAction` → `verifyAdminCredentials` (needs `super_admin`) |
| `/admin` | Cross-panel executive dashboard | `super_admin` | `actions.ts` (logout), `notifications-actions.ts` |
| `/admin/analytics/[panel]` | Same analytics as `/workspace/analytics/[panel]` | `super_admin` | duplicate, see F7 |
| `/admin/users` | Users, roles, permission overrides, reset password, deactivate | `super_admin` (`requireAdminUser` in page) | `users/actions.ts`; `/api/admin/users/export` |
| `/admin/activity-log` | Cross-panel audit trail | `super_admin` | `/api/admin/activity-log/export` |
| `/admin/notifications` | Admin notifications | `super_admin` | `notifications-actions.ts` |
| `/admin/documents` | Company documents register | `super_admin` | `documents/actions.ts`; `/api/admin/documents/export` |
| `/admin/crm/{leads,clients}` | Leads and clients grids | `super_admin` | own `actions.ts`; `/api/admin/crm/*/export` |
| `/admin/pms/{projects,tasks,milestones,timesheets}` | Project governance grids | `super_admin` | own `actions.ts`; `/api/admin/pms/*/export` |
| `/admin/prms/{vendors,requisitions,rfqs,purchase-orders,invoices,payments,expenses,assets,inventory,infrastructure,subscriptions}` | Procurement governance grids | `super_admin` | own `actions.ts`; `/api/admin/prms/*/export` |
| `/admin/tms/{programs,batches,students,certificates,payments}` | Training governance grids | `super_admin` | own `actions.ts`; `/api/admin/tms/*/export` |
| `/admin/yashchat/{channels,direct-messages,meetings}` | Chat governance grids | `super_admin` | `channels/actions.ts`; `/api/admin/yashchat/*/export` |
| `/admin/portal/users` | External portal accounts | `super_admin` | `actions.ts`; `/api/admin/portal/users/export` |
| `/admin/careers/applicants` | Job applicants | `super_admin` | `actions.ts`; `/api/admin/careers/applicants/export`, `.../[id]/resume` |
| `/admin/chatbot/{conversations,voice-conversations}` | Website chatbot transcripts | `super_admin` | `actions.ts`; `/api/admin/chatbot/*/export` |

### 1.4 Company settings routes

All pages check `getCurrentHubUser()` + `roles.includes("super_admin")` in the
page itself; every server action file has a `requireOwner()` with the same two
checks; the two import route handlers repeat it and answer 401/403.

| Route | What it does | Actions / APIs |
|---|---|---|
| `/settings` | Hub of cards | none |
| `/onboarding` | Setup wizard: profile, departments, invitations, branding, panels | `onboarding/actions.ts` (`requireOwner`) |
| `/settings/branding` | Logo, name, colour | `branding/actions.ts` |
| `/settings/domains` | Workspace address, custom domains | `domains/actions.ts`; lib filters every query by `companyId` |
| `/settings/billing` | Plan, checkout, change plan, cancel / resume, coupon, GST details | `billing/actions.ts` (company id from the host, never from input) |
| `/settings/billing/invoices` | SaaS invoices and credit notes | `listCompanySaasInvoices(companyId)`; PDF at `/api/platform/billing/invoices/[id]/pdf` (see F5) |
| `/settings/payments` | The company's own Razorpay account | `payments/actions.ts` |
| `/settings/automations` | Event → email / notification / webhook | `automations/actions.ts` |
| `/settings/import` | CSV import | `import/run`, `import/sample` route handlers |
| `/settings/activity` | Company activity log | `listEvents()` |
| `/upgrade` | "This panel is not in your plan" | **no session check** (see F8) |

### 1.5 Scoping that exists today (department / team / data)

- **Company**: every collection read through `getDb()` is filtered to the company of the request host.
- **Panel role tier**: each panel decides its own "see everything" tier; `accessibleAreas()` reuses those tiers for cross-panel data.
- **Own data**: HR and Project analytics in Workspace pass `restrictToEmployeeId`; notifications, SOP assignments, AI chats, tests on the Staff Hub are filtered to the signed-in user.
- **Department / team scoping in Workspace or `/admin`: does not exist.** `/admin` is all-or-nothing (`super_admin`). Panels that have manager/team rules (HRMS, PMS) apply them inside the panel. Nothing was added here.

---

## 2. Mapping: existing feature → Workspace

Navigation is defined once in `src/lib/workspace/nav.ts`; `resolveWorkspaceNav(user)`
(`src/lib/workspace/access.ts`) returns only what the user may open; pages call
`requireWorkspaceAccess(key)` / `checkWorkspaceAccess(user, key)` with the same key.

Permission shorthand: **SA** = `super_admin`; **role(x)** = any role of panel x;
**plan(x)** = panel x is in the company's plan and switched on.

### 2.1 Company-level Admin features

| Existing feature | Workspace location (section → item) | Permission | API authorization | UI access | Verified |
|---|---|---|---|---|---|
| Command Center dashboard `/admin` | Company admin → Command Center | SA | `requireAdminPage()` in page + layout | nav key `admin.dashboard` | pending |
| Admin audit log `/admin/activity-log` | Company admin → Audit log | SA | page guard; export route 401/403 | `admin.activity-log` | pending |
| Admin notifications `/admin/notifications` | Company admin → Admin notifications | SA | page guard; actions `requireAdminUser` | `admin.notifications` | pending |
| Documents `/admin/documents` | Company admin → Documents | SA | page guard; actions; export route | `admin.documents` | pending |
| CRM leads / clients | Company admin → CRM | SA | page guard; actions; export routes | `admin.crm.*` | pending |
| PMS projects / tasks / milestones / timesheets | Company admin → Projects | SA | same | `admin.pms.*` | pending |
| PRMS (11 grids) | Company admin → Procurement | SA | same | `admin.prms.*` | pending |
| TMS (5 grids) | Company admin → Training | SA | same | `admin.tms.*` | pending |
| Chat channels / DMs / meetings | Company admin → Team chat | SA | same | `admin.yashchat.*` | pending |
| Portal users | Company admin → People → Portal users | SA | same | `admin.portal.users` | pending |
| Careers applicants | Company admin → People → Job applicants | SA | same | `admin.careers.applicants` | pending |
| Chatbot conversations / voice | Company admin → Website chatbot | SA | same | `admin.chatbot.*` | pending |
| Admin analytics `/admin/analytics/*` | not listed (duplicate of Analytics, F7) | SA | page guard | reachable from the `/admin` sidebar only | pending |
| Users, roles, permission overrides `/admin/users` | Company → Users, roles & seats | SA | `requireAdminUser()` in page and every action | `company.users` | pending |
| Panel analytics `/workspace/analytics/*` | Analytics → one item per panel | fms/hrms/pms/prms/tms/messenger: SA or role(x); lms: `lms.canViewAnalytics`; workspace: `workspace.canViewAnalytics`; portal: SA or `portal_admin`; all + plan(x) | `checkWorkspaceAccess` in the page | `analytics.<panel>` | pending |
| Panels (HRMS, PMS, …) | Panels → one item per panel | role(x) + plan(x); CRM: every account | each panel's own layout (`requireModule`, role) | `panel.<key>`; outside the plan = locked tile on the Staff Hub, hidden in the sidebar | pending |

### 2.2 Company SaaS management

| Existing feature | Workspace location | Permission | API authorization | UI access | Verified |
|---|---|---|---|---|---|
| Onboarding `/onboarding` | Company → Company setup | SA | page + `requireOwner()` in actions | `company.setup` | pending |
| Organization profile | Company → Organization profile `/settings/profile` (**new page**, reuses the onboarding profile form and `saveProfileAction`) | SA | `requireWorkspaceAccess`; action `requireOwner()` | `company.profile` | pending |
| Workspace settings / company settings | Company (section header) → `/settings` | SA | page | section link | pending |
| Plan, subscription, upgrade, downgrade, renewal (cancel / resume) | Company → Plan & billing `/settings/billing` | SA | `billing/actions.ts` `requireOwner()` | `company.billing` | pending |
| Upgrade prompt `/upgrade` | reached from locked tiles | any (F8) | none | not a nav item | pending |
| Billing details (GST) | Company → Plan & billing | SA | same | `company.billing` | pending |
| Invoices | Company → Invoices & payments `/settings/billing/invoices` | SA | page; PDF route (F5) | `company.invoices` | pending |
| Payments / transactions | same page, "Payments & refunds" card (**added**, from paid invoices and credit notes) | SA | same loader | `company.invoices` | pending |
| Usage | Company → Usage `/settings/usage` (**new page**, read-only) | SA | `requireWorkspaceAccess` | `company.usage` | pending |
| Users / seats | Company → Users, roles & seats `/admin/users` (seats badge **added**) | SA | `requireAdminUser()` | `company.users` | pending |
| Roles & permissions | same page (role editor, permission overrides) | SA | same | `company.users` | pending |
| Domains | Company → Custom domains `/settings/domains` | SA | page + actions | `company.domains` | pending |
| Branding | Company → Branding `/settings/branding` | SA | page + actions | `company.branding` | pending |
| Own payment gateway | Company → Payment account `/settings/payments` | SA | page + actions | `company.payments` | pending |
| Integrations | Company → Integrations `/settings/integrations` (**new page**, a list with status and links) | SA | `requireWorkspaceAccess` | `company.integrations` | pending |
| Automations (incl. webhooks) | Company → Automations | SA | page + actions | `company.automations` | pending |
| Import | Company → Import data | SA | page + route handlers | `company.import` | pending |
| Activity log | Company → Activity log | SA | page | `company.activity` | pending |
| Security | Company → Security `/settings/security` (**new page**: last sign-in, change password, sign out everywhere, account lock / forced-change counts) | SA | `requireWorkspaceAccess`; existing `hubLogoutAction` | `company.security` | pending |
| Notifications, change password | Account | any signed-in account | `getCurrentHubUser()` | `account.*` | pending |
| Platform Panel | single link, bottom of the sidebar and on `/settings` | owner company **and** platform access (`getPlatformAccessForUser`) | `/platform` layout `requirePlatformAccess()` (unchanged) | `platform.panel` | pending |

Not built, because the data does not exist: two-factor sign-in, password policy,
"sign out other sessions only" (sessions carry no per-login id that links the
panels' sessions; only "sign out everywhere" exists), per-department or per-team
scoping of Workspace or `/admin`.

---

## 3. Findings

| # | Finding | Severity | Status |
|---|---|---|---|
| F1 | 33 of 35 `/admin` pages had no check of their own; only `admin/(protected)/layout.tsx` checked the session. Layouts are not re-rendered on navigation, so a page's loader could run without the check. | high | pending |
| F2 | `/workspace/analytics/portal`, `/lms`, `/workspace`: the page authorized **every** signed-in account, while the sidebar hid Portal analytics from non-admins. Company-wide lead and account numbers were readable by any employee. | medium | pending |
| F3 | Workspace analytics ignored the plan and the switched-on panels (a company without Finance in its plan could still open Finance analytics). | medium | pending |
| F4 | Staff Hub sidebar: hardcoded role checks duplicated the page's checks; "Lead Analytics" and "Workspace Analytics" were shown unconditionally; Staff Hub quick links pointed at `/hrms/me`, `/messenger`, `/pms` for people without those roles. | low | pending |
| F5 | `/api/platform/billing/invoices/[id]/pdf` treated **any** `super_admin` of the platform-owner company as a platform admin, even when their Platform Panel access was revoked or their platform role lacks `invoices.read`; they could download any company's invoice. | medium | pending |
| F6 | `/settings` showed the "Platform Panel" card to every `super_admin` of the owner company without checking platform access. | low | pending |
| F7 | Duplication: `/admin/analytics/[panel]` and `/workspace/analytics/[panel]` render the same analytics; `/admin/login` and `/workspace/login` are two sign-ins for one identity; the `/admin` sidebar links `/admin/users` twice ("User Management", "Access & Roles"). | low | pending |
| F8 | `/upgrade` has no session check; an anonymous visitor on a company's host can read that company's plan name. | low | open |
| F9 | `getPlatformDb()` in company-side code: `domains/custom.ts`, `branding`, `onboarding/state.ts`, `billing/{subscription,addons,coupons,invoices,limits}` — every query read is keyed by the current `companyId` (or is a platform catalogue: plans, add-ons). No unfiltered company-side use found. | info | no change needed |
| F10 | `/settings/*` and `/onboarding` did not enforce a pending forced password change (the Workspace layout does). | low | pending |
| F11 | `/platform/invoices/export` checks owner company + `super_admin` rather than the platform permission `invoices.read`. Platform Panel code, out of scope here. | medium | open |
| F12 | `/admin` grids for a panel outside the company's plan (e.g. `/admin/tms/*` on a plan without Training) stay reachable for the `super_admin`. They read the company's own data only. | low | open |
| F13 | Panel analytics for fms / prms / tms / messenger are company-wide and open to **any** role of that panel (HR and Projects are restricted to the viewer's own records). No finer rule exists in the page today. | low | open |
