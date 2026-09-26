// Online Test System — recruitment screening tests for every job on the public careers page
// (`src/app/(site)/careers/jobs-data.ts`). Each role gets:
//   - a question category named after the role, with questions written from that job's listed skills;
//   - a published "<Role> Screening Test" (objective knowledge section + one written response marked by an evaluator),
//     held for the hiring team to publish (resultRelease "manual", score only);
//   - an assignment by POSITION to the real applicants who applied for that role (`career_applications.positionSlug`),
//     with attempts that match each applicant's hiring stage (shortlisted → not started yet, interview / selected /
//     hired → taken and scored, some written answers still waiting for an evaluator).
// Applicants are never invented here: a role nobody has applied for gets its test but no assignments.
//
// Idempotent: every row has a `demo-ots-car-` id and is replaced on each run. Called from `seedOts` (db:seed-ots) and
// runnable on its own: `npm run db:seed-ots-careers`.
import { makeRng } from "./lib.mjs";
import { CONFIG, autoGradable, computeResult, grade, publicView, respond, section } from "./ots.mjs";

const D = "demo-ots-car-";
const DAY = 86400000;
const NOW = Date.now();
const rng = makeRng(20260927);
const rint = (a, b) => Math.floor(rng() * (b - a + 1)) + a;
const at = (daysAgo, hour = 11, min = 0) => {
  const d = new Date(NOW - daysAgo * DAY);
  d.setHours(hour, min, 0, 0);
  return d;
};
const stamp = (d, by = null) => ({ createdAt: d, updatedAt: d, createdBy: by, updatedBy: by, deletedAt: null });
const opts = (...t) => t.map((text, i) => ({ id: `o${i + 1}`, text }));
const sc = (difficulty, topic, prompt, options, correct, explanation = "") => ({ type: "single_choice", difficulty, topic, prompt, definition: { options: opts(...options), correct: [`o${correct}`] }, explanation });
const ms = (difficulty, topic, prompt, options, correct) => ({ type: "multiple_select", difficulty, topic, prompt, definition: { options: opts(...options), correct: correct.map((c) => `o${c}`) } });
const tf = (difficulty, topic, prompt, answer) => ({ type: "true_false", difficulty, topic, prompt, definition: { options: [{ id: "true", text: "True" }, { id: "false", text: "False" }], correct: [answer ? "true" : "false"] } });
const written = (topic, prompt, rubric, sample) => ({ type: "long_answer", difficulty: "intermediate", topic, prompt, definition: { acceptedAnswers: [], caseSensitive: false, maxLength: 2500, rubric }, marks: 5, sample });

/** One entry per careers-page job (same slugs / titles). Questions follow each job's `skills` list. */
export const CAREER_TESTS = [
  {
    slug: "mern-developer", title: "MERN Developer", category: "Engineering & Development", minutes: 30,
    questions: [
      sc("beginner", "React", "In React, which hook runs side effects after render?", ["useState", "useEffect", "useMemo", "useId"], 2),
      sc("intermediate", "Node.js", "Which Express method registers middleware for every route?", ["app.route()", "app.use()", "app.all()", "app.listen()"], 2),
      sc("intermediate", "MongoDB", "Which MongoDB feature makes a query on `email` fast?", ["A capped collection", "An index on email", "A $lookup stage", "A larger batchSize"], 2),
      sc("intermediate", "REST APIs", "A request to create a resource succeeded. The best HTTP status is…", ["200 OK", "201 Created", "204 No Content", "302 Found"], 2),
      ms("intermediate", "JavaScript / TypeScript", "Which of these are TypeScript utility types? (select all)", ["Partial<T>", "Pick<T, K>", "Merge<T>", "Readonly<T>"], [1, 2, 4]),
      tf("beginner", "Git", "`git rebase` rewrites commit history.", true),
      sc("advanced", "MongoDB", "An aggregation needs data from another collection. Which stage?", ["$group", "$unwind", "$lookup", "$project"], 3),
      written("System design", "Describe how you would add pagination to an Express + MongoDB list API that returns 50,000 orders.", "Chooses cursor/range pagination over large skip (2), indexes the sort field (1), returns next-cursor + page size limits (1), mentions React side / UX (1).", "Use cursor-based pagination on an indexed createdAt+_id, return a nextCursor and cap limit at 100; avoid large skip values."),
    ],
  },
  {
    slug: "genai-developer", title: "GenAI Developer", category: "Engineering & Development", minutes: 30,
    questions: [
      sc("beginner", "RAG", "What does RAG stand for?", ["Rapid Agent Generation", "Retrieval-Augmented Generation", "Recursive Answer Grading", "Random Attention Gate"], 2),
      sc("intermediate", "Vector Databases", "Embeddings are compared in a vector database mostly by…", ["Exact string match", "Cosine similarity / distance", "Alphabetical order", "Row IDs"], 2),
      sc("intermediate", "Prompt Engineering", "The most reliable way to get machine-readable output from an LLM is…", ["Asking politely", "A structured-output / JSON schema constraint", "Raising temperature", "Longer system prompts"], 2),
      ms("intermediate", "LLM APIs", "Which settings reduce randomness in LLM output? (select all)", ["Lower temperature", "Lower top_p", "Higher max_tokens", "Fixed seed (where supported)"], [1, 2, 4]),
      sc("advanced", "RAG", "Answers are fluent but cite the wrong documents. The first thing to evaluate is…", ["The chat UI", "Retrieval quality (recall / precision of chunks)", "The model's temperature", "GPU memory"], 2),
      tf("beginner", "Python", "`async def` functions return a coroutine that must be awaited.", true),
      sc("intermediate", "FastAPI", "In FastAPI, request bodies are validated with…", ["Jinja templates", "Pydantic models", "SQLAlchemy sessions", "Celery tasks"], 2),
      written("Guardrails", "An LLM feature sometimes invents refund policies. How would you reduce this in production?", "Grounds answers in retrieved policy text (2), refusal / fallback when not found (1), evaluation set + monitoring (1), human escalation (1).", "Ground answers in retrieved policy docs, instruct refusal when not covered, add an eval set and monitor hallucination rate, escalate to support."),
    ],
  },
  {
    slug: "ai-ml-engineer", title: "AI/ML Engineer", category: "Engineering & Development", minutes: 30,
    questions: [
      sc("beginner", "ML fundamentals", "A model scores 99% on training data and 70% on test data. This is…", ["Underfitting", "Overfitting", "Data leakage fixed", "Perfect generalisation"], 2),
      sc("intermediate", "scikit-learn", "Which metric suits a heavily imbalanced fraud dataset best?", ["Accuracy", "Precision / recall (or F1, PR-AUC)", "Mean squared error", "R²"], 2),
      sc("intermediate", "PyTorch / TensorFlow", "In PyTorch, gradients are computed by calling…", ["model.eval()", "loss.backward()", "optimizer.zero_grad()", "torch.no_grad()"], 2),
      ms("intermediate", "MLOps", "Which are signs of data drift in production? (select all)", ["Feature distributions shift", "Prediction confidence changes", "Faster CI builds", "Accuracy drops on fresh labels"], [1, 2, 4]),
      sc("intermediate", "SQL", "Which SQL clause removes duplicate rows from a result?", ["UNIQUE", "DISTINCT", "GROUP ALL", "FILTER"], 2),
      tf("beginner", "Docker", "A Docker image is a running instance of a container.", false),
      sc("advanced", "ML fundamentals", "Target leakage most often comes from…", ["Too few epochs", "Features that encode the label or future information", "Using a GPU", "Normalising inputs"], 2),
      written("Deployment", "Outline how you would take a trained classification model to a monitored production API.", "Packaging + versioning (1), serving API + latency (1), input validation (1), drift / performance monitoring (1), rollback / retraining plan (1).", "Version the model, containerise a FastAPI service, validate inputs, log predictions, monitor drift and accuracy, keep a rollback path and retraining schedule."),
    ],
  },
  {
    slug: "android-app-developer", title: "Android App Developer", category: "Engineering & Development", minutes: 25,
    questions: [
      sc("beginner", "Kotlin", "In Kotlin, `val` declares…", ["A mutable variable", "A read-only reference", "A static constant only", "A nullable type"], 2),
      sc("intermediate", "Jetpack Compose", "In Compose, state that should survive recomposition is held with…", ["remember { mutableStateOf(...) }", "A global var", "findViewById", "SharedPreferences only"], 1),
      sc("intermediate", "MVVM", "In MVVM, UI state exposed to the screen usually lives in…", ["The Activity", "The ViewModel", "The Room DAO", "The Manifest"], 2),
      sc("intermediate", "Room", "Room is…", ["A networking library", "An SQLite object-mapping library", "A DI framework", "A test runner"], 2),
      sc("intermediate", "Retrofit", "Retrofit is used to…", ["Draw UI", "Make typed HTTP API calls", "Store images", "Schedule alarms"], 2),
      tf("beginner", "Kotlin", "Kotlin coroutines let you write asynchronous code sequentially.", true),
      ms("advanced", "Performance", "Which help prevent ANRs? (select all)", ["Move disk/network work off the main thread", "Use coroutines with Dispatchers.IO", "Block the UI thread while loading", "Use WorkManager for deferrable work"], [1, 2, 4]),
      written("Offline-first", "How would you make a notes app work offline and sync when back online?", "Local source of truth (Room) (2), sync queue / WorkManager (1), conflict strategy (1), UI states (1).", "Room as source of truth, queue changes, WorkManager sync on connectivity, last-write-wins or merge rules, show sync status."),
    ],
  },
  {
    slug: "ios-app-developer", title: "iOS App Developer", category: "Engineering & Development", minutes: 25,
    questions: [
      sc("beginner", "Swift", "Which Swift keyword declares a constant?", ["var", "let", "const", "static"], 2),
      sc("intermediate", "SwiftUI", "In SwiftUI, a view owns mutable local state with…", ["@State", "@Binding", "@Environment", "@IBOutlet"], 1),
      sc("intermediate", "Swift", "`guard let` is mainly used to…", ["Loop over arrays", "Unwrap optionals and exit early", "Declare protocols", "Start threads"], 2),
      sc("intermediate", "Combine", "In Combine, a Publisher emits values to a…", ["Delegate", "Subscriber", "Storyboard", "Scene"], 2),
      tf("beginner", "UIKit", "UI updates in UIKit must happen on the main thread.", true),
      sc("intermediate", "App Store Connect", "Beta builds are distributed to testers through…", ["Xcode Cloud only", "TestFlight", "CocoaPods", "Instruments"], 2),
      ms("advanced", "Memory", "Which can cause retain cycles? (select all)", ["A closure capturing self strongly", "Two objects holding strong references to each other", "Using [weak self] in closures", "Delegates declared as strong properties"], [1, 2, 4]),
      written("Architecture", "How would you structure a SwiftUI app with a REST API so it stays testable?", "Separation of view / view model / service (2), dependency injection / protocols for mocking (2), error + loading states (1).", "Views observe view models; view models call a protocol-based API service injected for tests; model loading/error states explicitly."),
    ],
  },
  {
    slug: "quality-analyst", title: "Quality Analyst", category: "Engineering & Development", minutes: 25,
    questions: [
      sc("beginner", "Manual & Automated Testing", "Re-testing existing features after a change is called…", ["Smoke testing", "Regression testing", "Load testing", "Alpha testing"], 2),
      sc("intermediate", "Selenium / Cypress / Playwright", "The main cause of flaky UI tests is usually…", ["Too many assertions", "Timing / waits on async UI", "Using CSS selectors", "Headless mode"], 2),
      sc("intermediate", "API Testing", "Which verifies an API returns the right JSON shape?", ["Schema / contract assertions", "Visual snapshot", "Load test", "Code coverage"], 1),
      sc("intermediate", "JIRA", "A defect report must include…", ["Only a title", "Steps to reproduce, expected vs actual, environment", "The developer's name", "A fix"], 2),
      sc("intermediate", "SQL", "To find orders with no matching customer you would use…", ["INNER JOIN", "LEFT JOIN … WHERE customer.id IS NULL", "CROSS JOIN", "UNION"], 2),
      tf("beginner", "Testing", "100% code coverage guarantees the software has no bugs.", false),
      ms("advanced", "Test Planning", "Which belong in a test plan? (select all)", ["Scope and out-of-scope", "Entry / exit criteria", "Developer salaries", "Risks and environments"], [1, 2, 4]),
      written("Test design", "Write the key test cases for a login form with email, password and 'remember me'.", "Positive + negative credentials (1), validation / boundaries (1), lockout / security (1), remember-me session behaviour (1), accessibility / UX (1).", "Valid login, wrong password, unknown email, empty/invalid email, lockout after N failures, remember-me persists session, logout clears, keyboard/screen-reader usable."),
    ],
  },
  {
    slug: "ui-ux-designer", title: "UI/UX Designer", category: "Design", minutes: 25,
    questions: [
      sc("beginner", "Figma", "In Figma, reusable UI elements are built as…", ["Frames only", "Components (with variants)", "Flattened layers", "Exported PNGs"], 2),
      sc("intermediate", "Accessibility", "WCAG AA contrast for normal body text is at least…", ["2:1", "3:1", "4.5:1", "7:1"], 3),
      sc("intermediate", "User Research", "Five users per usability round is recommended because…", ["It is the legal minimum", "It finds most major issues cheaply; iterate in rounds", "Statistics require it", "Tools limit it"], 2),
      sc("intermediate", "Design Systems", "A design token is…", ["A login credential", "A named design value (colour, spacing, type) shared by design and code", "A Figma plugin", "A font license"], 2),
      tf("beginner", "Prototyping", "A clickable prototype is useful for testing flows before development.", true),
      ms("intermediate", "HTML/CSS Basics", "Which CSS features help build responsive layouts? (select all)", ["Flexbox", "CSS Grid", "Media queries", "Fixed pixel widths everywhere"], [1, 2, 3]),
      sc("advanced", "UX", "Users abandon checkout at the address step. Your first move is…", ["Redesign the logo", "Look at analytics + session recordings, then test the step", "Add more fields", "Change the brand colour"], 2),
      written("Case study", "Walk us through how you would redesign a cluttered admin dashboard.", "Research / goals first (1), information hierarchy (1), design system reuse (1), validate with users (1), measurable outcome (1).", "Interview users about top tasks, audit data, prioritise key metrics, restructure hierarchy with components, test a prototype, measure task time."),
    ],
  },
  {
    slug: "business-development-manager", title: "Business Development Manager", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "B2B Sales", "An ICP is…", ["Initial Contract Price", "Ideal Customer Profile", "Internal Cost Plan", "Invoice Control Process"], 2),
      sc("intermediate", "Lead Generation", "Which lead is the most qualified?", ["Downloaded an e-book", "Has budget, authority, need and a timeline", "Follows us on social", "Opened one email"], 2),
      sc("intermediate", "CRM Tools", "Pipeline stages in a CRM are mainly used to…", ["Store passwords", "Forecast revenue and track deal progress", "Design websites", "Pay invoices"], 2),
      sc("intermediate", "Negotiation", "BATNA means…", ["Best Alternative To a Negotiated Agreement", "Base Annual Target", "Bid And Tender Notice", "Budget After Tax"], 1),
      tf("beginner", "Proposal Writing", "A good proposal restates the client's problem before the solution.", true),
      ms("intermediate", "B2B Sales", "Which are healthy sales KPIs? (select all)", ["Win rate", "Sales cycle length", "Pipeline coverage", "Number of emojis per email"], [1, 2, 3]),
      sc("advanced", "Negotiation", "A client asks for a 30% discount at the last minute. Best response?", ["Accept immediately", "Trade: reduce scope or ask for longer commitment in return", "Walk away", "Ignore the request"], 2),
      written("Territory plan", "Outline a 90-day plan to open a new mid-market segment for our AI automation services.", "Target list / ICP (1), outreach channels (1), offer / positioning (1), metrics and targets (1), partnerships or events (1).", "Define ICP, build 200-account list, LinkedIn + email sequences, free automation audit offer, weekly pipeline targets, two partner events."),
    ],
  },
  {
    slug: "business-analyst", title: "Business Analyst", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "User Stories", "Which is a well-formed user story?", ["Build a login page", "As a buyer, I want to save my cart so that I can finish later", "Login must be fast", "Fix bug 123"], 2),
      sc("intermediate", "Requirements Gathering", "Acceptance criteria describe…", ["Developer tasks", "Conditions a story must satisfy to be accepted", "Sprint velocity", "Server specs"], 2),
      sc("intermediate", "Process Mapping", "BPMN is used to…", ["Write SQL", "Model business processes", "Design logos", "Track time"], 2),
      sc("intermediate", "SQL Basics", "Which counts orders per customer?", ["SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id", "SELECT COUNT(customer_id) FROM orders", "SELECT * FROM orders ORDER BY customer_id", "SELECT SUM(*) FROM orders"], 1),
      tf("beginner", "JIRA / Confluence", "Confluence is typically used for documentation, JIRA for tracking work items.", true),
      ms("intermediate", "Requirements Gathering", "Which are elicitation techniques? (select all)", ["Stakeholder interviews", "Workshops", "Observation / shadowing", "Guessing"], [1, 2, 3]),
      sc("advanced", "Prioritisation", "MoSCoW prioritisation stands for…", ["Must, Should, Could, Won't", "Money, Scope, Cost, Work", "Modules, Services, Components, Workflows", "None of these"], 1),
      written("Requirements", "A client says 'we need a dashboard'. What questions do you ask before writing requirements?", "Who uses it + decisions it supports (2), metrics / data sources (1), frequency / freshness (1), success measure (1).", "Who uses it, which decisions it drives, which KPIs and data sources, how fresh, what's broken today, how we'll measure success."),
    ],
  },
  {
    slug: "project-manager", title: "Project Manager", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "Agile / Scrum", "Who owns the product backlog in Scrum?", ["Scrum Master", "Product Owner", "Development team", "Stakeholders"], 2),
      sc("intermediate", "Agile / Scrum", "The purpose of a sprint retrospective is to…", ["Demo features to clients", "Improve how the team works", "Estimate the backlog", "Assign blame"], 2),
      sc("intermediate", "Risk Management", "A risk register records…", ["Only past issues", "Risks with probability, impact, owner and mitigation", "Team salaries", "Server logs"], 2),
      sc("intermediate", "Budgeting", "CPI below 1.0 means the project is…", ["Under budget", "Over budget", "Ahead of schedule", "Behind schedule"], 2),
      tf("beginner", "JIRA", "Burndown charts show remaining work over time.", true),
      ms("intermediate", "Stakeholder Management", "Good status reports include… (select all)", ["Progress vs plan", "Risks and blockers", "Decisions needed", "Every commit message"], [1, 2, 3]),
      sc("advanced", "Scope", "The client adds features mid-sprint. You should…", ["Add them silently", "Capture as change requests, assess impact, re-prioritise with the PO", "Refuse all changes", "Extend the sprint"], 2),
      written("Recovery", "Your project is three weeks late with a fixed launch date. What do you do?", "Diagnose causes (1), options: scope / resources / phasing (2), stakeholder communication (1), plan + tracking (1).", "Find root causes, cut to MVP scope with the PO, add targeted help, phase the rest, communicate a re-baselined plan and track daily."),
    ],
  },
  {
    slug: "bid-executive", title: "Bid Executive", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "Upwork / Freelancer", "The first lines of a bid proposal should…", ["List every past project", "Show you understood the client's specific problem", "State your hourly rate", "Ask for a call"], 2),
      sc("intermediate", "Pre-Sales", "Before quoting a fixed price you must…", ["Guess quickly", "Clarify scope, deliverables and assumptions", "Offer the lowest price", "Skip estimation"], 2),
      sc("intermediate", "Proposal Writing", "A strong proposal includes…", ["Only the price", "Approach, milestones, timeline, price and relevant proof", "Company history only", "Generic templates"], 2),
      sc("intermediate", "Client Communication", "A client hasn't replied for a week. Best follow-up?", ["Stop contacting", "Short, value-adding follow-up with a clear next step", "Send ten messages", "Lower the price"], 2),
      tf("beginner", "MS Office", "Tracked changes in Word let reviewers see edits to a proposal.", true),
      ms("intermediate", "Pre-Sales", "Which reduce proposal rejection? (select all)", ["Tailoring to the job post", "Relevant case studies", "Clear timeline", "Copy-pasting the same bid everywhere"], [1, 2, 3]),
      sc("intermediate", "Bidding", "Connects / bids should be spent mostly on jobs that…", ["Were posted weeks ago with 50+ proposals", "Match our strengths and have verified payment", "Pay the least", "Have no description"], 2),
      written("Proposal", "Write the opening paragraph of a bid for 'Build a React dashboard for our logistics data'.", "Mirrors the client's need (2), relevant proof (1), concrete next step (1), concise and error-free (1).", "You need live visibility of shipments without spreadsheets. We've built React dashboards for two logistics firms; happy to share a 3-day plan on a quick call."),
    ],
  },
  {
    slug: "accounts-manager", title: "Accounts Manager", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "Accounting", "Under double-entry accounting, every transaction affects…", ["One account", "At least two accounts (debit and credit)", "Only cash", "Only the P&L"], 2),
      sc("intermediate", "GST & Compliance", "GST on an intra-state sale in India is split into…", ["IGST only", "CGST + SGST", "TDS + TCS", "VAT + CST"], 2),
      sc("intermediate", "Invoicing", "Accounts receivable represents…", ["Money the company owes", "Money customers owe the company", "Cash in bank", "Fixed assets"], 2),
      sc("intermediate", "Tally / QuickBooks", "A bank reconciliation compares…", ["Two invoices", "Book records with the bank statement", "Salary and tax", "Budget and forecast"], 2),
      tf("beginner", "MS Excel", "SUMIFS can add values that meet multiple conditions.", true),
      ms("intermediate", "GST & Compliance", "Which are needed on a valid GST tax invoice? (select all)", ["Supplier GSTIN", "Invoice number and date", "HSN / SAC code", "The accountant's photo"], [1, 2, 3]),
      sc("advanced", "Accounting", "Depreciation reduces…", ["Cash immediately", "The book value of an asset over time", "Revenue", "Liabilities"], 2),
      written("Month-end", "List the steps you follow to close the books at month end.", "Reconciliations (1), accruals / prepayments (1), receivables / payables review (1), GST / TDS checks (1), reports + variance review (1).", "Reconcile bank and ledgers, post accruals and depreciation, review AR/AP ageing, verify GST/TDS, run P&L and balance sheet, explain variances."),
    ],
  },
  {
    slug: "mis-executive", title: "MIS Executive", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "MS Excel", "Which Excel function finds a value in the first column of a range and returns a matching value?", ["INDEX", "VLOOKUP (or XLOOKUP)", "CONCAT", "ROUND"], 2),
      sc("intermediate", "MS Excel", "A PivotTable is best for…", ["Writing macros", "Summarising large data by categories", "Drawing shapes", "Protecting sheets"], 2),
      sc("intermediate", "SQL", "Which SQL clause filters grouped results?", ["WHERE", "HAVING", "LIMIT", "ORDER BY"], 2),
      sc("intermediate", "Power BI / Tableau", "In Power BI, a measure is…", ["A static column", "A calculation evaluated in the report's filter context", "A data source", "A theme"], 2),
      tf("beginner", "Data Validation", "Data validation rules can stop invalid entries in Excel cells.", true),
      ms("intermediate", "Report Automation", "Which automate recurring reports? (select all)", ["Scheduled refresh in Power BI", "Excel Power Query", "Macros / scripts", "Retyping numbers daily"], [1, 2, 3]),
      sc("advanced", "Data Validation", "Two reports show different revenue for the same month. First step?", ["Average them", "Compare definitions, filters and source extracts", "Delete one", "Round the numbers"], 2),
      written("Dashboard", "Describe the daily sales MIS you would build for a regional manager.", "Right KPIs (2), data source + refresh (1), drill-down by region / rep (1), validation checks (1).", "Daily sales vs target, pipeline, top reps and products by region with drill-down; auto-refresh from the CRM each morning with row-count checks."),
    ],
  },
  {
    slug: "hr-executive", title: "HR Executive", category: "Business & Operations", minutes: 20,
    questions: [
      sc("beginner", "Recruitment", "A job description should primarily…", ["List perks only", "Describe the role, responsibilities and must-have skills", "Be as long as possible", "Hide the location"], 2),
      sc("intermediate", "Onboarding", "Good onboarding in week one includes…", ["Only an ID card", "Access, buddy, role goals and introductions", "Performance review", "Exit interview"], 2),
      sc("intermediate", "HRMS / ATS", "An ATS is used to…", ["Run payroll", "Track candidates through the hiring pipeline", "Book travel", "Store code"], 2),
      sc("intermediate", "HR Compliance", "Under Indian labour law, PF contributions are made by…", ["Employee only", "Employer and employee", "Government only", "Nobody for full-time staff"], 2),
      tf("beginner", "Employee Engagement", "Regular one-on-ones help catch attrition risk early.", true),
      ms("intermediate", "Recruitment", "Which reduce time-to-hire? (select all)", ["Structured interviews with a scorecard", "Clear hiring-manager SLAs", "Screening tests for volume roles", "Adding more interview rounds"], [1, 2, 3]),
      sc("advanced", "HR Compliance", "An employee raises a harassment complaint. Your first step is to…", ["Ignore it until the review cycle", "Follow the POSH policy — record it and involve the Internal Committee", "Tell the whole team", "Ask them to resolve it privately"], 2),
      written("Engagement", "Attrition in the engineering team rose to 25% this year. What would you do?", "Data: exit interviews / stay interviews (1), root causes (1), concrete actions (2), measure impact (1).", "Analyse exit interviews and run stay interviews, fix top causes (growth paths, pay bands, manager coaching), track monthly attrition and eNPS."),
    ],
  },
  {
    slug: "technical-content-writer", title: "Technical Content Writer", category: "Marketing & Content", minutes: 25,
    questions: [
      sc("beginner", "Technical Writing", "The best opening for a how-to article is…", ["A company history", "What the reader will achieve and prerequisites", "A long quote", "A list of references"], 2),
      sc("intermediate", "SEO Writing", "Search intent means…", ["Keyword density", "What the searcher is actually trying to accomplish", "Page load time", "Backlink count"], 2),
      sc("intermediate", "Editing", "Which sentence is in active voice?", ["The bug was fixed by the team.", "The team fixed the bug.", "The bug has been fixed.", "Fixing of the bug was done."], 2),
      sc("intermediate", "Content Strategy", "A pillar page is…", ["A 404 page", "A broad guide that links to related in-depth articles", "A press release", "A footer link"], 2),
      tf("beginner", "CMS Tools", "Meta descriptions directly appear in search results as the snippet (when Google uses them).", true),
      ms("intermediate", "Technical Writing", "Which improve readability of technical docs? (select all)", ["Short sections with headings", "Code samples that run", "Consistent terminology", "Walls of unbroken text"], [1, 2, 3]),
      sc("advanced", "SEO Writing", "Two of our articles compete for the same keyword. This is…", ["Link building", "Keyword cannibalisation — consolidate or differentiate", "Good for rankings", "Duplicate hosting"], 2),
      written("Writing sample", "In under 120 words, explain what an API is to a non-technical business owner.", "Accurate (2), plain language / analogy (1), relevant business example (1), within length (1).", "An API is like a waiter between two systems: your app asks for something, the API delivers the request and brings back the answer — e.g. your website checking stock in your inventory system."),
    ],
  },
  {
    slug: "digital-marketing", title: "Digital Marketing", category: "Marketing & Content", minutes: 25,
    questions: [
      sc("beginner", "SEO", "Which is an on-page SEO factor?", ["Backlinks from other sites", "Title tags and headings", "Social shares", "Domain age"], 2),
      sc("intermediate", "Google Ads", "Quality Score in Google Ads depends on…", ["Budget only", "Expected CTR, ad relevance and landing page experience", "Account age", "Number of campaigns"], 2),
      sc("intermediate", "Meta Ads", "A lookalike audience is built from…", ["Random users", "A seed audience such as customers or leads", "Only interests", "Competitors' followers"], 2),
      sc("intermediate", "Google Analytics", "In GA4, a conversion is…", ["Any pageview", "An event marked as a key event / conversion", "A session", "A bounce"], 2),
      tf("beginner", "Email Marketing", "Segmenting an email list usually improves open and click rates.", true),
      ms("intermediate", "Social Media Marketing", "Which are good social KPIs for a B2B brand? (select all)", ["Engagement rate", "Click-throughs to site", "Leads from social", "Number of posts deleted"], [1, 2, 3]),
      sc("advanced", "Google Ads", "CPA doubled after raising budget. What do you check first?", ["Font size", "Search terms, audience expansion and bid strategy changes", "Logo colour", "Nothing — it's normal"], 2),
      written("Campaign plan", "Plan a ₹2 lakh / month campaign to generate leads for our AI automation services.", "Channel mix with rationale (1), targeting (1), offer + landing page (1), tracking (1), KPIs / optimisation cadence (1).", "60% Google search on automation keywords, 40% LinkedIn to ops heads; free audit offer on a dedicated page; GA4 + CRM tracking; weekly CPA review."),
    ],
  },
];

/** A role-specific written answer for applicants (the generic seeder's sample is about release emails). */
function respondFor(q, skill) {
  if (q.type !== "long_answer") return respond(q, skill);
  if (rng() < 0.08) return null;
  return { text: rng() < skill ? q.sample : "I would discuss it with the team and decide the best approach." };
}

export async function seedOtsCareers(db, { actorId = null, evaluatorId = null } = {}) {
  for (const c of ["ots_questions", "ots_tests", "ots_dispatches", "ots_assignments", "ots_attempts", "ots_categories", "ots_activity_logs"]) await db.collection(c).deleteMany({ _id: new RegExp(`^${D}`) });

  // Categories: one test category for screening, one question category per role.
  const testCatName = "Recruitment Screening";
  const existingTestCat = await db.collection("ots_categories").findOne({ kind: "test", name: testCatName, deletedAt: null, _id: { $not: new RegExp(`^${D}`) } });
  const testCatId = existingTestCat?._id ?? `${D}tc-screening`;
  const cats = existingTestCat ? [] : [{ _id: testCatId, kind: "test", name: testCatName, description: "Screening tests for roles on the careers page.", ...stamp(at(45), actorId) }];
  const qCat = {};
  for (const job of CAREER_TESTS) {
    const existing = await db.collection("ots_categories").findOne({ kind: "question", name: job.title, deletedAt: null, _id: { $not: new RegExp(`^${D}`) } });
    qCat[job.slug] = existing?._id ?? `${D}qc-${job.slug}`;
    if (!existing) cats.push({ _id: qCat[job.slug], kind: "question", name: job.title, description: `Questions for the ${job.title} role (${job.category}).`, ...stamp(at(45), actorId) });
  }
  if (cats.length) await db.collection("ots_categories").insertMany(cats);

  const questions = [];
  const tests = [];
  const dispatches = [];
  const assignments = [];
  const attempts = [];
  const logs = [];
  let logSeq = 0;
  const log = (d, action, entity, entityId, entityLabel, testId, summary, by = actorId) => logs.push({ _id: `${D}log-${++logSeq}`, actorId: by ?? "system", actorEmail: null, action, entity, entityId, entityLabel, testId, summary, metadata: null, createdAt: d });

  let qn = 0;
  for (const [ti, job] of CAREER_TESTS.entries()) {
    const qs = job.questions.map((q) => {
      qn += 1;
      const doc = {
        _id: `${D}q-${job.slug}-${qn}`,
        code: `Q-C${String(qn).padStart(4, "0")}`,
        type: q.type,
        prompt: q.prompt,
        media: null,
        categoryId: qCat[job.slug],
        subject: job.title,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: q.marks ?? (q.difficulty === "advanced" ? 2 : 1),
        negativeMarks: 0,
        explanation: q.explanation ?? "",
        tags: [job.slug, "screening"],
        status: "active",
        definition: q.definition,
        version: 1,
        ...stamp(at(44 - ti), actorId),
      };
      questions.push(doc);
      return { doc, src: q };
    });
    const objective = qs.filter((x) => x.src.type !== "long_answer");
    const writtenQ = qs.filter((x) => x.src.type === "long_answer");
    const test = {
      _id: `${D}t-${job.slug}`,
      code: `TST-C${String(ti + 1).padStart(3, "0")}`,
      name: `${job.title} Screening Test`,
      description: `Pre-interview screening for the ${job.title} role (${job.category}) — role knowledge plus one written response. Questions follow the skills listed on the careers page.`,
      categoryId: testCatId,
      testType: "screening",
      subject: job.title,
      departmentIds: [],
      designationIds: [],
      difficulty: "mixed",
      instructions: `This test is part of your application for ${job.title}. ${job.minutes} minutes, one attempt. Answer the written question in your own words — it is reviewed by the hiring team, who share results with you after evaluation.`,
      tags: [job.slug, "hiring"],
      language: "English",
      status: "published",
      config: CONFIG({ durationMinutes: job.minutes, passingPercentage: 60, resultRelease: "manual", resultDetail: "score", showExplanations: false, randomizeOptions: true, security: { requireFullscreen: false, detectTabSwitch: true, blockCopyPaste: true, blockRightClick: true, singleSession: true, maxViolations: 5 } }),
      sections: [section(`${D}sec-${job.slug}-1`, "Role knowledge", objective.map((x) => x.doc._id)), section(`${D}sec-${job.slug}-2`, "Written response", writtenQ.map((x) => x.doc._id))],
      certificate: { enabled: false, title: "", validityMonths: null },
      publishedAt: at(40 - ti),
      publishedBy: actorId,
      closedAt: null,
      archivedAt: null,
      paperStats: { questionCount: qs.length, servedCount: qs.length, totalMarks: qs.reduce((s, x) => s + x.doc.marks, 0), marksVary: false },
      ...stamp(at(42 - ti), actorId),
    };
    tests.push(test);
    log(test.createdAt, "create", "test", test._id, test.name, test._id, `${test.code} · screening`);
    log(test.publishedAt, "publish", "test", test._id, test.name, test._id, test.code);

    // Real applicants for this role, past the "new" stage.
    const apps = await db
      .collection("career_applications")
      .find({ positionSlug: job.slug, status: { $in: ["under_review", "shortlisted", "interview_scheduled", "selected", "hired"] } }, { projection: { name: 1, status: 1 } })
      .limit(40)
      .toArray();
    if (apps.length === 0) continue;
    const dispatch = {
      _id: `${D}dsp-${job.slug}`,
      testId: test._id,
      targets: [{ type: "applicant_position", ids: [job.slug] }],
      targetSummary: `Applicants by Position: ${job.title}`,
      applicantStatuses: ["under_review", "shortlisted", "interview_scheduled", "selected", "hired"],
      startAt: null,
      dueAt: new Date(NOW + 5 * DAY),
      maxAttempts: null,
      priority: "high",
      instructions: "Please complete this before your role interview.",
      notify: true,
      resultRelease: null,
      resultDetail: null,
      certificateEligible: false,
      allowLateStart: false,
      created: apps.length,
      skipped: 0,
      ...stamp(at(20 - (ti % 10)), actorId),
    };
    dispatches.push(dispatch);
    log(dispatch.createdAt, "assign", "assignment", dispatch._id, test.name, test._id, `${apps.length} assigned → ${dispatch.targetSummary}`);

    for (const app of apps) {
      const ref = { kind: "applicant", id: app._id.toString() };
      const a = {
        _id: `${D}asg-${assignments.length + 1}`,
        dispatchId: dispatch._id,
        testId: test._id,
        candidate: ref,
        candidateKey: `applicant:${ref.id}`,
        candidateLabel: app.name,
        startAt: null,
        dueAt: dispatch.dueAt,
        maxAttempts: null,
        extraAttempts: 0,
        priority: "high",
        instructions: dispatch.instructions,
        allowLateStart: false,
        resultRelease: null,
        resultDetail: null,
        certificateEligible: false,
        status: "assigned",
        attemptsUsed: 0,
        activeAttemptId: null,
        result: null,
        resultPublishedAt: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancelReason: null,
        remindedDueAt: null,
        expiredNotifiedAt: null,
        ...stamp(dispatch.createdAt, actorId),
      };
      assignments.push(a);
      // Stage → test progress: shortlisted / under review haven't taken it yet; later stages have.
      if (["under_review", "shortlisted"].includes(app.status)) continue;
      const strong = ["selected", "hired"].includes(app.status);
      const skill = strong ? 0.8 + rng() * 0.18 : 0.5 + rng() * 0.35;
      const startedAt = at(rint(2, 16), rint(9, 18), rint(0, 59));
      const submittedAt = new Date(startedAt.getTime() + Math.round(job.minutes * (0.5 + rng() * 0.45)) * 60000);
      const paper = [];
      test.sections.forEach((sec, si) =>
        sec.questionIds.forEach((id) => {
          const { doc, src } = qs.find((x) => x.doc._id === id);
          paper.push({ qid: doc._id, code: doc.code, section: si, type: doc.type, prompt: doc.prompt, media: null, difficulty: doc.difficulty, subject: doc.subject, topic: doc.topic, categoryId: doc.categoryId, explanation: doc.explanation, definition: doc.definition, view: publicView(src, true), marks: doc.marks, negativeMarks: 0, autoGradable: autoGradable(src), outcome: null, _src: src });
        })
      );
      const answers = paper.map((it) => ({ response: respondFor(it._src, skill), flagged: false, visited: true, timeMs: rint(20, 160) * 1000, savedAt: submittedAt }));
      // Hired / selected candidates' written answers were marked; interview-stage ones are split.
      const evaluate = strong || rng() < 0.5;
      paper.forEach((it, i) => {
        it.outcome = grade(it._src, answers[i].response, it.marks, 0);
        if (it.outcome.status === "pending" && evaluate) {
          const m = Math.round(it.marks * (strong ? 0.7 + rng() * 0.3 : 0.3 + rng() * 0.5) * 4) / 4;
          it.outcome = { status: m >= it.marks ? "correct" : "partial", awarded: m, auto: false, evaluatedBy: evaluatorId, evaluatedAt: new Date(submittedAt.getTime() + DAY), comment: strong ? "Clear, structured answer." : "Covers the basics; missing specifics.", overridden: false };
        }
        delete it._src;
      });
      const result = computeResult(paper, test.sections, test.config, startedAt, submittedAt);
      const status = result.pending > 0 ? "pending_evaluation" : "evaluated";
      // Hiring team published results for candidates who progressed to an offer.
      const published = status === "evaluated" && strong;
      const att = {
        _id: `${D}att-${attempts.length + 1}`,
        assignmentId: a._id,
        testId: test._id,
        candidate: ref,
        candidateKey: a.candidateKey,
        attemptNo: 1,
        status,
        startedAt,
        deadlineAt: new Date(startedAt.getTime() + job.minutes * 60000),
        softDeadlineAt: null,
        submittedAt,
        submitReason: "MANUAL",
        sessionId: "demo",
        seed: rint(1, 1e9),
        config: test.config,
        testName: test.name,
        sectionMode: "free",
        sections: test.sections.map((s) => ({ title: s.title, timeLimitSec: null, startedAt, deadlineAt: null, locked: true })),
        currentSection: 0,
        cursor: paper.length - 1,
        paper,
        answers,
        events: rng() < 0.2 ? [{ type: "tab_hidden", at: new Date(startedAt.getTime() + 240000), detail: "Tab hidden / minimised" }] : [],
        violations: 0,
        client: { startIp: `49.207.${rint(0, 255)}.${rint(1, 254)}`, startUserAgent: "Mozilla/5.0 (demo)", lastIp: null, channel: "portal" },
        result,
        evaluatedAt: status === "evaluated" ? new Date(submittedAt.getTime() + DAY) : null,
        resultPublishedAt: published ? new Date(submittedAt.getTime() + 2 * DAY) : null,
        takenBy: "demo",
        createdAt: startedAt,
        updatedAt: submittedAt,
      };
      att.violations = att.events.length;
      attempts.push(att);
      a.attemptsUsed = 1;
      a.startedAt = startedAt;
      a.result = status === "evaluated" ? { attemptId: att._id, score: result.finalScore, total: result.totalMarks, percentage: result.percentage, passed: result.passed, policy: "highest", attemptsCounted: 1 } : null;
      a.status = status === "pending_evaluation" ? "submitted" : published ? "completed" : "evaluated";
      a.resultPublishedAt = att.resultPublishedAt;
      a.completedAt = att.resultPublishedAt;
      log(startedAt, "start", "attempt", att._id, `${app.name} · ${test.name}`, test._id, "Attempt 1 started", null);
      log(submittedAt, "submit", "attempt", att._id, `${test.name} · attempt 1`, test._id, "MANUAL", null);
      if (status === "evaluated") log(att.evaluatedAt, "result_generated", "result", att._id, `${app.name} · ${test.name}`, test._id, `Attempt 1: ${result.finalScore}/${result.totalMarks} (${result.percentage}%) — ${result.passed ? "passed" : "not passed"}`, evaluatorId);
      if (published) log(att.resultPublishedAt, "result_published", "result", att._id, `${app.name} · ${test.name}`, test._id, "Published by staff");
    }
  }

  await db.collection("ots_questions").insertMany(questions);
  await db.collection("ots_tests").insertMany(tests);
  if (dispatches.length) await db.collection("ots_dispatches").insertMany(dispatches);
  if (assignments.length) await db.collection("ots_assignments").insertMany(assignments);
  if (attempts.length) await db.collection("ots_attempts").insertMany(attempts);
  if (logs.length) await db.collection("ots_activity_logs").insertMany(logs);

  return {
    roles: CAREER_TESTS.length,
    questions: questions.length,
    tests: tests.length,
    rolesWithApplicants: dispatches.length,
    assignments: assignments.length,
    attempts: attempts.length,
    pendingEvaluation: attempts.filter((x) => x.status === "pending_evaluation").length,
  };
}
