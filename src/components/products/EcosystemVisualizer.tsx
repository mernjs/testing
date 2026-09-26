"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lock,
  Bot,
  Users,
  Kanban,
  Filter,
  Search,
  KeyRound,
  Megaphone,
  FileQuestion,
  ShoppingCart,
  GraduationCap,
  MessageSquare,
  Globe,
  ShieldCheck,
  Zap,
  LucideIcon,
} from "lucide-react";

interface SphereData {
  id: string;
  name: string;
  badge: string;
  color: string;
  borderColor: string;
  textColor: string;
  icon: LucideIcon;
  description: string;
  dataFlowTrigger: string;
  products: { name: string; tag: string; icon: LucideIcon }[];
}

export default function EcosystemVisualizer() {
  const [activeSphereId, setActiveSphereId] = useState<string>("growth");

  const spheres: SphereData[] = [
    {
      id: "growth",
      name: "Customer Acquisition & Growth",
      badge: "Inbound & Sales",
      color: "from-primary/20 via-primary/10 to-transparent",
      borderColor: "border-primary/40",
      textColor: "text-primary",
      icon: Filter,
      description: "Inbound site inquiries and AI chatbot interactions feed directly into active sales pipelines and social campaign generators.",
      dataFlowTrigger: "Web Lead Intake → 24/7 AI Qualification → CRM Kanban → Campaign Brief",
      products: [
        { name: "AI Growth & Sales Pipeline (CRM)", tag: "LMS", icon: Filter },
        { name: "SEO Growth Engine", tag: "SEO", icon: Search },
        { name: "Autonomous AI Marketing Studio", tag: "SMMS", icon: Megaphone },
        { name: "Digital Marketing Front Door", tag: "Web", icon: Globe },
      ],
    },
    {
      id: "workforce",
      name: "Workforce & Talent Progression",
      badge: "HR & Education",
      color: "from-secondary/20 via-secondary/10 to-transparent",
      borderColor: "border-secondary/40",
      textColor: "text-secondary-foreground",
      icon: Users,
      description: "Hired job applicants convert instantly into employee records with attendance-linked payroll and proctored skill testing.",
      dataFlowTrigger: "Career Applicant → AI Resume Match → Employee Profile → Biometric Payroll",
      products: [
        { name: "Workforce Intelligence Suite", tag: "HRMS", icon: Users },
        { name: "OTS Assessment Engine", tag: "OTS", icon: FileQuestion },
        { name: "Academy & Talent Platform", tag: "TMS", icon: GraduationCap },
      ],
    },
    {
      id: "operations",
      name: "Operations & Financial Control",
      badge: "Delivery & Finance",
      color: "from-secondary/15 via-primary/5 to-transparent",
      borderColor: "border-secondary/35",
      textColor: "text-secondary-foreground",
      icon: Kanban,
      description: "Project hours logged in timesheets drive real-time profitability tracking, automated client invoices, and spend approvals.",
      dataFlowTrigger: "PMS Timesheet → Profit Margin Calc → PRMS PO Approval → Client Billing",
      products: [
        { name: "Smart Project Operations", tag: "PMS", icon: Kanban },
        { name: "Enterprise Spend Vault", tag: "PRMS", icon: ShoppingCart },
        { name: "YashChat Enterprise Comms", tag: "Chat", icon: MessageSquare },
      ],
    },
    {
      id: "security",
      name: "Security & AI Intelligence",
      badge: "Governance & Vault",
      color: "from-primary/15 via-secondary/10 to-transparent",
      borderColor: "border-primary/35",
      textColor: "text-primary",
      icon: ShieldCheck,
      description: "Super Admin RBAC governance, encrypted credential vaults, isolated client portals, and custom OpenAI vector RAG bots.",
      dataFlowTrigger: "Single Sign-On → Central RBAC Audit → Encrypted Vault → Vector RAG Bot",
      products: [
        { name: "Executive Command Center", tag: "Admin", icon: ShieldCheck },
        { name: "AI Assistant Studio", tag: "AI Bots", icon: Bot },
        { name: "DigiLocker Secret Vault", tag: "DLMS", icon: KeyRound },
        { name: "Stakeholder Portal", tag: "Portal", icon: Lock },
      ],
    },
  ];

  const activeSphere = spheres.find((s) => s.id === activeSphereId) || spheres[0];

  return (
    <div className="relative rounded-3xl border border-border/80 bg-card/90 shadow-2xl p-6 md:p-10 backdrop-blur-2xl overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.03] dark:bg-grid-slate-400/[0.03] pointer-events-none" />

      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
          <Zap className="w-3.5 h-3.5" /> Interactive Ecosystem Synergy
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          How 15 Applications Connect Into One Business Engine
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Click any business sphere below to visualize real-time data flows and cross-module integration triggers.
        </p>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sphere Selector Buttons */}
        <div className="lg:col-span-5 space-y-3">
          {spheres.map((s) => {
            const isSelected = s.id === activeSphereId;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSphereId(s.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? `bg-gradient-to-r ${s.color} ${s.borderColor} shadow-lg ring-1 ring-primary/30 scale-[1.02]`
                    : "bg-muted/30 border-border/50 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isSelected ? `${s.textColor} bg-background/80` : "text-muted-foreground bg-muted/60"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{s.products.length} Products</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${isSelected ? s.textColor : "text-muted-foreground"}`}>
                  {s.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Connected Node Visualizer Canvas */}
        <div className="lg:col-span-7 rounded-2xl border border-border/70 bg-background/90 p-6 shadow-inner space-y-6 relative overflow-hidden">
          {/* Central Platform Engine Node */}
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-1 backdrop-blur-md">
            <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> YashOrbit Platform Core Engine
            </div>
            <p className="text-[11px] text-muted-foreground">
              Single Sign-On Identity • Central RBAC Governance • OpenAI Vector RAG Engine • Executive Stream
            </p>
          </div>

          {/* Animated Connecting Data Flow Line */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono text-primary flex items-center gap-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              REAL-TIME DATA FLOW TRIGGER
            </div>
          </div>

          {/* Active Sphere Detail View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSphere.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-medium text-foreground leading-relaxed">
                <span className="font-bold text-primary">Integration Trigger: </span>
                {activeSphere.dataFlowTrigger}
              </div>

              {/* Connected Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSphere.products.map((prod, idx) => {
                  const ProdIcon = prod.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border/50 bg-card hover:border-primary/40 transition-all flex items-center gap-3 shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <ProdIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-foreground truncate">{prod.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{prod.tag} Panel</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
