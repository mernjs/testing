import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/api-auth";
import {
  CATEGORIES,
  createLead,
  getSubServices,
  isValidCategory,
  listLeads,
  uploadResume,
  validateLeadInput,
  validateResumeFile,
} from "@/lib/leads";

type Context = { params: Promise<{ category: string }> };

export async function POST(req: NextRequest, { params }: Context) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${CATEGORIES.map((c) => c.slug).join(", ")}` },
      { status: 400 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Request body must be multipart form data." }, { status: 400 });
  }

  const validation = validateLeadInput({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    subService: formData.get("subService"),
    source: formData.get("source"),
  });
  if (!validation.valid) {
    return NextResponse.json({ error: "Validation failed.", fields: validation.errors }, { status: 422 });
  }

  const validSubServices = getSubServices(category);
  if (!validation.data.subService || !validSubServices.some((s) => s.slug === validation.data.subService)) {
    return NextResponse.json(
      { error: "Validation failed.", fields: { subService: "Please choose a specific service." } },
      { status: 422 }
    );
  }

  const resumeEntry = formData.get("resume");
  let resume: Awaited<ReturnType<typeof uploadResume>> | undefined;
  if (resumeEntry instanceof File && resumeEntry.size > 0) {
    const resumeError = validateResumeFile(resumeEntry);
    if (resumeError) {
      return NextResponse.json({ error: "Validation failed.", fields: { resume: resumeError } }, { status: 422 });
    }
    try {
      resume = await uploadResume(resumeEntry);
    } catch (err) {
      console.error("Failed to upload resume", err);
      return NextResponse.json({ error: "Failed to upload resume. Please try again." }, { status: 500 });
    }
  }

  try {
    const lead = await createLead(category, { ...validation.data, resume });
    return NextResponse.json({ data: lead }, { status: 201 });
  } catch (err) {
    console.error("Failed to create lead", err);
    return NextResponse.json({ error: "Failed to save submission. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: Context) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category } = await params;

  if (!isValidCategory(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${CATEGORIES.map((c) => c.slug).join(", ")}` },
      { status: 400 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || undefined;
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const { items, nextCursor } = await listLeads(category, { limit, cursor });
    return NextResponse.json({ data: items, nextCursor });
  } catch (err) {
    console.error("Failed to list leads", err);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}
