"use client";

import { useState, useEffect, useCallback } from "react";

export interface UploadedDocEntry {
  fileName: string;
  filePath: string;
  uploadedAt: string;
  /** URL publik untuk preview — dikonstruksi dari NEXT_PUBLIC_PUBLIC_ASSET_URL + filePath */
  url: string;
}

type UploadedDocsMap = Record<string, UploadedDocEntry>;

const PUBLIC_ASSET_URL =
  process.env.NEXT_PUBLIC_PUBLIC_ASSET_URL ?? "https://storage.wildcat2026.com";

function storageKey(teamId: string) {
  return `uploaded_docs_${teamId}`;
}

function loadFromStorage(teamId: string): UploadedDocsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(teamId));
    return raw ? (JSON.parse(raw) as UploadedDocsMap) : {};
  } catch {
    return {};
  }
}

function saveToStorage(teamId: string, docs: UploadedDocsMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(teamId), JSON.stringify(docs));
  } catch {
    /* kuota penuh atau private mode — abaikan */
  }
}

/**
 * Mengelola persistence dokumen yang sudah diupload per teamId (localStorage).
 * Agar saat pengguna berpindah halaman dan kembali, preview dokumen tetap tersedia.
 */
export function useUploadedDocuments(teamId: string | undefined) {
  const [docs, setDocs] = useState<UploadedDocsMap>({});

  // Muat dari localStorage saat teamId tersedia
  useEffect(() => {
    if (!teamId) return;
    setDocs(loadFromStorage(teamId));
  }, [teamId]);

  /** Simpan hasil upload. Dipanggil setelah uploadFiles berhasil. */
  const save = useCallback(
    (documentType: string, fileName: string, filePath: string) => {
      if (!teamId) return;
      const entry: UploadedDocEntry = {
        fileName,
        filePath,
        uploadedAt: new Date().toISOString(),
        url: `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`,
      };
      setDocs((prev) => {
        const next = { ...prev, [documentType]: entry };
        saveToStorage(teamId, next);
        return next;
      });
    },
    [teamId]
  );

  /** Hapus entri dokumen (saat pengguna ingin ganti/hapus). */
  const clear = useCallback(
    (documentType: string) => {
      if (!teamId) return;
      setDocs((prev) => {
        const next = { ...prev };
        delete next[documentType];
        saveToStorage(teamId, next);
        return next;
      });
    },
    [teamId]
  );

  /** Ambil satu entri dokumen. */
  const get = useCallback(
    (documentType: string): UploadedDocEntry | null => {
      return docs[documentType] ?? null;
    },
    [docs]
  );

  return { docs, save, clear, get };
}
