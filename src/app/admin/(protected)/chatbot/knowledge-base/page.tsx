import Breadcrumbs from "@/components/admin/Breadcrumbs";
import KnowledgeBaseManager from "@/components/admin/KnowledgeBaseManager";
import { getWebsiteKbSummary, listIndexedPages } from "@/lib/kb-website";
import { getPdfKbSummary, listPdfDocuments } from "@/lib/kb-pdf";
import { listKbRuns } from "@/lib/kb-runs";
import { getChatbotConfig } from "@/lib/chatbot-config";
import { isOpenAIConfigured } from "@/lib/openai";

export default async function KnowledgeBasePage() {
  const [websiteSummary, pages, pdfSummary, pdfs, runs, config] = await Promise.all([
    getWebsiteKbSummary(),
    listIndexedPages(),
    getPdfKbSummary(),
    listPdfDocuments(),
    listKbRuns(15),
    getChatbotConfig(),
  ]);

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "AI Chatbot", href: "/admin/chatbot" },
          { label: "Knowledge Base" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Index website content and documents into the OpenAI vector store the assistant retrieves from.
        </p>
      </div>

      <KnowledgeBaseManager
        openAiConfigured={isOpenAIConfigured()}
        vectorStoreId={config.vectorStoreId}
        websiteSummary={websiteSummary}
        pages={pages}
        pdfSummary={pdfSummary}
        pdfs={pdfs}
        initialRuns={runs}
      />
    </div>
  );
}
