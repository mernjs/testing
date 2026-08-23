"use client";

import CategoryDetail from "@/components/sections/CategoryDetail";
import { getCategoryBySlug } from "../resources-data";

const category = getCategoryBySlug("hourly-on-demand")!;

export default function Content() {
  return <CategoryDetail category={category} />;
}
