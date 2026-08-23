"use client";

import CategoryDetail from "@/components/sections/CategoryDetail";
import { getCategoryBySlug } from "../resources-data";

const category = getCategoryBySlug("package-based-team")!;

export default function Content() {
  return <CategoryDetail category={category} />;
}
