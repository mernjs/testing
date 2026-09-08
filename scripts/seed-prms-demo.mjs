#!/usr/bin/env node
/**
 * PRMS demo seeder — one internally-consistent dataset for the Procurement &
 * Expense Management System.
 *
 *   npm run prms:seed-demo
 *
 * DESTRUCTIVE for PRMS data only. Wipes the `prms_*` collections it owns and
 * rebuilds them. Never touches leads / campaigns / chatbot / hrms_* / pms_* /
 * tms_* / your admin accounts.
 *
 * Phase 1 seeds vendors + purchase requisitions (every workflow state) + the
 * settings document. Later phases extend this with POs, expenses, assets, etc.
 *
 * After running, grant yourself access with `npm run prms:grant`
 * (roles: super_admin  — or  prms_admin) and sign in at /prms/login.
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const OWNED_COLLECTIONS = [
  "prms_vendors",
  "prms_requisitions",
  "prms_rfqs",
  "prms_purchase_orders",
  "prms_goods_receipts",
  "prms_expenses",
  "prms_assets",
  "prms_asset_assignments",
  "prms_inventory_items",
  "prms_inventory_transactions",
  "prms_infrastructure",
  "prms_software_subscriptions",
  "prms_third_party_services",
  "prms_contracts",
  "prms_invoices",
  "prms_payments",
  "prms_budgets",
  "prms_activity_logs",
  "prms_notifications",
  "prms_counters",
  "prms_settings",
  "prms_meta",
];

const now = new Date();
function daysAgo(n) {
  return new Date(now.getTime() - n * 86400000);
}
function daysAhead(n) {
  return new Date(now.getTime() + n * 86400000);
}
function iso(d) {
  return d.toISOString().slice(0, 10);
}
function stamp(createdAt = now) {
  return { createdAt, updatedAt: createdAt, createdBy: null, updatedBy: null, deletedAt: null };
}
function pad(n, w = 4) {
  return String(n).padStart(w, "0");
}

const VENDORS = [
  { companyName: "Dell Technologies India Pvt Ltd", category: "hardware_supplier", city: "Bengaluru", state: "Karnataka", gstin: "29AABCD1234E1Z5", pan: "AABCD1234E", contactPerson: "Rohit Mehra", email: "rohit.mehra@dell.example", phone: "+91 98450 11223", paymentTerms: "net_30", rating: 4.5 },
  { companyName: "Redington India Ltd", category: "hardware_supplier", city: "Chennai", state: "Tamil Nadu", gstin: "33AAACR4849R1ZL", pan: "AAACR4849R", contactPerson: "Priya Nair", email: "priya.nair@redington.example", phone: "+91 90031 44556", paymentTerms: "net_45", rating: 4.1 },
  { companyName: "Amazon Web Services India", category: "cloud_provider", city: "Mumbai", state: "Maharashtra", gstin: "27AAICA3918J1ZS", pan: "AAICA3918J", contactPerson: "Karan Shah", email: "aws-billing@amazon.example", phone: "+91 22 6100 0000", paymentTerms: "net_15", rating: 4.7 },
  { companyName: "OpenAI LLC", category: "software_vendor", city: "San Francisco", state: "CA", contactPerson: "Billing Desk", email: "billing@openai.example", paymentTerms: "advance", currency: "USD", rating: 4.8 },
  { companyName: "Atlassian Pty Ltd", category: "software_vendor", city: "Sydney", state: "NSW", contactPerson: "Accounts", email: "accounts@atlassian.example", paymentTerms: "net_30", currency: "USD", rating: 4.4 },
  { companyName: "Bharti Airtel Ltd", category: "internet_provider", city: "Gurugram", state: "Haryana", gstin: "06AAACB2894G1ZW", pan: "AAACB2894G", contactPerson: "Enterprise Support", email: "enterprise@airtel.example", phone: "+91 124 4222222", paymentTerms: "net_15", rating: 3.9 },
  { companyName: "Featherlite Furniture", category: "furniture_vendor", city: "Bengaluru", state: "Karnataka", gstin: "29AABCF7777H1Z2", pan: "AABCF7777H", contactPerson: "Suresh Kumar", email: "sales@featherlite.example", phone: "+91 80 4123 4567", paymentTerms: "net_30", rating: 4.0 },
  { companyName: "Office Beam Supplies", category: "office_supplier", city: "Pune", state: "Maharashtra", gstin: "27AAECO1234F1Z9", pan: "AAECO1234F", contactPerson: "Meena Joshi", email: "orders@officebeam.example", phone: "+91 20 2567 8900", paymentTerms: "net_15", rating: 3.7 },
  { companyName: "TeamLease Services Ltd", category: "recruitment_agency", city: "Bengaluru", state: "Karnataka", gstin: "29AABCT1728P1ZE", pan: "AABCT1728P", contactPerson: "Anil Verma", email: "hiring@teamlease.example", phone: "+91 80 3300 1000", paymentTerms: "net_45", rating: 4.2 },
  { companyName: "Webenza Digital", category: "marketing_agency", city: "Bengaluru", state: "Karnataka", gstin: "29AAFCW9012K1Z1", pan: "AAFCW9012K", contactPerson: "Divya Rao", email: "hello@webenza.example", phone: "+91 80 4200 5000", paymentTerms: "net_30", rating: 4.3 },
  { companyName: "S. R. Batliboi & Associates", category: "consultant", city: "Mumbai", state: "Maharashtra", gstin: "27AAAFS1234M1ZP", pan: "AAAFS1234M", contactPerson: "CA Ramesh Iyer", email: "ramesh.iyer@srb.example", phone: "+91 22 6192 0000", paymentTerms: "net_30", rating: 4.6 },
  { companyName: "Blue Star Ltd (AMC)", category: "amc_vendor", city: "Mumbai", state: "Maharashtra", gstin: "27AAACB0000C1ZK", pan: "AAACB0000C", contactPerson: "Service Desk", email: "amc@bluestar.example", phone: "+91 22 6668 4000", paymentTerms: "net_60", rating: 3.8 },
];

const DEPARTMENTS_FALLBACK = [
  { _id: "seed-dept-eng", name: "Engineering" },
  { _id: "seed-dept-ops", name: "Operations" },
  { _id: "seed-dept-mkt", name: "Marketing" },
  { _id: "seed-dept-hr", name: "Human Resources" },
  { _id: "seed-dept-fin", name: "Finance" },
];

const REQ_TEMPLATES = [
  { itemName: "Dell Latitude 5450 laptops", category: "office_operations", subcategory: "Office Equipment", quantity: 5, uom: "units", estimatedCost: 425000, priority: "high", status: "approved" },
  { itemName: "Ergonomic office chairs", category: "office_operations", subcategory: "Furniture", quantity: 12, uom: "pcs", estimatedCost: 144000, priority: "medium", status: "manager_approval" },
  { itemName: "AWS reserved instances top-up", category: "infrastructure", subcategory: "Cloud Hosting", quantity: 1, uom: "months", estimatedCost: 180000, priority: "high", status: "procurement_review" },
  { itemName: "OpenAI API annual commitment", category: "software_saas", subcategory: "OpenAI", quantity: 1, uom: "years", estimatedCost: 600000, priority: "urgent", status: "procurement_review" },
  { itemName: "A4 printer paper (annual)", category: "office_operations", subcategory: "Stationery", quantity: 200, uom: "reams", estimatedCost: 60000, priority: "low", status: "approved" },
  { itemName: "LinkedIn Recruiter seats", category: "professional_services", subcategory: "Recruitment", quantity: 3, uom: "seats", estimatedCost: 270000, priority: "medium", status: "submitted" },
  { itemName: "Meeting room 65\" displays", category: "office_operations", subcategory: "Office Equipment", quantity: 4, uom: "units", estimatedCost: 320000, priority: "medium", status: "manager_approval" },
  { itemName: "Figma organization plan", category: "software_saas", subcategory: "Figma", quantity: 25, uom: "licenses", estimatedCost: 225000, priority: "medium", status: "approved" },
  { itemName: "Pantry supplies restock", category: "office_operations", subcategory: "Pantry", quantity: 1, uom: "sets", estimatedCost: 35000, priority: "low", status: "draft" },
  { itemName: "Annual statutory audit engagement", category: "professional_services", subcategory: "CA", quantity: 1, uom: "units", estimatedCost: 450000, priority: "high", status: "approved" },
  { itemName: "Office AC servicing AMC renewal", category: "office_operations", subcategory: "Office Equipment", quantity: 1, uom: "years", estimatedCost: 90000, priority: "medium", status: "rejected" },
  { itemName: "Google Ads quarterly budget", category: "marketing", subcategory: "Google Ads", quantity: 1, uom: "months", estimatedCost: 300000, priority: "high", status: "converted" },
  { itemName: "Backup storage expansion", category: "infrastructure", subcategory: "Backup Storage", quantity: 1, uom: "units", estimatedCost: 120000, priority: "medium", status: "submitted" },
  { itemName: "New hire welcome kits", category: "others", subcategory: "Miscellaneous", quantity: 20, uom: "sets", estimatedCost: 40000, priority: "low", status: "draft" },
  { itemName: "Leased line bandwidth upgrade", category: "office_operations", subcategory: "Internet", quantity: 1, uom: "months", estimatedCost: 75000, priority: "high", status: "manager_approval" },
];

function buildApprovals(status, threshold, cost) {
  const chain = [
    { level: 1, status: "manager_approval", role: "dept_manager", label: "Department Manager", decision: "pending", approverId: null, approverEmail: null, note: null, decidedAt: null },
  ];
  if (cost >= threshold) {
    chain.push({ level: 2, status: "procurement_review", role: "procurement_manager", label: "Procurement Review", decision: "pending", approverId: null, approverEmail: null, note: null, decidedAt: null });
  }

  const order = ["draft", "submitted", "manager_approval", "procurement_review", "approved", "converted"];
  const idx = order.indexOf(status);

  if (status === "draft" || status === "submitted") return { approvals: status === "submitted" ? chain : [], currentLevel: status === "submitted" ? 1 : 0 };

  if (status === "rejected") {
    chain[0] = { ...chain[0], decision: "rejected", approverEmail: "manager@yashorbit.example", note: "Deferred to next quarter — budget constraints.", decidedAt: daysAgo(3) };
    return { approvals: chain, currentLevel: 1, rejectionReason: "Deferred to next quarter — budget constraints." };
  }

  // manager_approval / procurement_review / approved / converted
  const approvals = chain.map((step) => {
    const stepDone = order.indexOf(step.status) < idx || status === "approved" || status === "converted";
    if (stepDone) {
      return { ...step, decision: "approved", approverEmail: step.level === 1 ? "manager@yashorbit.example" : "procurement@yashorbit.example", note: null, decidedAt: daysAgo(2) };
    }
    return step;
  });
  let currentLevel = 0;
  if (status === "manager_approval") currentLevel = 1;
  else if (status === "procurement_review") currentLevel = 2;
  return { approvals, currentLevel };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-prms-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    for (const name of OWNED_COLLECTIONS) {
      await db.collection(name).deleteMany({});
    }
    console.log(`Cleared ${OWNED_COLLECTIONS.length} PRMS collections.`);

    // Departments: prefer real HRMS departments, else fall back to seeded ids.
    let departments = await db
      .collection("hrms_departments")
      .find({ deletedAt: null }, { projection: { name: 1 } })
      .limit(6)
      .toArray();
    if (departments.length === 0) departments = DEPARTMENTS_FALLBACK;
    console.log(`Using ${departments.length} department(s) for requisitions.`);

    // Settings
    await db.collection("prms_settings").insertOne({
      _id: "config",
      defaultCurrency: "INR",
      procurementReviewThreshold: 50000,
      financeNotifyThreshold: 200000,
      itemSuggestions: [
        "Laptop", "Desktop", "Monitor", "Office chair", "Printer paper", "Whiteboard markers",
        "AWS credits", "OpenAI API credits", "Figma licenses", "LinkedIn Recruiter seats",
      ],
      company: {
        name: "YashOrbit Technologies Pvt Ltd",
        addressLine: "4th Floor, Prestige Tech Park, Marathahalli",
        city: "Bengaluru",
        gstin: "29AABCY1234Q1ZX",
        pan: "AABCY1234Q",
        email: "accounts@yashorbit.com",
        phone: "+91 80 4718 2200",
        website: "https://www.yashorbit.com",
        signatoryName: "Procurement Head",
        signatoryTitle: "Procurement Head",
      },
      updatedAt: now,
      updatedBy: null,
    });

    // Vendors
    const vendorDocs = VENDORS.map((v, i) => ({
      _id: randomUUID(),
      vendorCode: `VEN-${pad(i + 1)}`,
      companyName: v.companyName,
      gstin: v.gstin ?? null,
      pan: v.pan ?? null,
      contactPerson: v.contactPerson ?? null,
      email: v.email ?? null,
      phone: v.phone ?? null,
      addressLine: null,
      city: v.city ?? null,
      state: v.state ?? null,
      pincode: null,
      bankDetails: { accountName: v.companyName, accountNumber: `00${1000 + i}${2000 + i}`, ifsc: "HDFC0000123", bankName: "HDFC Bank", branch: v.city ?? null },
      paymentTerms: v.paymentTerms ?? "net_30",
      currency: v.currency ?? "INR",
      category: v.category,
      rating: v.rating ?? null,
      status: "active",
      notes: null,
      ...stamp(daysAgo(120 - i * 3)),
    }));
    await db.collection("prms_vendors").insertMany(vendorDocs);
    console.log(`Inserted ${vendorDocs.length} vendors.`);

    // Requisitions
    const reqDocs = REQ_TEMPLATES.map((t, i) => {
      const dept = departments[i % departments.length];
      const createdAt = daysAgo(45 - i * 2);
      const { approvals, currentLevel, rejectionReason } = buildApprovals(t.status, 50000, t.estimatedCost);
      const submittedAt = t.status === "draft" ? null : daysAgo(40 - i * 2);
      const approvedAt = ["approved", "converted"].includes(t.status) ? daysAgo(30 - i) : null;
      const preferredVendor =
        vendorDocs.find((v) =>
          t.category === "software_saas"
            ? v.category === "software_vendor"
            : t.category === "infrastructure"
              ? v.category === "cloud_provider"
              : t.category === "marketing"
                ? v.category === "marketing_agency"
                : t.category === "professional_services"
                  ? v.category === "consultant" || v.category === "recruitment_agency"
                  : v.category === "hardware_supplier" || v.category === "office_supplier"
        ) ?? null;

      return {
        _id: randomUUID(),
        prCode: `PR-${pad(i + 1)}`,
        departmentId: dept._id,
        departmentName: dept.name,
        projectId: null,
        projectName: null,
        requestedBy: {
          userId: `seed-user-${(i % 4) + 1}`,
          employeeId: null,
          name: ["Aisha Khan", "Vikram Rao", "Neha Gupta", "Sanjay Patel"][i % 4],
          email: ["aisha.khan", "vikram.rao", "neha.gupta", "sanjay.patel"][i % 4] + "@yashorbit.example",
        },
        category: t.category,
        subcategory: t.subcategory,
        itemName: t.itemName,
        quantity: t.quantity,
        uom: t.uom,
        estimatedCost: t.estimatedCost,
        currency: "INR",
        requiredDate: iso(daysAhead(15 + i * 3)),
        priority: t.priority,
        justification: `Required for ${dept.name} operations. Raised via the demo seeder.`,
        attachments: [],
        preferredVendorId: preferredVendor ? preferredVendor._id : null,
        status: t.status,
        currentLevel,
        approvals,
        rejectionReason: rejectionReason ?? null,
        submittedAt,
        approvedAt,
        ...stamp(createdAt),
      };
    });
    await db.collection("prms_requisitions").insertMany(reqDocs);
    console.log(`Inserted ${reqDocs.length} requisitions.`);

    const round2 = (n) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
    const vById = (predicate) => vendorDocs.find(predicate);
    const hwVendor = vById((v) => v.category === "hardware_supplier");
    const cloudVendor = vById((v) => v.category === "cloud_provider");
    const swVendor = vById((v) => v.category === "software_vendor");
    const officeVendor = vById((v) => v.category === "office_supplier");
    const amcVendor = vById((v) => v.category === "amc_vendor");

    // ---- Purchase Orders + GRNs -------------------------------------------
    function priceItems(items, discount = 0) {
      const priced = items.map((it) => ({
        description: it.description,
        hsn: null,
        quantity: it.quantity,
        uom: it.uom || "pcs",
        unitPrice: round2(it.unitPrice),
        gstRate: it.gstRate ?? 18,
        lineTotal: round2(it.quantity * it.unitPrice),
        gstAmount: 0,
        receivedQty: it.receivedQty ?? 0,
      }));
      const subtotal = round2(priced.reduce((s, it) => s + it.lineTotal, 0));
      const taxable = round2(subtotal - discount);
      const ratio = subtotal > 0 ? taxable / subtotal : 0;
      let gstAmount = 0;
      for (const it of priced) {
        it.gstAmount = round2(it.lineTotal * ratio * (it.gstRate / 100));
        gstAmount += it.gstAmount;
      }
      gstAmount = round2(gstAmount);
      return { items: priced, subtotal, discount, taxableAmount: taxable, gstAmount, totalAmount: round2(taxable + gstAmount) };
    }

    const poSpecs = [
      { vendor: hwVendor, status: "received", dept: departments[0], items: [{ description: "Dell Latitude 5450 laptop", quantity: 5, uom: "units", unitPrice: 85000, receivedQty: 5 }] },
      { vendor: officeVendor, status: "partially_received", dept: departments[1], items: [{ description: "Ergonomic office chair", quantity: 12, uom: "pcs", unitPrice: 12000, receivedQty: 6 }] },
      { vendor: hwVendor, status: "issued", dept: departments[0], items: [{ description: "27\" 4K monitor", quantity: 8, uom: "units", unitPrice: 32000 }] },
      { vendor: swVendor, status: "draft", dept: departments[2], items: [{ description: "Figma organization seats", quantity: 25, uom: "licenses", unitPrice: 9000, gstRate: 18 }] },
    ];
    const poDocs = poSpecs.map((spec, i) => {
      const priced = priceItems(spec.items);
      const createdAt = daysAgo(30 - i * 4);
      return {
        _id: randomUUID(),
        poNumber: `PO-${pad(i + 1)}`,
        vendorId: spec.vendor._id,
        vendorName: spec.vendor.companyName,
        requisitionId: null,
        rfqId: null,
        departmentId: spec.dept._id,
        departmentName: spec.dept.name,
        projectId: null,
        projectName: null,
        ...priced,
        currency: "INR",
        deliveryAddress: "Prestige Tech Park, Bengaluru",
        deliveryDate: iso(daysAhead(10 + i * 3)),
        paymentTerms: spec.vendor.paymentTerms,
        notes: null,
        status: spec.status,
        issuedAt: spec.status === "draft" ? null : createdAt,
        ...stamp(createdAt),
      };
    });
    await db.collection("prms_purchase_orders").insertMany(poDocs);
    console.log(`Inserted ${poDocs.length} purchase orders.`);

    const grnDocs = [];
    poDocs.forEach((po, i) => {
      if (po.status !== "received" && po.status !== "partially_received") return;
      const items = po.items.map((it, idx) => ({
        itemIndex: idx,
        description: it.description,
        orderedQty: it.quantity,
        previouslyReceived: 0,
        receivedQty: it.receivedQty,
        acceptedQty: it.receivedQty,
        rejectedQty: 0,
        remarks: null,
      }));
      grnDocs.push({
        _id: randomUUID(),
        grnNumber: `GRN-${pad(grnDocs.length + 1)}`,
        poId: po._id,
        poNumber: po.poNumber,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        items,
        warehouseLocation: "HO Store",
        receivedDate: iso(daysAgo(20 - i * 3)),
        qualityChecked: true,
        remarks: null,
        status: po.status === "received" ? "accepted" : "partially_accepted",
        ...stamp(daysAgo(20 - i * 3)),
      });
    });
    if (grnDocs.length) await db.collection("prms_goods_receipts").insertMany(grnDocs);
    console.log(`Inserted ${grnDocs.length} goods receipts.`);

    // ---- Expenses (one-time + recurring) --------------------------------
    const expenseSpecs = [
      { category: "software_saas", sub: "AWS", vendor: cloudVendor, amount: 145000, status: "approved", type: "recurring", interval: "monthly", daysBack: 12 },
      { category: "software_saas", sub: "OpenAI", vendor: swVendor, amount: 62000, status: "approved", type: "recurring", interval: "monthly", daysBack: 9 },
      { category: "office_operations", sub: "Electricity", vendor: null, amount: 48000, status: "approved", type: "recurring", interval: "monthly", daysBack: 6 },
      { category: "office_operations", sub: "Pantry", vendor: officeVendor, amount: 22000, status: "pending", type: "one_time", daysBack: 3 },
      { category: "marketing", sub: "Google Ads", vendor: null, amount: 180000, status: "approved", type: "one_time", daysBack: 20 },
      { category: "professional_services", sub: "CA", vendor: null, amount: 90000, status: "reimbursed", type: "one_time", daysBack: 40 },
      { category: "infrastructure", sub: "Backup Storage", vendor: cloudVendor, amount: 15000, status: "pending", type: "one_time", daysBack: 2 },
      { category: "others", sub: "Travel", vendor: null, amount: 34000, status: "rejected", type: "one_time", daysBack: 15 },
    ];
    const expenseDocs = expenseSpecs.map((e, i) => {
      const gstRate = 18;
      const gstAmount = round2(e.amount * (gstRate / 100));
      const d = daysAgo(e.daysBack);
      const dept = departments[i % departments.length];
      return {
        _id: randomUUID(),
        expenseCode: `EXP-${pad(i + 1)}`,
        category: e.category,
        subcategory: e.sub,
        vendorId: e.vendor ? e.vendor._id : null,
        vendorName: e.vendor ? e.vendor.companyName : null,
        departmentId: dept._id,
        departmentName: dept.name,
        projectId: null,
        projectName: null,
        amount: round2(e.amount),
        gstRate,
        gstAmount,
        totalAmount: round2(e.amount + gstAmount),
        currency: "INR",
        paymentMethod: "bank_transfer",
        invoiceNumber: `V-INV-${1000 + i}`,
        invoiceStorageKey: null,
        invoiceFilename: null,
        expenseDate: d,
        description: `${e.sub} — seeded demo expense`,
        expenseType: e.type,
        recurrence: e.type === "recurring" ? { interval: e.interval, nextRunDate: iso(daysAhead(20)), active: true } : null,
        parentExpenseId: null,
        approvalStatus: e.status,
        approvedBy: ["approved", "reimbursed"].includes(e.status) ? null : null,
        approvedAt: ["approved", "reimbursed"].includes(e.status) ? daysAgo(e.daysBack - 1) : null,
        rejectionReason: e.status === "rejected" ? "Out of policy — book via travel desk." : null,
        raisedByUserId: `seed-user-${(i % 4) + 1}`,
        raisedByName: ["Aisha Khan", "Vikram Rao", "Neha Gupta", "Sanjay Patel"][i % 4],
        ...stamp(d),
      };
    });
    await db.collection("prms_expenses").insertMany(expenseDocs);
    console.log(`Inserted ${expenseDocs.length} expenses.`);

    // ---- Assets --------------------------------------------------------
    const assetSpecs = [
      { name: "MacBook Pro 14 M3", category: "Laptop", cost: 185000, method: "wdv", life: 4, status: "assigned", emp: 0 },
      { name: "Dell Latitude 5450", category: "Laptop", cost: 85000, method: "slm", life: 4, status: "assigned", emp: 1 },
      { name: "Dell UltraSharp 27\"", category: "Monitor", cost: 32000, method: "slm", life: 5, status: "in_stock" },
      { name: "HP LaserJet Pro", category: "Printer", cost: 28000, method: "slm", life: 5, status: "under_repair" },
      { name: "Cisco Catalyst Switch", category: "Switch", cost: 120000, method: "slm", life: 6, status: "in_stock" },
      { name: "APC UPS 3KVA", category: "UPS", cost: 45000, method: "wdv", life: 5, status: "in_stock" },
    ];
    const assetDocs = [];
    const assignmentDocs = [];
    assetSpecs.forEach((a, i) => {
      const purchaseDate = daysAgo(300 - i * 20);
      const ageYears = Math.max((now - purchaseDate) / (365.25 * 86400000), 0);
      let currentValue = a.cost;
      const salvage = 0;
      if (a.method === "slm") currentValue = a.cost - (a.cost - salvage) * Math.min(ageYears / a.life, 1);
      else if (a.method === "wdv") { const r = 1 - Math.pow(0.1, 1 / a.life); currentValue = a.cost * Math.pow(1 - r, ageYears); }
      const _id = randomUUID();
      const empName = a.emp != null ? ["Aisha Khan", "Vikram Rao", "Neha Gupta", "Sanjay Patel"][a.emp] : null;
      assetDocs.push({
        _id,
        assetCode: `AST-${pad(i + 1)}`,
        name: a.name,
        category: a.category,
        brand: a.name.split(" ")[0],
        model: a.name,
        serialNumber: `SN-${100000 + i * 137}`,
        purchaseDate,
        purchaseCost: round2(a.cost),
        currency: "INR",
        vendorId: hwVendor._id,
        vendorName: hwVendor.companyName,
        poId: null,
        warrantyExpiry: iso(daysAhead(365 - i * 20)),
        officeLocation: "Bengaluru HO",
        depreciationMethod: a.method,
        usefulLifeYears: a.life,
        salvageValue: 0,
        currentValue: round2(Math.max(currentValue, 0)),
        status: a.status,
        assignedEmployeeId: a.status === "assigned" ? `seed-emp-${a.emp}` : null,
        assignedEmployeeName: a.status === "assigned" ? empName : null,
        assignedAt: a.status === "assigned" ? daysAgo(120) : null,
        notes: null,
        ...stamp(purchaseDate),
      });
      if (a.status === "assigned") {
        assignmentDocs.push({ _id: randomUUID(), assetId: _id, action: "assigned", employeeId: `seed-emp-${a.emp}`, employeeName: empName, note: "Onboarding kit", date: daysAgo(120), actorId: null });
      }
    });
    await db.collection("prms_assets").insertMany(assetDocs);
    if (assignmentDocs.length) await db.collection("prms_asset_assignments").insertMany(assignmentDocs);
    console.log(`Inserted ${assetDocs.length} assets.`);

    // ---- Inventory ----------------------------------------------------
    const invSpecs = [
      { name: "A4 Paper Ream", category: "Stationery", uom: "reams", unitCost: 320, stock: 45, min: 20 },
      { name: "Blue Ballpoint Pen", category: "Stationery", uom: "pcs", unitCost: 8, stock: 12, min: 50 },
      { name: "Whiteboard Marker", category: "Stationery", uom: "pcs", unitCost: 40, stock: 8, min: 15 },
      { name: "USB-C to HDMI Adapter", category: "IT Peripherals", uom: "pcs", unitCost: 900, stock: 6, min: 5 },
      { name: "Wireless Mouse", category: "IT Peripherals", uom: "pcs", unitCost: 750, stock: 22, min: 10 },
      { name: "LAN Cable 3m", category: "Cables", uom: "pcs", unitCost: 120, stock: 3, min: 10 },
    ];
    const invDocs = [];
    const invTxns = [];
    invSpecs.forEach((it, i) => {
      const _id = randomUUID();
      invDocs.push({
        _id,
        itemCode: `INV-${pad(i + 1)}`,
        name: it.name,
        category: it.category,
        uom: it.uom,
        unitCost: it.unitCost,
        currentStock: it.stock,
        minStock: it.min,
        vendorId: officeVendor._id,
        vendorName: officeVendor.companyName,
        location: "HO Store",
        notes: null,
        ...stamp(daysAgo(90 - i * 5)),
      });
      invTxns.push({ _id: randomUUID(), itemId: _id, itemName: it.name, type: "stock_in", quantity: it.stock + 10, unitCost: it.unitCost, reference: "Opening balance", note: null, balanceAfter: it.stock + 10, date: daysAgo(80 - i * 5), actorId: null });
      invTxns.push({ _id: randomUUID(), itemId: _id, itemName: it.name, type: "stock_out", quantity: 10, unitCost: null, reference: "Office consumption", note: null, balanceAfter: it.stock, date: daysAgo(20), actorId: null });
    });
    await db.collection("prms_inventory_items").insertMany(invDocs);
    await db.collection("prms_inventory_transactions").insertMany(invTxns);
    console.log(`Inserted ${invDocs.length} inventory items.`);

    // ---- Infrastructure / SaaS / Third-party / Contracts -------------
    const monthly = (cost, cycle) => round2(cost / (cycle === "annual" ? 12 : cycle === "quarterly" ? 3 : cycle === "biennial" ? 24 : 1));
    const infraDocs = [
      { name: "Production DB Cluster", provider: "AWS", resourceType: "Database Server", region: "ap-south-1", cost: 62000, billingCycle: "monthly" },
      { name: "app-prod-01", provider: "AWS", resourceType: "Cloud Server", region: "ap-south-1", cost: 28000, billingCycle: "monthly" },
      { name: "yashorbit.com", provider: "Cloudflare", resourceType: "Domain", region: "global", cost: 1500, billingCycle: "annual", renewalDate: iso(daysAhead(25)) },
      { name: "Wildcard SSL", provider: "DigiCert", resourceType: "SSL Certificate", region: "global", cost: 12000, billingCycle: "annual", renewalDate: iso(daysAhead(50)) },
    ].map((r, i) => ({
      _id: randomUUID(),
      ...r,
      region: r.region ?? null,
      monthlyCost: monthly(r.cost, r.billingCycle),
      currency: "INR",
      renewalDate: r.renewalDate ?? null,
      autoRenew: true,
      vendorId: cloudVendor._id,
      vendorName: cloudVendor.companyName,
      status: "active",
      notes: null,
      ...stamp(daysAgo(200 - i * 10)),
    }));
    await db.collection("prms_infrastructure").insertMany(infraDocs);

    const saasDocs = [
      { serviceName: "GitHub Enterprise", provider: "GitHub", licenseCount: 40, cost: 180000, billingCycle: "annual" },
      { serviceName: "Figma Organization", provider: "Figma", licenseCount: 25, cost: 22000, billingCycle: "monthly", renewalDate: iso(daysAhead(18)) },
      { serviceName: "Google Workspace", provider: "Google", licenseCount: 60, cost: 45000, billingCycle: "monthly" },
      { serviceName: "Slack Pro", provider: "Slack", licenseCount: 60, cost: 30000, billingCycle: "monthly" },
      { serviceName: "OpenAI Team", provider: "OpenAI", licenseCount: 20, cost: 40000, billingCycle: "monthly" },
    ].map((r, i) => ({
      _id: randomUUID(),
      ...r,
      monthlyCost: monthly(r.cost, r.billingCycle),
      annualCost: round2(monthly(r.cost, r.billingCycle) * 12),
      currency: "INR",
      renewalDate: r.renewalDate ?? null,
      ownerEmployeeId: null,
      ownerName: ["Aisha Khan", "Vikram Rao", "Neha Gupta"][i % 3],
      autoRenew: true,
      vendorId: swVendor._id,
      vendorName: swVendor.companyName,
      status: "active",
      notes: null,
      ...stamp(daysAgo(150 - i * 10)),
    }));
    await db.collection("prms_software_subscriptions").insertMany(saasDocs);

    const tpDocs = [
      { name: "Office Security Guards", serviceType: "Security", provider: "SIS India", cost: 90000, billingCycle: "monthly" },
      { name: "Leased Line 200 Mbps", serviceType: "Internet Provider", provider: "Airtel", cost: 25000, billingCycle: "monthly" },
      { name: "Recruitment Retainer", serviceType: "Recruitment", provider: "TeamLease", cost: 150000, billingCycle: "quarterly", renewalDate: iso(daysAhead(40)) },
    ].map((r, i) => ({
      _id: randomUUID(),
      ...r,
      monthlyCost: monthly(r.cost, r.billingCycle),
      currency: "INR",
      slaSummary: "24x7 support, 4h response",
      renewalDate: r.renewalDate ?? null,
      autoRenew: false,
      vendorId: amcVendor._id,
      vendorName: amcVendor.companyName,
      status: "active",
      notes: null,
      ...stamp(daysAgo(120 - i * 10)),
    }));
    await db.collection("prms_third_party_services").insertMany(tpDocs);

    const contractDocs = [
      { title: "AC Preventive Maintenance AMC", contractType: "AMC", value: 90000, startDate: iso(daysAgo(120)), endDate: iso(daysAhead(245)), renewalDate: iso(daysAhead(215)) },
      { title: "Fire Safety Equipment AMC", contractType: "AMC", value: 45000, startDate: iso(daysAgo(200)), endDate: iso(daysAhead(45)), renewalDate: iso(daysAhead(15)) },
      { title: "Legal Retainer Agreement", contractType: "Retainer", value: 360000, startDate: iso(daysAgo(90)), endDate: iso(daysAhead(275)), renewalDate: null },
    ].map((r, i) => ({
      _id: randomUUID(),
      contractCode: `CTR-${pad(i + 1)}`,
      ...r,
      vendorId: amcVendor._id,
      vendorName: amcVendor.companyName,
      currency: "INR",
      slaSummary: "As per contract schedule",
      autoRenew: false,
      documentStorageKey: null,
      documentFilename: null,
      status: "active",
      notes: null,
      ...stamp(daysAgo(120 - i * 10)),
    }));
    await db.collection("prms_contracts").insertMany(contractDocs);
    console.log(`Inserted recurring resources: ${infraDocs.length} infra, ${saasDocs.length} SaaS, ${tpDocs.length} third-party, ${contractDocs.length} contracts.`);

    // ---- Invoices + Payments ---------------------------------------
    const invoiceDocs = [];
    const paymentDocs = [];
    poDocs.filter((p) => p.status === "received" || p.status === "partially_received").forEach((po, i) => {
      const subtotal = po.taxableAmount;
      const gstAmount = po.gstAmount;
      const total = round2(subtotal + gstAmount);
      const tdsRate = 2;
      const tdsAmount = round2(subtotal * tdsRate / 100);
      const netPayable = round2(total - tdsAmount);
      const paid = i === 0 ? netPayable : round2(netPayable / 2);
      const _id = randomUUID();
      invoiceDocs.push({
        _id,
        invoiceNumber: `INV-${pad(i + 1)}`,
        vendorInvoiceNumber: `${po.vendorName.split(" ")[0].toUpperCase()}/24-25/${200 + i}`,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        poId: po._id,
        poNumber: po.poNumber,
        invoiceDate: iso(daysAgo(15 - i * 3)),
        dueDate: iso(daysAhead(15 - i * 3)),
        subtotal,
        gstAmount,
        tdsRate,
        tdsAmount,
        totalAmount: total,
        netPayable,
        amountPaid: paid,
        currency: "INR",
        status: paid >= netPayable ? "paid" : "partially_paid",
        storageKey: null,
        filename: null,
        poMatched: true,
        grnMatched: true,
        notes: null,
        ...stamp(daysAgo(15 - i * 3)),
      });
      paymentDocs.push({
        _id: randomUUID(),
        paymentCode: `PAY-${pad(i + 1)}`,
        invoiceId: _id,
        invoiceNumber: `INV-${pad(i + 1)}`,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        amount: paid,
        paymentDate: daysAgo(8 - i * 2),
        method: "bank_transfer",
        transactionReference: `NEFT${900000 + i * 111}`,
        tdsDeducted: tdsAmount,
        status: "processed",
        notes: null,
        ...stamp(daysAgo(8 - i * 2)),
      });
    });
    // One overdue pending invoice with no PO.
    invoiceDocs.push({
      _id: randomUUID(),
      invoiceNumber: `INV-${pad(invoiceDocs.length + 1)}`,
      vendorInvoiceNumber: "AIRTEL/9921",
      vendorId: vById((v) => v.category === "internet_provider")._id,
      vendorName: vById((v) => v.category === "internet_provider").companyName,
      poId: null,
      poNumber: null,
      invoiceDate: iso(daysAgo(50)),
      dueDate: iso(daysAgo(20)),
      subtotal: 25000,
      gstAmount: 4500,
      tdsRate: 0,
      tdsAmount: 0,
      totalAmount: 29500,
      netPayable: 29500,
      amountPaid: 0,
      currency: "INR",
      status: "overdue",
      storageKey: null,
      filename: null,
      poMatched: false,
      grnMatched: false,
      notes: null,
      ...stamp(daysAgo(50)),
    });
    await db.collection("prms_invoices").insertMany(invoiceDocs);
    if (paymentDocs.length) await db.collection("prms_payments").insertMany(paymentDocs);
    console.log(`Inserted ${invoiceDocs.length} invoices, ${paymentDocs.length} payments.`);

    // ---- Budgets -------------------------------------------------
    const fyStart = `${now.getFullYear()}-04-01`;
    const fyEnd = `${now.getFullYear() + 1}-03-31`;
    const budgetDocs = [
      { name: "FY Company Operating Budget", level: "company", scopeId: null, scopeName: null, allocatedAmount: 12000000 },
      { name: "FY Engineering Budget", level: "department", scopeId: departments[0]._id, scopeName: departments[0].name, allocatedAmount: 4500000 },
      { name: "FY Marketing Budget", level: "department", scopeId: departments[2 % departments.length]._id, scopeName: departments[2 % departments.length].name, allocatedAmount: 2000000 },
      { name: "FY Software & SaaS", level: "category", scopeId: "software_saas", scopeName: "Software & SaaS", allocatedAmount: 3500000 },
    ].map((b, i) => ({
      _id: randomUUID(),
      budgetCode: `BUD-${pad(i + 1)}`,
      ...b,
      period: "yearly",
      periodStart: new Date(`${fyStart}T00:00:00`),
      periodEnd: new Date(`${fyEnd}T23:59:59`),
      consumedAmount: 0,
      currency: "INR",
      notes: null,
      ...stamp(daysAgo(60)),
    }));
    await db.collection("prms_budgets").insertMany(budgetDocs);
    console.log(`Inserted ${budgetDocs.length} budgets (run "Recalculate" in the panel to roll up consumption).`);

    // Counters so newly created records continue the sequence.
    await db.collection("prms_counters").insertMany([
      { _id: "vendor_code", seq: vendorDocs.length },
      { _id: "requisition_code", seq: reqDocs.length },
      { _id: "po_number", seq: poDocs.length },
      { _id: "grn_number", seq: grnDocs.length },
      { _id: "expense_code", seq: expenseDocs.length },
      { _id: "asset_code", seq: assetDocs.length },
      { _id: "inventory_item_code", seq: invDocs.length },
      { _id: "contract_code", seq: contractDocs.length },
      { _id: "invoice_number", seq: invoiceDocs.length },
      { _id: "payment_code", seq: paymentDocs.length },
      { _id: "budget_code", seq: budgetDocs.length },
      { _id: "rfq_code", seq: 0 },
    ]);

    console.log("\nPRMS demo data ready. Grant yourself access with `npm run prms:grant` and sign in at /prms/login.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
