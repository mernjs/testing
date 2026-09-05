import { NextRequest, NextResponse } from "next/server";
import { createApplication, getOpenJobPositionBySlug, uploadResume } from "@/lib/career-applications";
import { validateApplicationInput, validateResumeFile } from "@/lib/career-application-validation";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Request body must be multipart form data." }, { status: 400 });
  }

  const validation = validateApplicationInput({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    coverNote: formData.get("coverNote"),
    positionSlug: formData.get("positionSlug"),
    source: formData.get("source"),
  });
  if (!validation.valid) {
    return NextResponse.json({ error: "Validation failed.", fields: validation.errors }, { status: 422 });
  }

  if (validation.data.positionSlug) {
    const position = await getOpenJobPositionBySlug(validation.data.positionSlug);
    if (!position) {
      return NextResponse.json(
        { error: "Validation failed.", fields: { positionSlug: "This role is no longer accepting applications." } },
        { status: 422 }
      );
    }
  }

  const resumeEntry = formData.get("resume");
  if (!(resumeEntry instanceof File) || resumeEntry.size === 0) {
    return NextResponse.json({ error: "Validation failed.", fields: { resume: "Resume is required." } }, { status: 422 });
  }
  const resumeError = validateResumeFile(resumeEntry);
  if (resumeError) {
    return NextResponse.json({ error: "Validation failed.", fields: { resume: resumeError } }, { status: 422 });
  }

  let resume;
  try {
    resume = await uploadResume(resumeEntry);
  } catch (err) {
    console.error("Failed to upload resume", err);
    return NextResponse.json({ error: "Failed to upload resume. Please try again." }, { status: 500 });
  }

  try {
    const application = await createApplication({ ...validation.data, resume });
    return NextResponse.json({ data: application }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_POSITION") {
      return NextResponse.json(
        { error: "Validation failed.", fields: { positionSlug: "This role is no longer accepting applications." } },
        { status: 422 }
      );
    }
    console.error("Failed to create application", err);
    return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 });
  }
}
