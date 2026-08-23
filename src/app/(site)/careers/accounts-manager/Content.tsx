"use client";

import JobDetailContent from "@/components/sections/JobDetailContent";
import { getJobBySlug } from "../jobs-data";

const job = getJobBySlug("accounts-manager")!;

export default function Content() {
  return <JobDetailContent job={job} />;
}
