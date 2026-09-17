#!/usr/bin/env node
/**
 * FMS demo seeder — Phase 1 + Phase 2 dataset for the Finance Management
 * System.
 *
 *   npm run fms:seed-demo
 *
 * DESTRUCTIVE for FMS data only. Wipes the `fms_*` collections it owns and
 * rebuilds them. Never touches leads / campaigns / chatbot / hrms_* / pms_* /
 * prms_* / tms_* / your admin accounts.
 *
 * Seeds the Chart of Accounts defaults, a spread of transactions across
 * every status and type, and (Phase 2) customer invoices with a spread of
 * statuses, receipts applied against them, and one credit note. When
 * `pms_clients` / `prms_vendors` already have data (e.g. after `npm run
 * pms:seed-demo` / `npm run prms:seed-demo`), records reference those real
 * customers/vendors so the FMS pages show real receivables/payables;
 * otherwise transactions are still seeded without a reference so the
 * dashboard isn't empty. A debit note is only seeded if a real PRMS vendor
 * bill (`prms_invoices`) already exists — never fabricated.
 *
 * After running, grant yourself access with `npm run fms:grant`
 * (roles: super_admin — or fms_admin) and sign in at /fms/login.
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const OWNED_COLLECTIONS = [
  "fms_transactions",
  "fms_accounts",
  "fms_activity_logs",
  "fms_counters",
  "fms_invoices",
  "fms_receipts",
  "fms_refunds",
  "fms_credit_notes",
  "fms_debit_notes",
];

const now = new Date();
function daysAgo(n) {
  return new Date(now.getTime() - n * 86400000);
}
function stamp(createdAt = now) {
  return { createdAt, updatedAt: createdAt, createdBy: null, updatedBy: null, deletedAt: null };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

const DEFAULT_ACCOUNTS = [
  { code: "1000", name: "Cash", type: "asset", description: "Petty cash and cash-in-hand accounts." },
  { code: "1010", name: "Bank", type: "asset", description: "Company bank accounts." },
  { code: "1100", name: "Accounts Receivable", type: "asset", description: "Amounts owed by customers." },
  { code: "1200", name: "Equipment", type: "asset", description: "Office and technical equipment." },
  { code: "1210", name: "Computers", type: "asset", description: "Laptops, desktops and peripherals." },
  { code: "1900", name: "Other Assets", type: "asset", description: "Miscellaneous assets." },
  { code: "2000", name: "Accounts Payable", type: "liability", description: "Amounts owed to vendors." },
  { code: "2100", name: "Payroll Payable", type: "liability", description: "Salaries and wages payable." },
  { code: "2200", name: "Tax Payable", type: "liability", description: "Taxes collected/owed." },
  { code: "2900", name: "Other Liabilities", type: "liability", description: "Miscellaneous liabilities." },
  { code: "4000", name: "Project Revenue", type: "income", description: "Revenue from client projects." },
  { code: "4100", name: "Training Revenue", type: "income", description: "Revenue from training & internship programs." },
  { code: "4200", name: "Consulting Revenue", type: "income", description: "Revenue from consulting engagements." },
  { code: "4900", name: "Other Income", type: "income", description: "Miscellaneous income." },
  { code: "5000", name: "Salaries", type: "expense", description: "Employee salaries and wages." },
  { code: "5100", name: "Infrastructure", type: "expense", description: "Servers, hosting, cloud infrastructure." },
  { code: "5200", name: "Software", type: "expense", description: "Software licenses and SaaS subscriptions." },
  { code: "5300", name: "Office", type: "expense", description: "Office supplies, rent, utilities." },
  { code: "5400", name: "Marketing", type: "expense", description: "Marketing and advertising spend." },
  { code: "5500", name: "Travel", type: "expense", description: "Business travel and accommodation." },
  { code: "5900", name: "Other Expenses", type: "expense", description: "Miscellaneous expenses." },
];

const INCOME_STATUSES = ["completed", "completed", "completed", "reconciled", "approved", "pending_approval", "processing"];
const EXPENSE_STATUSES = ["completed", "completed", "reconciled", "approved", "pending_approval", "processing", "scheduled"];
const OTHER_STATUSES = ["draft", "pending_approval", "approved", "rejected", "cancelled"];

const PAYMENT_METHODS = ["bank_transfer", "upi", "neft", "cheque", "credit_card", "cash"];

function pick(arr, i) {
  return arr[i % arr.length];
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-fms-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    console.log("Wiping FMS collections...");
    for (const name of OWNED_COLLECTIONS) {
      await db.collection(name).deleteMany({});
    }

    console.log("Seeding Chart of Accounts...");
    const accountDocs = DEFAULT_ACCOUNTS.map((a) => ({
      _id: randomUUID(),
      ...a,
      parentId: null,
      isActive: true,
      ...stamp(),
    }));
    await db.collection("fms_accounts").insertMany(accountDocs);
    const accountsByType = (type) => accountDocs.filter((a) => a.type === type);

    const clients = await db
      .collection("pms_clients")
      .find({ deletedAt: null }, { projection: { _id: 1, companyName: 1, "billing.currency": 1 } })
      .limit(20)
      .toArray();
    const vendors = await db
      .collection("prms_vendors")
      .find({ deletedAt: null }, { projection: { _id: 1, companyName: 1, currency: 1 } })
      .limit(20)
      .toArray();

    console.log(
      clients.length
        ? `Found ${clients.length} PMS client(s) — referencing them in income transactions.`
        : "No PMS clients found — run `npm run pms:seed-demo` first for a richer Customers page."
    );
    console.log(
      vendors.length
        ? `Found ${vendors.length} PRMS vendor(s) — referencing them in expense transactions.`
        : "No PRMS vendors found — run `npm run prms:seed-demo` first for a richer Vendors page."
    );

    console.log("Seeding transactions...");
    const counters = db.collection("fms_counters");
    async function nextTxnNumber(year) {
      const key = `TXN_${year}`;
      const res = await counters.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
      return `TXN-${year}-${String(res.seq).padStart(6, "0")}`;
    }

    const incomeAccounts = accountsByType("income");
    const expenseAccounts = accountsByType("expense");
    const txns = [];

    // Income transactions — against real clients where available.
    for (let i = 0; i < 18; i++) {
      const daysBack = i * 9 + 2;
      const date = daysAgo(daysBack);
      const amount = round2(35000 + (i % 7) * 18500 + (i * 137) % 4300);
      const status = pick(INCOME_STATUSES, i);
      const client = clients.length ? clients[i % clients.length] : null;
      txns.push({
        _id: randomUUID(),
        transactionNumber: await nextTxnNumber(date.getFullYear()),
        type: "income",
        transactionDate: date,
        postingDate: date,
        amount,
        currency: client?.billing?.currency || "INR",
        paymentMethod: pick(PAYMENT_METHODS, i),
        sourceModule: "fms",
        sourceRecordId: null,
        customerId: client?._id ?? null,
        vendorId: null,
        employeeId: null,
        projectId: null,
        department: null,
        accountId: pick(incomeAccounts, i)._id,
        taxAmount: round2(amount * 0.18),
        referenceNumber: `REF-INC-${1000 + i}`,
        description: client ? `Milestone payment — ${client.companyName}` : "Client payment",
        attachments: [],
        approvedBy: status === "draft" || status === "pending_approval" ? null : "seed-script",
        approvedAt: status === "draft" || status === "pending_approval" ? null : date,
        status,
        ...stamp(date),
      });
    }

    // Expense transactions — against real vendors where available.
    for (let i = 0; i < 22; i++) {
      const daysBack = i * 7 + 4;
      const date = daysAgo(daysBack);
      const amount = round2(4500 + (i % 9) * 3200 + (i * 89) % 2100);
      const status = pick(EXPENSE_STATUSES, i);
      const vendor = vendors.length ? vendors[i % vendors.length] : null;
      txns.push({
        _id: randomUUID(),
        transactionNumber: await nextTxnNumber(date.getFullYear()),
        type: "expense",
        transactionDate: date,
        postingDate: date,
        amount,
        currency: vendor?.currency || "INR",
        paymentMethod: pick(PAYMENT_METHODS, i + 2),
        sourceModule: "fms",
        sourceRecordId: null,
        customerId: null,
        vendorId: vendor?._id ?? null,
        employeeId: null,
        projectId: null,
        department: pick(["Engineering", "Operations", "Marketing", "Human Resources"], i),
        accountId: pick(expenseAccounts, i)._id,
        taxAmount: round2(amount * 0.18),
        referenceNumber: `REF-EXP-${2000 + i}`,
        description: vendor ? `Payment to ${vendor.companyName}` : "Operational expense",
        attachments: [],
        approvedBy: status === "draft" || status === "pending_approval" ? null : "seed-script",
        approvedAt: status === "draft" || status === "pending_approval" ? null : date,
        status,
        ...stamp(date),
      });
    }

    // A handful of transfers / adjustments in various states.
    for (let i = 0; i < 6; i++) {
      const date = daysAgo(i * 15 + 3);
      const type = i % 2 === 0 ? "transfer" : "adjustment";
      const status = pick(OTHER_STATUSES, i);
      const amount = round2(8000 + i * 2450);
      txns.push({
        _id: randomUUID(),
        transactionNumber: await nextTxnNumber(date.getFullYear()),
        type,
        transactionDate: date,
        postingDate: date,
        amount,
        currency: "INR",
        paymentMethod: pick(PAYMENT_METHODS, i),
        sourceModule: "fms",
        sourceRecordId: null,
        customerId: null,
        vendorId: null,
        employeeId: null,
        projectId: null,
        department: null,
        accountId: null,
        taxAmount: 0,
        referenceNumber: `REF-ADJ-${3000 + i}`,
        description: type === "transfer" ? "Inter-account transfer" : "Manual adjustment entry",
        attachments: [],
        approvedBy: status === "draft" || status === "pending_approval" ? null : "seed-script",
        approvedAt: status === "draft" || status === "pending_approval" ? null : date,
        status,
        ...stamp(date),
      });
    }

    await db.collection("fms_transactions").insertMany(txns);

    // ------------------------------------------------------------------
    // Phase 2: Invoices, Receipts, Credit Notes (customer side)
    // ------------------------------------------------------------------
    console.log("Seeding invoices, receipts and a credit note...");
    async function nextYearNumber(prefix, year) {
      const key = `${prefix}_${year}`;
      const res = await counters.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
      return `${prefix}-${year}-${String(res.seq).padStart(6, "0")}`;
    }

    function priceItems(items, discount) {
      const priced = items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: round2(it.unitPrice),
        taxRate: it.taxRate,
        lineTotal: round2(it.quantity * it.unitPrice),
        taxAmount: 0,
      }));
      const subtotal = round2(priced.reduce((s, it) => s + it.lineTotal, 0));
      const disc = round2(Math.min(discount, subtotal));
      const taxableAmount = round2(subtotal - disc);
      const ratio = subtotal > 0 ? taxableAmount / subtotal : 0;
      let taxAmount = 0;
      for (const it of priced) {
        it.taxAmount = round2(it.lineTotal * ratio * (it.taxRate / 100));
        taxAmount += it.taxAmount;
      }
      taxAmount = round2(taxAmount);
      return { items: priced, subtotal, discount: disc, taxableAmount, taxAmount, totalAmount: round2(taxableAmount + taxAmount) };
    }

    const INVOICE_PLANS = [
      { statusIdx: 0, daysAgo: 45, dueInDays: 30, status: "paid", paidFraction: 1 },
      { statusIdx: 1, daysAgo: 20, dueInDays: 30, status: "partially_paid", paidFraction: 0.4 },
      { statusIdx: 2, daysAgo: 10, dueInDays: 30, status: "sent", paidFraction: 0 },
      { statusIdx: 3, daysAgo: 60, dueInDays: 20, status: "overdue", paidFraction: 0 },
      { statusIdx: 4, daysAgo: 5, dueInDays: 30, status: "draft", paidFraction: 0 },
    ];

    const invoiceDocs = [];
    const receiptDocs = [];
    let creditNoteDoc = null;

    for (let i = 0; i < INVOICE_PLANS.length; i++) {
      const plan = INVOICE_PLANS[i];
      const client = clients.length ? clients[plan.statusIdx % clients.length] : null;
      const invoiceDate = daysAgo(plan.daysAgo);
      const dueDate = new Date(invoiceDate.getTime() + plan.dueInDays * 86400000);
      const year = invoiceDate.getFullYear();
      const priced = priceItems(
        [
          { description: "Project milestone delivery", quantity: 1, unitPrice: 85000 + i * 12000, taxRate: 18 },
          { description: "Support & maintenance (monthly)", quantity: 1, unitPrice: 15000, taxRate: 18 },
        ],
        i === 1 ? 2000 : 0
      );
      const amountPaid = round2(priced.totalAmount * plan.paidFraction);
      const invoiceId = randomUUID();
      const invoiceNumber = await nextYearNumber("INV", year);
      const invoice = {
        _id: invoiceId,
        invoiceNumber,
        customerId: client?._id ?? null,
        customerName: client?.companyName ?? "Walk-in Customer",
        projectId: null,
        invoiceDate: invoiceDate.toISOString().slice(0, 10),
        dueDate: dueDate.toISOString().slice(0, 10),
        items: priced.items,
        discount: priced.discount,
        subtotal: priced.subtotal,
        taxAmount: priced.taxAmount,
        totalAmount: priced.totalAmount,
        amountPaid,
        amountCredited: 0,
        currency: client?.billing?.currency || "INR",
        paymentTerms: "Net 30",
        poNumber: null,
        status: plan.status,
        notes: null,
        ...stamp(invoiceDate),
      };
      invoiceDocs.push(invoice);

      if (amountPaid > 0) {
        const receiptDate = new Date(invoiceDate.getTime() + 5 * 86400000);
        const receiptId = randomUUID();
        receiptDocs.push({
          _id: receiptId,
          receiptNumber: await nextYearNumber("REC", receiptDate.getFullYear()),
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          receiptDate,
          amount: amountPaid,
          method: "bank_transfer",
          transactionReference: `UTR${1000 + i}`,
          allocations: [{ invoiceId, invoiceNumber, amount: amountPaid }],
          advanceAmount: 0,
          currency: invoice.currency,
          status: "completed",
          transactionId: null,
          notes: null,
          ...stamp(receiptDate),
        });
      }

      // One credit note against the "sent" invoice — a small discount correction.
      if (plan.status === "sent" && !creditNoteDoc) {
        const creditAmount = round2(priced.totalAmount * 0.05);
        creditNoteDoc = {
          _id: randomUUID(),
          creditNoteNumber: await nextYearNumber("CRN", year),
          invoiceId,
          invoiceNumber,
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          amount: creditAmount,
          reason: "Post-delivery discount adjustment",
          status: "issued",
          issuedAt: invoiceDate,
          ...stamp(invoiceDate),
        };
        invoice.amountCredited = creditAmount;
      }
    }

    await db.collection("fms_invoices").insertMany(invoiceDocs);
    if (receiptDocs.length) await db.collection("fms_receipts").insertMany(receiptDocs);
    if (creditNoteDoc) await db.collection("fms_credit_notes").insertOne(creditNoteDoc);

    // ------------------------------------------------------------------
    // Phase 2: Debit Note (vendor side) — only if a real PRMS bill exists.
    // ------------------------------------------------------------------
    let debitNoteCount = 0;
    const realBill = await db.collection("prms_invoices").findOne({ deletedAt: null });
    if (realBill) {
      await db.collection("fms_debit_notes").insertOne({
        _id: randomUUID(),
        debitNoteNumber: await nextYearNumber("DBN", now.getFullYear()),
        billId: realBill._id,
        billNumber: realBill.invoiceNumber,
        vendorId: realBill.vendorId,
        vendorName: realBill.vendorName,
        amount: round2(realBill.totalAmount * 0.03),
        reason: "Freight & handling adjustment",
        status: "issued",
        issuedAt: now,
        ...stamp(now),
      });
      debitNoteCount = 1;
      console.log(`Seeded 1 debit note against real PRMS bill ${realBill.invoiceNumber}.`);
    } else {
      console.log("No PRMS vendor bills found — skipped seeding a debit note (never fabricated).");
    }

    console.log(
      `\nSeeded ${accountDocs.length} accounts, ${txns.length} transactions, ${invoiceDocs.length} invoices, ` +
        `${receiptDocs.length} receipts, ${creditNoteDoc ? 1 : 0} credit note, ${debitNoteCount} debit note.`
    );
    console.log("Grant yourself access with `npm run fms:grant` (role: super_admin or fms_admin), then sign in at /fms/login.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
