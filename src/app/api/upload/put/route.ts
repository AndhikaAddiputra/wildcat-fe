import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/upload/put
 * Menerima file + presignedUrl via FormData, lalu PUT ke presigned URL dari server.
 * Menghindari CORS saat browser PUT langsung ke storage (e.g. R2/S3).
 */
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const presignedUrl = formData.get("presignedUrl");
    const contentType = (formData.get("contentType") as string) || "application/octet-stream";
    const source = formData.get("source") as string | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "FormData must include 'file' (File)" },
        { status: 400 }
      );
    }
    if (!presignedUrl || typeof presignedUrl !== "string") {
      return NextResponse.json(
        { error: "FormData must include 'presignedUrl' (string)" },
        { status: 400 }
      );
    }

    if (source === "payment_proof") {
      const fileInfo = file instanceof File ? { name: file.name, size: file.size, type: file.type } : "blob";
      console.log("[api/upload/put][payment-proof] request — uploading payment proof", fileInfo);
    }

    const blob = file instanceof Blob ? file : await (file as File).arrayBuffer();
    const body = blob instanceof ArrayBuffer ? new Uint8Array(blob) : blob;

    // PUT file ke bucket (R2/S3) — request benar-benar dikirim ke presigned URL
    const putRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body,
    });

    const storageHost = new URL(presignedUrl).host;
    const logPrefix = source === "payment_proof" ? "[api/upload/put][payment-proof]" : "[api/upload/put]";
    console.log(`${logPrefix} response`, {
      status: putRes.status,
      ok: putRes.ok,
      storageHost,
      ...(source === "payment_proof" && { source: "payment_proof" }),
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error(`${logPrefix} storage error`, putRes.status, text);

      // Parse S3/R2 XML error (NoSuchBucket, AccessDenied, dll.)
      let message = `Upload to storage failed: ${putRes.status}`;
      const codeMatch = text.match(/<Code>([^<]+)<\/Code>/);
      const msgMatch = text.match(/<Message>([^<]+)<\/Message>/);
      if (codeMatch || msgMatch) {
        const code = codeMatch?.[1] ?? "";
        const msg = msgMatch?.[1] ?? "";
        message = msg ? `${code ? code + ": " : ""}${msg}` : message;
      }

      return NextResponse.json(
        { error: message },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/upload/put error:", err);
    return NextResponse.json(
      { error: "Failed to upload file to storage" },
      { status: 500 }
    );
  }
}
