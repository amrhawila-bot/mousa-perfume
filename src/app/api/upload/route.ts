import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

export const dynamic = "force-dynamic";

function extensionFor(type: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[type] || null;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "لم يتم إرسال أي ملفات" }, { status: 400 });
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `نوع الملف غير مدعوم: ${file.name}. الأنواع المسموحة: jpg, jpeg, png, webp` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `حجم الملف كبير جداً: ${file.name}. الحد الأقصى 5MB` },
          { status: 400 }
        );
      }
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      const ext = extensionFor(file.type) || "jpg";
      const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
      urls.push(`/uploads/products/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: "فشل رفع الملفات" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const urls: unknown[] = Array.isArray(body?.urls) ? body.urls : [];

    for (const url of urls) {
      if (typeof url !== "string" || !url.startsWith("/uploads/products/")) continue;
      const fileName = path.basename(url);
      if (!ALLOWED_EXTENSIONS.includes(path.extname(fileName).slice(1).toLowerCase())) continue;
      const filePath = path.join(UPLOAD_DIR, fileName);
      if (!filePath.startsWith(UPLOAD_DIR)) continue;
      try {
        await unlink(filePath);
      } catch {
        // ignore missing files
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
