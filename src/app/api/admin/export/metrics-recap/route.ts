import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
  const endpointUrl = `${backendUrl}/api/admin/export/metrics-recap`;

  try {
    // 1. Minta file Excel dari Backend Hono
    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend gagal mengexport:", errorText);
      throw new Error(`Gagal membuat dokumen (Status ${response.status})`);
    }

    // 2. Ambil data sebagai Blob (File mentah)
    const fileBlob = await response.blob();

    // 3. Teruskan file tersebut ke Frontend dengan Header yang tepat untuk Excel
    return new NextResponse(fileBlob, {
      status: 200,
      headers: {
        // MIME type untuk Microsoft Excel (.xlsx)
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // Memaksa browser untuk men-download file dengan nama default
        "Content-Disposition": `attachment; filename="AAPG_Wildcat_Recap.xlsx"`,
      },
    });

  } catch (error: any) {
    console.error("Error pada Export Proxy Next.js:", error.message);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}