"use client";

import CategoryDetail from "@/components/sections/CategoryDetail";
import { getCategoryBySlug } from "../resources-data";

const category = getCategoryBySlug("project-based")!;

export default function Content() {
  return <CategoryDetail category={category} />;
}
