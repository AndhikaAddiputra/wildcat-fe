/**
 * Manual payment transaction flow:
 *
 * Step 1: POST /api/transactions/request-url
 *   Body: { filename?, content_type? } (backend may require)
 *   Response: { presignedUrl, file_path } or similar
 *
 * Step 2: PUT file to presignedUrl (via /api/upload/put proxy)
 *
 * Step 3: POST /api/transactions/submit-proof
 *   Body: { file_url: string, payment_method: string }
 */

function getPresignedUrl(data: Record<string, unknown>): string | undefined {
  const inner = (data.data ?? data) as Record<string, unknown>;
  return (
    (inner?.presignedUrl as string) ??
    (inner?.presigned_url as string) ??
    (inner?.presigned_put_url as string) ??
    (inner?.putUrl as string) ??
    (inner?.put_url as string) ??
    (inner?.uploadUrl as string) ??
    (inner?.upload_url as string) ??
    (inner?.url as string) ??
    (inner?.signedUrl as string) ??
    (inner?.signed_url as string) ??
    (data.presignedUrl as string) ??
    (data.presigned_url as string) ??
    (data.presigned_put_url as string) ??
    (data.putUrl as string) ??
    (data.upload_url as string) ??
    (data.url as string)
  );
}

function getFilePath(data: Record<string, unknown>): string | undefined {
  const inner = (data.data ?? data) as Record<string, unknown>;
  return (
    (inner?.filePath as string) ??
    (inner?.file_path as string) ??
    (inner?.file_url as string) ??
    (inner?.object_key as string) ??
    (inner?.path as string) ??
    (inner?.key as string) ??
    (data.filePath as string) ??
    (data.file_path as string) ??
    (data.object_key as string) ??
    (data.key as string)
  );
}

export interface SubmitPaymentProofResult {
  success: boolean;
}

export async function submitPaymentProof(
  file: File,
  paymentMethod: string,
  onProgress?: (status: "requesting" | "uploading" | "submitting") => void
): Promise<SubmitPaymentProofResult> {
  onProgress?.("requesting");

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 1: Requesting presigned URL", { filename: file.name, paymentMethod });
  }

  // Step 1: Request presigned URL
  const requestRes = await fetch("/api/transactions/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      filename: file.name,
      content_type: file.type,
    }),
  });

  if (!requestRes.ok) {
    const err = await requestRes.text();
    if (typeof window !== "undefined") {
      console.error("[payment-proof] Step 1 failed:", requestRes.status, err);
    }
    throw new Error(err || `Request URL failed: ${requestRes.status}`);
  }

  const requestData = (await requestRes.json()) as Record<string, unknown>;
  const presignedUrl = getPresignedUrl(requestData);
  const filePath = getFilePath(requestData);

  if (!presignedUrl) {
    if (typeof window !== "undefined") {
      console.error("[payment-proof] Step 1: presigned URL not found in response", {
        responseKeys: Object.keys(requestData ?? {}),
        dataKeys: requestData?.data ? Object.keys(requestData.data as object) : [],
        rawResponse: requestData,
      });
    }
    throw new Error("Invalid response: missing presigned URL");
  }

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 1 complete: presigned URL received", { hasFilePath: !!filePath });
  }

  onProgress?.("uploading");

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 2: Uploading file to storage", { size: file.size, type: file.type });
  }

  // Step 2: PUT file via proxy
  const formData = new FormData();
  formData.set("file", file);
  formData.set("presignedUrl", presignedUrl);
  formData.set("contentType", file.type || "application/octet-stream");
  formData.set("source", "payment_proof");

  const putRes = await fetch("/api/upload/put", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    const msg = (errData as { error?: string }).error || `Upload failed: ${putRes.status}`;
    if (typeof window !== "undefined") {
      console.error("[payment-proof] Step 2 failed:", putRes.status, msg);
    }
    throw new Error(msg);
  }

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 2 complete: file uploaded");
  }

  // file_path from step 1, or construct from storage path
  const fileUrl = filePath || presignedUrl.split("?")[0]?.replace(/^https?:\/\/[^/]+\//, "") || "";

  onProgress?.("submitting");

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 3: Submitting proof", { file_url: fileUrl, payment_method: paymentMethod });
  }

  // Step 3: Submit proof
  const submitRes = await fetch("/api/transactions/submit-proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      file_url: fileUrl,
      payment_method: paymentMethod,
    }),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    if (typeof window !== "undefined") {
      console.error("[payment-proof] Step 3 failed:", submitRes.status, err);
    }
    throw new Error(err || `Submit proof failed: ${submitRes.status}`);
  }

  const submitData = (await submitRes.json()) as Record<string, unknown>;
  const success = submitData?.success === true || (submitData?.data as Record<string, unknown>)?.success === true;

  if (typeof window !== "undefined") {
    console.log("[payment-proof] Step 3 complete: proof submitted", { success });
  }

  return { success };
}
