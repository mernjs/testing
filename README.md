This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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