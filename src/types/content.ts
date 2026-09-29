/**
 * Shapes of the website's content records (blog posts, jobs, engagement
 * models, products). Types only — the records themselves live in the CMS.
 */
import type { LucideIcon } from "lucide-react";

export interface JobListItem {
  title: string;
  description: string;
}

export type JobStatus = "published" | "draft" | "closed" | "expired";

export interface BaseSalary {
  currency: string;
  minValue?: number;
  maxValue?: number;
  value?: number;
  unitText: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
}

export interface Job {
  slug: string;
  title: string;
  category: string;
  icon: LucideIcon;
  summary: string;
  employmentType: string;
  location: string;
  experience: string;
  responsibilities: JobListItem[];
  qualifications: JobListItem[];
  niceToHave: string[];
  skills: string[];
  status?: JobStatus;
  datePosted?: string;
  validThrough?: string;
  baseSalary?: BaseSalary;
  isRemote?: boolean;
}

export interface JobCategory {
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface ListItem {
  title: string;
  description: string;
}

export interface HiringStep {
  title: string;
  duration: string;
  topics: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CardHighlight {
  engagementModel: string;
  idealUseCase: string;
  teamComposition: string;
  pricing: string;
  billingType: string;
  hiringDuration: string;
}

export interface SubOption {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  points: string[];
  price: string;
  featured?: boolean;
}

export interface EngagementCategory {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  summary: string;
  cardHighlight: CardHighlight;
  keyBenefits: string[];
  features: ListItem[];
  overview: ListItem[];
  idealUseCase: string[];
  subOptions: SubOption[];
  subOptionsIntro: string;
  deliverables: string[];
  pricingIntro: string;
  hiringProcess: HiringStep[];
  faqs: Faq[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: string;
  keywords: string[];
  /** Short, chip-friendly tags shown on blog cards — distinct from the longer SEO `keywords`. */
  tags: string[];
  image: string;
  imageAlt: string;
  author: string;
  date: string;
  readTime: string;
  /** Slugs of the 3 most topically relevant other posts, used for the "Related reading" block. */
  related: string[];
  /** Icon-map key shown with the post's category. */
  icon?: string;
}

export interface ProductScreen {
  id: string;
  title: string;
  description: string;
  badge?: string;
  mockupType: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  aiPowered?: boolean;
}

export interface Hotspot {
  id: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  title: string;
  description: string;
  badge?: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  category: "Executive & Operations" | "HR & Talent" | "Project & Delivery" | "Procurement & Finance" | "Sales & Marketing" | "AI & Intelligence" | "Assessment & Security";
  panelPath: string;
  iconName: string;
  icon: LucideIcon;
  shortDescription: string;
  fullDescription: string;
  primaryPurpose: string;
  problemSolved: string;
  businessOutcome: string;
  targetDepartments: string[];
  targetUsers: string[];
  aiCapabilities: string[];
  keyFeatures: ProductFeature[];
  metrics: { label: string; value: string }[];
  screens: ProductScreen[];
  hotspots: Hotspot[];
  accentColor: string;
  isFeatured?: boolean;
}
