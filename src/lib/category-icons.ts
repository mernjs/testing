import { Code, Bot, GraduationCap, Users, Award, type LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/lib/categories";

export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  "software-development": Code,
  "ai-automations": Bot,
  "industrial-training": GraduationCap,
  "resource-augmentation": Users,
  "internship-program": Award,
};
