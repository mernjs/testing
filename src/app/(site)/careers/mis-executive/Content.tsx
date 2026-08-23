"use client";

import JobDetailContent from "@/components/sections/JobDetailContent";
import { getJobBySlug } from "../jobs-data";

const job = getJobBySlug("mis-executive")!;

export default function Content() {
  return <JobDetailContent job={job} />;
}
