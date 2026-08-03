import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED = /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|webp)$/;

function mimeFor(fileName: string): string {
  const ext = path.extname(fileName).slice(1).toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "image/png";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const fileName = path.basename(file);

  if (!ALLOWED.test(fileName)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "products",
    fileName
  );

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeFor(fileName),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
