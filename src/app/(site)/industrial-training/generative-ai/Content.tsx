"use client";

import {
  Sparkles, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  Braces, Workflow, Database, Boxes, Server, LayoutTemplate, Package,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import TrainingMeta from "@/components/sections/TrainingMeta";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { generativeAiFaqs } from "./faqs";

export default function GenerativeAiContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="industrial training"
        title="Generative AI Training"
        subtitle="Build real products on top of LLMs."
        description="Move beyond prompting ChatGPT and learn to engineer applications on top of large language models — prompt design, retrieval pipelines, fine-tuning, and evaluation, all grounded in shipped projects."
        icon={Sparkles}
        image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Learn to engineer with generative models, not just prompt them"
        paragraphs={[
          "Anyone can type a prompt into a chat window. Building a reliable product on top of a language model is a different skill entirely — it means understanding context windows, embeddings, retrieval, and how to keep a model grounded in your own data.",
          "This program teaches the full applied stack: prompt engineering patterns, working with LLM APIs, building retrieval-augmented generation (RAG) pipelines, and fine-tuning smaller models for specific tasks — all through projects you build and deploy yourself.",
        ]}
        stats={[
          { label: "Duration", value: "10 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Level", value: "Beginner-friendly", icon: BarChart3 },
          { label: "Projects", value: "3 Applied Builds", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "10 Weeks" },
          { icon: Users, label: "Batch Size", value: "12–15 Learners" },
          { icon: Calendar, label: "Schedule", value: "Weekday & Weekend" },
        ]}
      />

      <ChecklistGrid
        id="learn"
        title="What you will learn"
        description="Practical skills for building products around large language models, not just using them."
        items={[
          { title: "Prompt Engineering Patterns", description: "Design reliable prompts using few-shot examples, chain-of-thought, and structured outputs." },
          { title: "Working with LLM APIs", description: "Integrate large language model APIs into real applications with proper error handling." },
          { title: "Embeddings & Vector Search", description: "Convert text into embeddings and search them for semantic relevance." },
          { title: "Retrieval-Augmented Generation", description: "Build RAG pipelines that ground model responses in your own documents and data." },
          { title: "Fine-tuning Fundamentals", description: "Understand when and how to fine-tune or use parameter-efficient methods like LoRA." },
          { title: "Evaluation & Guardrails", description: "Measure output quality and reduce hallucination with evaluation and guardrail techniques." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "LLM APIs", category: "Model Access", icon: Sparkles },
          { name: "LangChain", category: "Orchestration", icon: Workflow },
          { name: "Vector Databases", category: "Semantic Search", icon: Database },
          { name: "Hugging Face", category: "Models & Datasets", icon: Boxes },
          { name: "FastAPI", category: "Backend Framework", icon: Server },
          { name: "Streamlit", category: "Rapid Prototyping", icon: LayoutTemplate },
          { name: "Docker", category: "Deployment", icon: Package },
        ]}
      />

      <CurriculumTimeline
        title="Training roadmap"
        description="From prompting fundamentals to a deployed, retrieval-grounded AI application."
        modules={[
          { title: "LLM & Prompt Engineering Foundations", duration: "2 Weeks", topics: ["How LLMs work", "Prompt patterns", "Few-shot examples", "Structured outputs"] },
          { title: "Building with LLM APIs", duration: "2 Weeks", topics: ["API integration", "Streaming responses", "Rate limits & cost control", "Error handling"] },
          { title: "Embeddings & Retrieval", duration: "2 Weeks", topics: ["Text embeddings", "Vector databases", "Semantic search", "Chunking strategies"] },
          { title: "Retrieval-Augmented Generation", duration: "2 Weeks", topics: ["RAG architecture", "Document pipelines", "Context ranking", "Citations"] },
          { title: "Fine-tuning & Customization", duration: "1 Week", topics: ["Fine-tuning basics", "LoRA & PEFT", "Dataset preparation"] },
          { title: "Evaluation & Capstone Project", duration: "1 Week", topics: ["Output evaluation", "Guardrails", "Deployment", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Applied builds that mirror how companies actually use generative AI today."
        projects={[
          { title: "Document Q&A Assistant", description: "A RAG-powered assistant that answers questions grounded in a private set of documents.", skills: ["Python", "LangChain", "Vector DB"] },
          { title: "AI Content Co-pilot", description: "A writing assistant that generates and refines marketing copy from short briefs.", skills: ["LLM APIs", "Prompt Engineering", "Streamlit"] },
          { title: "Support Ticket Summarizer", description: "A tool that summarizes and tags incoming support tickets to speed up triage.", skills: ["FastAPI", "LLM APIs", "Docker"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Applied AI Problem Briefs", desc: "Work on problem statements modeled after real generative AI product requests." },
              { name: "Mentor Reviews on Prompts & Pipelines", desc: "Get feedback on prompt design and RAG architecture from practicing AI engineers." },
              { name: "Iterative, Evaluation-driven Workflow", desc: "Practice the test-and-refine loop real AI teams use to improve output quality." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Build-and-evaluate Cycles", desc: "Every module ends with shipping something and measuring how well it performs." },
              { name: "1:1 Mentorship", desc: "Weekly sessions with a mentor experienced in applied LLM development." },
              { name: "Applied Assessments", desc: "Evaluated on working pipelines and outputs, not multiple-choice quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Basic Python Knowledge", description: "Comfort reading and writing basic Python is expected; we build API and pipeline skills from there." },
          { title: "Any Educational Background", description: "Open to students, developers, and career switchers curious about applied AI." },
          { title: "No Prior ML Experience Required", description: "We don't require deep machine learning theory — the focus is applied engineering." },
          { title: "Consistent Time Commitment", description: "8–10 hours a week for hands-on practice and project work." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Generative AI Engineer", description: "Build products and pipelines powered by large language models." },
          { title: "AI Application Developer", description: "Integrate LLM capabilities into existing products and workflows." },
          { title: "Prompt Engineer", description: "Design and optimize prompts for reliability, cost, and accuracy." },
          { title: "ML/AI Product Engineer", description: "Bridge product requirements with practical generative AI implementation." },
          { title: "AI Solutions Consultant", description: "Advise businesses on where and how to apply generative AI effectively." },
          { title: "Freelance AI Developer", description: "Deliver LLM-powered features and tools for clients." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Applied, Not Theoretical", desc: "Focused on shipping working AI features, not abstract ML theory." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "Every project is deployed and demoed, not left on a notebook." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={generativeAiFaqs}
      />

      <DetailCTA
        heading="Ready to build products on top of generative AI?"
        description="Join the next batch and go from prompting to shipping deployed, retrieval-grounded AI applications."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
