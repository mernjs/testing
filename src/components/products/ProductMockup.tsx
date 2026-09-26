"use client";

import React, { useState } from "react";
import { ProductItem } from "@/lib/products-data";
import {
  Lock,
  Globe,
  Activity,
  Zap,
  TrendingUp,
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Kanban,
  Search,
  KeyRound,
  FileQuestion,
  Play,
  Share2,
  DollarSign,
  Database,
  Code2,
  LucideIcon,
} from "lucide-react";

interface ProductMockupProps {
  product: ProductItem;
  initialScreenIndex?: number;
  className?: string;
  showTabSelector?: boolean;
  compact?: boolean;
}

export default function ProductMockup({
  product,
  initialScreenIndex = 0,
  className = "",
  showTabSelector = true,
  compact = false,
}: ProductMockupProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(initialScreenIndex);
  const activeScreen = product.screens[activeScreenIndex] || product.screens[0];

  return (
    <div
      className={`group relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-primary/40 ${className}`}
    >
      {/* Browser Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/70 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 transition-opacity hover:opacity-100" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-4 rounded-md bg-background/60 border border-border/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span className="truncate max-w-[200px]">yashorbit.com{product.panelPath}</span>
          </div>
        </div>

        {/* Screen Tabs Selector */}
        {showTabSelector && product.screens.length > 1 && (
          <div className="flex items-center gap-1 bg-background/50 p-1 rounded-lg border border-border/40">
            {product.screens.map((screen, idx) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreenIndex(idx)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeScreenIndex === idx
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {screen.title.split(" ")[0]}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            <Sparkles className="w-2.5 h-2.5" />
            Live Panel
          </span>
        </div>
      </div>

      {/* Screen Title Bar (if multi-screen) */}
      {showTabSelector && activeScreen && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{activeScreen.title}</span>
            {activeScreen.badge && (
              <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-[10px] font-semibold text-secondary-foreground border border-secondary/20">
                {activeScreen.badge}
              </span>
            )}
          </div>
          <p className="text-muted-foreground hidden md:block text-[11px]">{activeScreen.description}</p>
        </div>
      )}

      {/* Mockup Canvas */}
      <div className={`relative bg-background/95 p-4 md:p-6 overflow-hidden ${compact ? "min-h-[220px]" : "min-h-[340px]"}`}>
        {renderMockupContent(activeScreen?.mockupType || "admin-overview")}
      </div>

      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60" />
    </div>
  );
}

function renderMockupContent(type: string) {
  switch (type) {
    case "admin-overview":
    case "admin-ai-ledger":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricWidget label="Active Platform Revenue" value="$284,500" change="+18.4%" icon={TrendingUp} color="emerald" />
            <MetricWidget label="Active Projects (PMS)" value="34 Live" change="100% On Track" icon={Activity} color="blue" />
            <MetricWidget label="OpenAI Token Ledger" value="4.2M Tokens" change="Est. $64.20" icon={Bot} color="purple" />
            <MetricWidget label="Headcount (HRMS)" value="142 Staff" change="98.2% Active" icon={Users} color="amber" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-foreground">
                <Activity className="w-4 h-4 text-primary" /> Super Admin Live Stream (15 Panels Synchronized)
              </span>
              <span className="text-emerald-500 font-mono text-[11px]">LIVE 60fps</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border/40">
                <span className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> LMS Lead qualification completed</span>
                <span className="text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border/40">
                <span className="flex items-center gap-2 text-foreground"><Bot className="w-3.5 h-3.5 text-purple-500" /> AI Bots Studio executed ProposalGPT</span>
                <span className="text-muted-foreground">12s ago</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border/40">
                <span className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> PRMS PO #8492 Approved by CFO</span>
                <span className="text-muted-foreground">1m ago</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "hrms-overview":
    case "hrms-recruitment":
    case "hrms-payroll":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Total Employees" value="142 Staff" change="9 Departments" icon={Users} color="teal" />
            <MetricWidget label="Monthly Payroll" value="$185,200" change="Biometric Verified" icon={DollarSign} color="emerald" />
            <MetricWidget label="AI Resume Score" value="94% Match" change="12 Shortlisted" icon={Sparkles} color="purple" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-semibold text-foreground mb-2 flex items-center justify-between">
              <span>Recruitment AI Candidate Pipeline</span>
              <span className="text-primary text-[11px] font-mono">Synced with Careers Page</span>
            </div>
            <CandidateRow name="Sarah Jenkins" role="GenAI Engineer" score="98% AI Match" status="Shortlisted" />
            <CandidateRow name="David Miller" role="Full Stack MERN" score="92% AI Match" status="Interview Scheduled" />
            <CandidateRow name="Elena Rostova" role="UI/UX Lead" score="89% AI Match" status="Offer Sent" />
          </div>
        </div>
      );

    case "pms-board":
    case "pms-analytics":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Active Projects" value="28 Delivery" change="100% Guarded" icon={Kanban} color="blue" />
            <MetricWidget label="Logged Timesheets" value="1,840 hrs" change="Billing Ready" icon={Clock} color="cyan" />
            <MetricWidget label="Avg Profit Margin" value="38.5%" icon={TrendingUp} color="emerald" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <KanbanCol title="In Progress" count={4} items={["Enterprise Portal v2.0", "AI Search Engine Optimization"]} />
            <KanbanCol title="Quality Testing" count={2} items={["DLMS Vault Encryption Audit"]} />
            <KanbanCol title="Completed & Billed" count={8} items={["OTS Assessment Engine"]} />
          </div>
        </div>
      );

    case "lms-pipeline":
    case "lms-ai-agent":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Total Inbound Leads" value="482 / mo" change="+34% MoM" icon={Users} color="rose" />
            <MetricWidget label="24/7 AI Qualification" value="99.4%" change="0s Lag" icon={Bot} color="purple" />
            <MetricWidget label="Pipeline Value" value="$1.42M" change="High Intent" icon={TrendingUp} color="emerald" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Bot className="w-4 h-4 text-purple-500" /> Live AI Voice & Chat Assistant Transcript
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">Autonomous AI Active</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <ChatBubble sender="Prospect" text="Hi, we need an AI-powered HRMS and assessment portal built." align="left" />
              <ChatBubble sender="YashOrbit AI Assistant" text="Great! YashOrbit offers integrated HRMS with AI candidate matching and OTS online testing. Can I get your work email to send a customized demo proposal?" align="right" ai />
              <ChatBubble sender="Prospect" text="Sure, alex@enterprise.com. We have 200 employees." align="left" />
            </div>
          </div>
        </div>
      );

    case "aibots-factory":
    case "aibots-chat":
    case "aibots-analytics":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Active Enterprise Bots" value="12 Bots" change="RAG Vector Indexed" icon={Bot} color="violet" />
            <MetricWidget label="Private Vector KB" value="48 Documents" change="100% Encrypted" icon={Database} color="indigo" />
            <MetricWidget label="Token Spend Ledger" value="$42.10 / mo" change="OpenAI GPT-4o" icon={Sparkles} color="fuchsia" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> Active RAG Bot Catalog</span>
              <span className="text-violet-400 text-[11px] font-mono">+ Create New Bot</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <BotCard name="ProposalGPT" kb="24 Sales Files" model="GPT-4o" usage="1.2k chats" />
              <BotCard name="Requirement Analyzer AI" kb="12 Spec Files" model="GPT-4o" usage="840 chats" />
              <BotCard name="Tech Interview AI" kb="16 Question Banks" model="GPT-4o-mini" usage="620 chats" />
              <BotCard name="Legal & Compliance AI" kb="8 Policy Files" model="GPT-4o" usage="310 chats" />
            </div>
          </div>
        </div>
      );

    case "smms-generator":
    case "smms-reels":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Multi-Platform Output" value="6 Channels" change="IG, YT, LinkedIn, FB" icon={Share2} color="pink" />
            <MetricWidget label="AI Video Reels" value="18 Generated" change="Scene Scripts Ready" icon={Play} color="rose" />
            <MetricWidget label="Brand Voice Compliance" value="100% Context" change="Direct Panel Sync" icon={CheckCircle2} color="emerald" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-500" /> AI Reel Script Generator (Scene-by-Scene)</span>
              <span className="text-pink-400 text-[11px]">Ready for Approval</span>
            </div>
            <div className="bg-background/80 p-3 rounded-lg border border-border/50 font-mono space-y-1 text-[11px]">
              <p className="text-muted-foreground"><strong className="text-primary">Hook (0-3s):</strong> &quot;Stop using 10 separate SaaS tools for your company!&quot;</p>
              <p className="text-muted-foreground"><strong className="text-foreground">Scene 1 (3-8s):</strong> Show unified Staff Hub SSO launcher with 15 integrated panels.</p>
              <p className="text-muted-foreground"><strong className="text-foreground">CTA (8-15s):</strong> &quot;Visit YashOrbit.com to explore the complete AI ecosystem.&quot;</p>
            </div>
          </div>
        </div>
      );

    case "ots-builder":
    case "ots-exam":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Question Formats" value="17 Types" change="Code, SQL, Video, MCQ" icon={FileQuestion} color="indigo" />
            <MetricWidget label="Exam Security" value="Server Guarded" change="Anti-Cheat Proctor" icon={ShieldAlert} color="amber" />
            <MetricWidget label="Automated Evaluation" value="Instant" change="Objective & Code" icon={CheckCircle2} color="emerald" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-indigo-500" /> Candidate Coding Exam Sandbox</span>
              <span className="text-emerald-500 font-mono text-[11px]">Timer: 44m 20s remaining</span>
            </div>
            <div className="bg-background/90 p-3 rounded-lg border border-border/50 font-mono text-[11px] text-muted-foreground space-y-1">
              <p className="text-purple-400 font-mono">{"// Task 2: Implement AI resume similarity scoring function"}</p>
              <p><span className="text-blue-400">function</span> <span className="text-amber-400">calculateSimilarity</span>(candidate, requirement) &#123;</p>
              <p className="pl-4">return openAiVectorStore.<span className="text-emerald-400">search</span>(candidate.embedding);</p>
              <p>&#125;</p>
            </div>
          </div>
        </div>
      );

    case "seo-audit":
    case "seo-editor":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Site Audit Score" value="98 / 100" change="50+ Checks Clean" icon={Search} color="purple" />
            <MetricWidget label="Dynamic Meta Tags" value="Live No-Deploy" change="Instant Publish" icon={Zap} color="amber" />
            <MetricWidget label="Keyword Tracking" value="142 Tracked" change="+14 Top 3" icon={TrendingUp} color="emerald" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>Dynamic Meta Tag & Schema Publisher</span>
              <span className="text-emerald-500 font-mono text-[11px]">No Deployment Needed</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded bg-background border border-border/40 flex justify-between">
                <span className="text-foreground">Page Title: YashOrbit — AI-Powered Software Platform</span>
                <span className="text-emerald-400">Published</span>
              </div>
              <div className="p-2 rounded bg-background border border-border/40 flex justify-between">
                <span className="text-muted-foreground">JSON-LD Schema: SoftwareApplication Schema</span>
                <span className="text-emerald-400 font-mono">Validated</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "dlms-vault":
    case "dlms-expiry":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Company Secrets" value="84 Credentials" change="100% Encrypted" icon={KeyRound} color="amber" />
            <MetricWidget label="Secret Reveal Audit" value="Fully Logged" change="Masked by Default" icon={Lock} color="emerald" />
            <MetricWidget label="Expiry Alerts" value="0 Expired" change="Daily Sweeps Active" icon={ShieldAlert} color="blue" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-amber-500" /> Multi-Tenant Client Vault</span>
              <span className="text-muted-foreground text-[11px]">Role Gated</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <VaultItem title="AWS Production Cloud" username="admin@yashorbit.com" secret="••••••••••••••••" status="Audit Logged" />
              <VaultItem title="MongoDB Enterprise Cluster" username="dba_prod" secret="••••••••••••••••" status="Audit Logged" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <MetricWidget label="Integrated Panels" value="15 Systems" change="Single Identity" icon={Globe} color="blue" />
            <MetricWidget label="AI-Powered" value="100% Embedded" change="OpenAI RAG" icon={Bot} color="purple" />
            <MetricWidget label="Security Audit" value="100% RBAC" change="Real Time" icon={CheckCircle2} color="emerald" />
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>YashOrbit Enterprise Ecosystem Control</span>
              <span className="text-emerald-500 font-mono text-[11px]">Active Suite</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Provides unified access, role governance, real-time analytics, and embedded AI automation across all enterprise operations.
            </p>
          </div>
        </div>
      );
  }
}

/* Helper Micro-Components */
function MetricWidget({
  label,
  value,
  change,
  icon: Icon,
  color = "blue",
}: {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    teal: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    cyan: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    pink: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    fuchsia: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border border-border/50 bg-background/80 p-3 shadow-sm backdrop-blur-md transition-all hover:border-primary/30">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-muted-foreground truncate">{label}</span>
        <div className={`p-1.5 rounded-lg border ${style}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-base font-extrabold tracking-tight text-foreground">{value}</div>
      {change && <div className="text-[10px] font-semibold text-emerald-500 mt-0.5">{change}</div>}
    </div>
  );
}

function CandidateRow({ name, role, score, status }: { name: string; role: string; score: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-background/90 border border-border/40 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-foreground">{name}</div>
          <div className="text-[10px] text-muted-foreground">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20">
          {score}
        </span>
        <span className="text-[10px] font-medium text-emerald-500">{status}</span>
      </div>
    </div>
  );
}

function KanbanCol({ title, count, items }: { title: string; count: number; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-2.5 space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
        <span>{title}</span>
        <span className="px-1.5 py-0.5 rounded bg-background text-[10px] border border-border/40">{count}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="p-2 rounded bg-background/90 border border-border/40 text-[11px] font-medium text-foreground shadow-xs">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ sender, text, align, ai }: { sender: string; text: string; align: "left" | "right"; ai?: boolean }) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}>
      <span className="text-[9px] text-muted-foreground mb-0.5">{sender}</span>
      <div
        className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed ${
          ai
            ? "bg-purple-600/20 text-foreground border border-purple-500/30 rounded-tr-xs"
            : align === "right"
            ? "bg-primary text-primary-foreground rounded-tr-xs"
            : "bg-background border border-border/50 text-foreground rounded-tl-xs"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function BotCard({ name, kb, model, usage }: { name: string; kb: string; model: string; usage: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-background/90 border border-border/40 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
          <Bot className="w-3 h-3 text-purple-400" /> {name}
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">{model}</span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>KB: {kb}</span>
        <span>{usage}</span>
      </div>
    </div>
  );
}

function VaultItem({ title, username, secret, status }: { title: string; username: string; secret: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-background border border-border/40">
      <div>
        <div className="font-semibold text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground">{username}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-muted-foreground">{secret}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{status}</span>
      </div>
    </div>
  );
}
