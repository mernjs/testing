export const documentFaqs = [
  {
    question: "What types of documents can your IDP pipeline process?",
    answer: "Our pipelines can handle any structured or semi-structured document type — invoices, purchase orders, contracts, application forms, claim forms, identity documents, clinical notes, lab reports, and more. We can process PDFs, scanned images (including handwritten), Word documents, Excel files, and email attachments. We assess your specific document corpus during discovery to confirm accuracy expectations.",
  },
  {
    question: "What accuracy can we expect from automated document extraction?",
    answer: "Accuracy depends heavily on document quality and complexity. For digital, well-structured documents like standard invoices, we typically achieve 95%+ field extraction accuracy. For variable-layout or handwritten documents, accuracy rates depend on scan quality and field complexity. We establish a clear accuracy benchmark during discovery and validate against it before launch — and build a human review queue for documents that fall below the confidence threshold.",
  },
  {
    question: "How does the system handle documents it isn't confident about?",
    answer: "Every extracted field carries a confidence score. Documents or fields below a defined threshold are queued for human review through a lightweight interface that shows the original document alongside the extracted values — making correction fast. Corrections feed back into the model, improving accuracy over time.",
  },
  {
    question: "Can the pipeline handle documents from different suppliers with different formats?",
    answer: "Yes. Unlike template-based extraction that requires one template per supplier, our models identify fields based on contextual understanding of what a field means — not where it appears on the page. This means the same pipeline handles dozens of supplier invoice layouts without per-supplier configuration.",
  },
  {
    question: "How does extracted data get into our ERP or other systems?",
    answer: "We build direct integration connectors into your downstream systems — ERP (SAP, Oracle, Tally), document management, databases, or custom APIs. Validated data is pushed directly into the target system without any manual re-keying. We can also trigger downstream workflow steps — like an approval routing — when data is successfully extracted.",
  },
  {
    question: "Is the system compliant with data protection requirements?",
    answer: "We build with data security and compliance requirements as core constraints. This includes encryption in transit and at rest, role-based access controls for the review queue, audit logs for every document processed, and data residency options where required. For healthcare document types, we design with HIPAA-aligned handling requirements.",
  },
];
