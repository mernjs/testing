import type { Metadata } from "next";
import RoboticProcessAutomationContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Robotic Process Automation (RPA) | YashOrbit AI & Automations";
const description =
  "Automate repetitive desktop, web, and legacy software tasks with intelligent software robots that fill forms, extract data, and bridge system gaps — built by YashOrbit Technologies.";
const path = "/ai-automations/robotic-process-automation";
const image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "robotic process automation",
    "RPA services",
    "software bots",
    "UI automation",
    "legacy system automation",
    "desktop automation",
    "YashOrbit RPA",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function RoboticProcessAutomationPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Robotic Process Automation", description, path, category: "AI & Process Automation" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path: "/ai-automations" },
      { name: "Robotic Process Automation", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <RoboticProcessAutomationContent />
    </>
  );
}
