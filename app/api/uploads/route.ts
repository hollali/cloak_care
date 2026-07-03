import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("file");
  if (!fileName) {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  const safeName = path.basename(fileName);
  const filePath = path.join(process.cwd(), "private", "uploads", safeName);

  try {
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const mime: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };
    return new NextResponse(buffer, {
      headers: { "Content-Type": mime[ext] || "application/octet-stream" },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
