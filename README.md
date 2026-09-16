This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> **New here?** See [PANELS.md](./PANELS.md) for what each panel is, why it
> was built, and what it's for — this file covers local dev setup only.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## HRMS panel

A separate HR management panel lives at `/hrms` (own login, own session cookie
`hrms_session`). HRMS users are `admin_users` documents with an HRMS `roles`
array — grant access with:

```bash
npm run hrms:grant   # prompts for email + roles (super_admin | hr | manager)
```

Then sign in at [http://localhost:3000/hrms/login](http://localhost:3000/hrms/login).

Phase 1: HR dashboard, employee directory + profiles, departments / designations
/ teams, org hierarchy, payroll-ready salary/bank records, converting shortlisted
Careers applicants into employees.

Phase 2a: org work schedule + leave-type config (`/hrms/settings`, super-admin),
holiday calendar (`/hrms/holidays`), attendance daily register + monthly report
with late/early detection (`/hrms/attendance`), leave requests / approval /
balances / calendar / analytics (`/hrms/leave`). HR-operated — HR and managers
act on employees' behalf; managers are scoped to their reporting line.

Phase 2b-i: **employee self-service portal** at `/hrms/me` (new `employee`
role — HR creates a portal login from the employee profile, employee sets their
own password on first sign-in). Employees clock in/out, apply for and withdraw
leave, edit their own contact details, upload documents, and view payslips +
salary. **Full payroll engine** at `/hrms/payroll` — monthly runs from
effective-dated salary structures, statutory deductions (PF/EPS/ESI/PT + TDS via
India new-regime slabs), employer contributions, attendance-based loss of pay,
arrears; lifecycle `draft → approved → paid` (paid locks the month); bank
transfer CSV; printable payslips. **Employee documents** — secure per-employee
store with categories, versioning and expiry, managed by HR and (limited
categories) by the employee.

Phase 2b-ii: **HR notification centre** — in-app notifications with a topbar
bell on both the staff panel and the employee portal (`/hrms/notifications`,
`/hrms/me/notifications`). Event-driven (leave filed / decided, new employee,
payslip published, employee document upload, offer status) plus a lazily-run,
once-per-hour sweep for document expiry, birthdays and probation completion.
**Recruitment offer tracking** — an `hrms_offers` record per shortlisted
candidate with a `draft → extended → accepted / declined / withdrawn → joined`
lifecycle on the `/hrms/recruitment` Offers tab; converting the applicant to an
employee flips the offer to `joined` and links the record.

**Employee banking + salary disbursement:** each employee's *Salary & Bank* tab
manages multiple **bank accounts** (`hrms_bank_accounts`) — account number and
UPI ID are AES-256-GCM encrypted at rest (`HRMS_ENCRYPTION_KEY`), masked in the
UI, with a primary flag, verification state, and an audited "reveal". Approving a
payroll run creates one **salary payout** per employee (`hrms_salary_payouts`);
`/hrms/payroll/payouts` drives the `pending → initiated → processing → paid /
failed → reconciled` pipeline with bulk + individual actions, a decrypted bank
(NEFT) file, and a payout report. Disbursement goes through a **RazorpayX
Payouts** integration when `HRMS_PAYOUT_PROVIDER=razorpay` (+ `RAZORPAY_*` and the
`/api/hrms/payroll/webhook` callback); otherwise HR records the UTR manually. A
run auto-marks **Paid** (and the month locks) once every payout is paid.

The HRMS is now feature-complete against the original brief.

Optional `HRMS_API_SECRET` (see `.env.example`) allows bearer-token access to
`/api/hrms/*` endpoints for cron / tooling.

## Messenger panel

A real-time Team Communication Platform (Slack / Teams style) lives at
`/messenger` — own login, own session cookie `messenger_session`. Messenger
users are `admin_users` documents with a Messenger `roles` array — grant access
with:

```bash
npm run chat:grant       # prompts for email + roles
                         # (super_admin | chat_admin | chat_pm | chat_hr | chat_employee)
npm run chat:seed-demo    # creates the 7 standard team channels + syncs chat_users
```

**Onboard every HRMS employee at once** — grant `chat_employee` to every account
that already has an HRMS portal login (an `admin_users` doc with `roles:
["employee"]` + an `employeeId` link), and sync their `chat_users` profiles:

```bash
npm run chat:grant-hrms                        # dry run — shows what would change
npm run chat:grant-hrms -- --apply             # apply
npm run chat:grant-hrms -- --apply --create-missing   # also create logins for
                                               # employees with no portal login yet
                                               # (work email + printed temp password)
npm run chat:grant-hrms -- --apply --revoke    # undo
```

Then sign in at [http://localhost:3000/messenger/login](http://localhost:3000/messenger/login).

**Realtime transport:** Server-Sent Events. The SSE route `/api/messenger/stream`
tails a `chat_events` log (ordered by a `chat_counters` sequence — no replica
set / change streams needed) and pushes new events to each client, filtered to
the channels / DMs / user scope they may see. `src/lib/messenger/events.ts`
(`emit` / `pull`) is transport-agnostic, so a real WebSocket server can replace
the SSE route later without touching feature code.

**Phase 1 (done):** RBAC + auth, the full `chat_*` schema (chat_users,
chat_channels, channel_members, direct_conversations, direct_messages,
channel_messages, message_threads, message_reactions, chat_shared_files,
chat_notifications, user_presence, chat_events, chat_activity_logs), the panel
shell + sidebar + topbar, **Chat Dashboard** (8 KPIs + 6 analytics + date
range), **Direct Messages** and **Team Channels** with real-time messaging,
typing indicators, read receipts, reactions, threads, @mentions, edit / delete,
pins, stars, image / PDF / document / voice-note sharing, the **presence system**
(online / away / busy / in-meeting / offline + last-active), the **notification
center**, and **global search** (messages / channels / people).

**Phase 2 (done):**

- **Group Chats** (`/messenger/groups`) — private `kind: "group"` channels with a
  fixed member set; create, member management, threads, files.
- **Project Channels** (`/messenger/projects`) — one private channel per PMS
  project, auto-provisioned and kept in sync. `src/lib/messenger/projects.ts`
  reconciles the channel + membership (project team + PM, mapped to Messenger
  accounts); PMS project / member server actions call `syncProjectChannel`
  best-effort and a throttled sweep is the backstop. The PMS project page links
  straight to its channel.
- **Shared Files hub** (`/messenger/files`) — every file in a channel / DM the
  caller can see, filterable by type + category, name search, paginated.
- **Message forwarding** — forward any message (body + attachments) into another
  channel or DM from the hover menu; the copy is labelled "Forwarded from …".

**Phase 3 (done):**

- **Announcements** (`/messenger/announcements`) — `super_admin` / `chat_admin` /
  `chat_hr` author; markdown composer with a formatting toolbar + live preview,
  image / file attachments, priority levels (normal / important / critical),
  audience targeting (everyone / by role / by **HRMS department** / by channel),
  schedule-for-later with a publish sweep, optional cross-post to `#announcement`,
  and per-recipient **read confirmation** with an author read-stats panel.
- **Meetings** (`/messenger/meetings`) — instant + scheduled meetings, invitees +
  RSVP, a linked group channel for meeting chat, "starting soon" reminders and an
  auto-end sweep.

**Phase 4 — Calling & Meeting System (done):**

Real WebRTC audio / video calling inside DMs, Group Chats and Channels, plus the
scheduled meetings from Phase 3, all sharing **one call room** at
`/messenger/call/[id]`.

- **Signaling over SSE** (no WS server needed). `src/lib/messenger/calls.ts` owns
  the `call_sessions` / `call_participants` / `call_history` / `screen_share_logs`
  / `call_notifications` collections + the lifecycle sweep. Offer/answer/ICE ride
  a dedicated fast per-call channel: `POST /api/messenger/calls/[id]/signal` +
  `GET /api/messenger/calls/[id]/signal-stream` (~350 ms poll, open only while in
  a call). `src/lib/messenger/webrtc-transport.ts` is a mesh `RTCPeerConnection`
  transport with perfect-negotiation; an SFU class drops in without touching the
  room or the API.
- **DM calls:** audio / video buttons in the DM header → the callee gets an
  **incoming-call popup** (WebAudio ringtone) with Accept / Decline. Missed /
  declined / ended calls leave a **call card in the conversation** with a
  Call-back button.
- **Group / Channel calls:** start from the header; group members ring, channel
  members see a **"Meeting in progress · Join"** banner. Invite more people
  mid-call.
- **In-call:** mute + mic device + noise suppression, camera + device + switch,
  **screen share** (screen / window / tab), **raise hand**, **emoji reactions**
  (fly-ups), **active-speaker** highlight, participants panel, **meeting chat**
  (the conversation's own messages), drag-drop file share, network-quality
  indicator, call timer, fullscreen. Glassmorphism floating control bar.
- **NAT:** STUN by default; set `MESSENGER_TURN_URL` / `_USERNAME` /
  `_CREDENTIAL` (see `.env.example`) for calls across arbitrary networks.
  `MESSENGER_CALL_MAX` caps mesh participants (default 12).
- A compact **"upcoming meetings"** widget on the Chat Dashboard. The Phase 3
  `/messenger/meetings/[id]/room` path now redirects into the unified call room.

**Later phases:** TMS batch discussion groups + HRMS department channels, group /
channel avatars, announcement templates, file version history, server-side call recording, SFU / webinar mode.

## External User Portal

`/portal` — the public front door for **external** people (job applicants,
interns, industrial-training students, clients). One portal, **four completely
different experiences**: the dashboard, sidebar, widgets, and available modules
are generated from the authenticated user's role (`job_applicant` | `intern` |
`trainee` | `client`) — not a shared UI with hidden sections. No company-internal
data is ever exposed.

- **Own identity store.** `external_users` (never `admin_users`) + session cookie
  `portal_session`. Passwords are scrypt-hashed. **Remember Me** → 30-day cookie;
  5 failed logins → 15-min lockout. **Self-registration**: a person registers
  with the exact email + phone they gave YashOrbit; `matchDomainRecord` finds the
  ERP record and derives the role. **Forgot password** re-verifies email + phone
  (no mailer in the repo, so that pair is the identity assertion).
- **Link + read live.** The account stores only auth + role + one link id
  (`applicationId` / `studentId` / `clientId`). All domain data is read live from
  the existing tables — `career_applications` + `hrms_offers` + `portal_interviews`
  (applicant), `training_students` + TMS libs (learner), `pms_clients` +
  `pms_projects` + milestones (client) — so staff changes appear instantly. New
  portal-only collections: `portal_sessions`, `portal_documents`,
  `external_notifications`, `portal_activity_logs`, `portal_interviews`.
- **RBAC.** Every page calls `guardPortalPage(...roles)` (redirects the wrong
  role home); data functions are keyed only by the caller's own link id.
  `/api/portal/download/[type]/[id]` is the one authed file gate (own shared doc,
  own résumé, or a document on one of the user's own projects).
- **Client Invoices / Meetings are derived** from PMS (the ERP has no
  client-facing invoicing): "invoiced" tracks milestone completion against an
  even split of each project's budget; "meetings" are upcoming milestone review
  and delivery dates.
- **Staff touch-point:** the LMS careers applicant page
  (`/lms/careers/applicants/[id]`) has an **Interview Schedule** section — slots
  added there show in the applicant's portal and fire a notification.
- **Demo accounts:** `node --env-file=.env scripts/seed-portal-demo.mjs` creates
  one account per role matched to seeded records and prints the credentials
  (password `Portal@2026`).

`/tms/me` (the staff-created TMS student portal) stays as-is; `/portal` is the
external front door onto the same `training_students` data.

### Lead Management drives the portal

`/lms/leads` — the staff hub that is the **single source of truth** for the
external portal. Every public website form submission
(`POST /api/careers/apply`, `POST /api/leads/[category]`) now:

1. writes its existing record (`career_applications` / `leads_*`), then
2. `provisionLeadAndAccount()` (`src/lib/lead-management/provision.ts`) creates a
   `lead_records` row + an `external_users` account with a temp password,
3. the route sets the `portal_session` cookie and returns a redirect — the
   visitor lands on their portal dashboard **already signed in** (temp password
   shown once via `sessionStorage` → `TempPasswordBanner`). A returning email
   gets a second lead attached to the same account (portal shows a lead
   switcher).

**Per-type lifecycles** are code-defined in
`src/lib/lead-management/workflows.ts` (`LEAD_WORKFLOWS`) — job applicant
(new → contacted → shortlisted → interview → technical → HR → selected → offer →
joined), intern, trainee, and client each get their own stages. Advancing a lead
in `/lms/leads/[id]` writes a `lead_timeline` event, notifies the portal, and
fires soft side-effects (e.g. "link a TMS student" reminder at `batch_assigned`).

The lead detail page is the control centre: **stage control, owner assignment,
Communication (internal notes vs portal-visible messages / document requests),
Interview schedule** (job leads — writes `portal_interviews` + notifies),
**Documents** (upload → `portal_documents` + notification), and **ERP links**
(paste a `training_students` / `pms_clients` id → the portal's deep TMS/PMS
widgets light up for that person). New portal-only collections:
`lead_records`, `lead_timeline`, `lead_messages`, `portal_counters`.

Portal side: `/portal/journey` (full vertical `lead_timeline`), `/portal/messages`
(staff→user thread), and every dashboard's hero stepper is now driven by the
lead's workflow. `scripts/seed-portal-demo.mjs` seeds a mid-workflow lead +
timeline per demo account.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



All 21 seeded accounts. Sign in at /hrms/login.

Code	Name	Email	Password	Roles	1st login
YO-0001	Yashika Singh	yashika.singh@yashorbit.com	Yashorbit@2026	super_admin + employee	ready
YO-0002	Priyanka Singh	priyanka.singh@yashorbit.com	Yashorbit@2026	employee	must change
YO-0003	Tej Pratap Singh	tej.pratap.singh@yashorbit.com	Yashorbit@2026	manager + employee	ready
YO-0004	Shikha Singh	shikha.singh@yashorbit.com	Yashorbit@2026	employee	must change
YO-0005	Pooja Singh	pooja.singh@yashorbit.com	Yashorbit@2026	hr + employee	ready
YO-0006	Arjun Mehta	arjun.mehta@yashorbit.com	Yashorbit@2026	manager + employee	ready
YO-0007	Ananya Sharma	ananya.sharma@yashorbit.com	Yashorbit@2026	employee	ready
YO-0008	Karan Kulkarni	karan.kulkarni@yashorbit.com	Yashorbit@2026	employee	ready
YO-0009	Kavya Nair	kavya.nair@yashorbit.com	Yashorbit@2026	employee	ready
YO-0010	Divya Reddy	divya.reddy@yashorbit.com	Yashorbit@2026	employee	must change
YO-0011	Meera Joshi	meera.joshi@yashorbit.com	Yashorbit@2026	employee	must change
YO-0012	Ritika Verma	ritika.verma@yashorbit.com	Yashorbit@2026	employee	must change
YO-0013	Sneha Iyer	sneha.iyer@yashorbit.com	Yashorbit@2026	employee	must change
YO-0014	Aditi Kapoor	aditi.kapoor@yashorbit.com	Yashorbit@2026	employee	must change
YO-0015	Rohan Malhotra	rohan.malhotra@yashorbit.com	Yashorbit@2026	manager + employee	ready
YO-0016	Nisha Agarwal	nisha.agarwal@yashorbit.com	Yashorbit@2026	employee	must change
YO-0017	Swati Bansal	swati.bansal@yashorbit.com	Yashorbit@2026	employee	must change
YO-0018	Rashmi Pillai	rashmi.pillai@yashorbit.com	Yashorbit@2026	employee	must change
YO-0019	Vikram Rao	vikram.rao@yashorbit.com	Yashorbit@2026	manager + employee	ready
YO-0020	Neha Chatterjee	neha.chatterjee@yashorbit.com	Yashorbit@2026	employee	must change
YO-0021	Pallavi Desai	pallavi.desai@yashorbit.com	Yashorbit@2026	employee	must change
ready → signs straight in. must change → redirected to /hrms/change-password on first login (set any new password to continue).
Staff/manager accounts land on /hrms; for their employee view open /hrms/me.
Re-running npm run hrms:seed-demo recreates all 21 and resets passwords back to Yashorbit@2026.



Staff panel — any existing super_admin account already has full TMS access, or:


npm run tms:grant     # enter your email, roles: super_admin  (or tms_admin)
then sign in at /tms/login.

Student portal — sign in at /tms/login with (shown at the end of the seed run):


aarav.verma.1@student.yashorbit.com   /   Yashorbit@2026
diya.reddy.2@student.yashorbit.com    /   Yashorbit@2026


npm run chat:grant     # Messenger  — prompts for email + roles, sets a password if new
npm run hrms:grant     # HRMS
npm run pms:grant      # PMS
npm run tms:grant      # TMS
npm run prms:grant     # PRMS


yashika.singh@yashorbit.com, priyanka.singh@…, tej.pratap.singh@…, shikha.singh@…, pooja.singh@…, arjun.mehta@…, ananya.sharma@…, karan.kulkarni@…, kavya.nair@…, divya.reddy@…, meera.joshi@…, ritika.verma@…, sneha.iyer@…, aditi.kapoor@…, rohan.malhotra@…, nisha.agarwal@…, swati.bansal@…, rashmi.pillai@…, vikram.rao@…, neha.chatterjee@…, pallavi.desai@yashorbit.com


Build is green (next build exit 0, all 20 /portal pages compiled) and the demo seeder ran. Here are the dummy portal accounts:

/portal demo logins
Sign in at /portal/login — password is the same for all four:

Role	Email	Password
Job Applicant	roberttaylor4@gmail.com	Portal@2026
Intern	rohan.reddy.37@example.com	Portal@2026
Trainee (Industrial Training)	aarav.verma.1@example.com	Portal@2026
Client	contact1@northwindretailgroup.com	Portal@2026
Each lands on a completely different dashboard + sidebar for its role. Login only needs email + password; RBAC then bounces any cross-role URL (e.g. the applicant hitting /portal/invoices) back to their own dashboard.

Phone numbers (only needed to test /portal/register or forgot-password, which verify email + phone):

Applicant 9396348440 · Intern 1981000259 · Trainee 1981000007 · Client 0521836562
The accounts are created by scripts/seed-portal-demo.mjs, matched live to existing seeded career_applications / training_students / pms_clients records — re-running it just resets their passwords. If a role's data looks thin, run the domain seeders first (seed-tms-demo.mjs, seed-pms-demo.mjs, seed-demo-data.mjs).