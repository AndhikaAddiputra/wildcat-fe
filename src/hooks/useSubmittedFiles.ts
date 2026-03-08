"use client";

import { useState, useEffect, useCallback } from "react";

export interface SubmittedFileEntry {
  fileName: string;
  filePath: string;
  submittedAt: string;
  /** URL publik untuk preview — dikonstruksi dari NEXT_PUBLIC_PUBLIC_ASSET_URL + filePath */
  url: string;
}

type SubmittedFilesMap = Record<string, SubmittedFileEntry>;

const PUBLIC_ASSET_URL =
  process.env.NEXT_PUBLIC_PUBLIC_ASSET_URL ?? "https://storage.wildcat2026.com";

function storageKey(teamId: string) {
  return `submitted_files_${teamId}`;
}

function loadFromStorage(teamId: string): SubmittedFilesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(teamId));
    return raw ? (JSON.parse(raw) as SubmittedFilesMap) : {};
  } catch {
    return {};
  }
}

function saveToStorage(teamId: string, files: SubmittedFilesMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(teamId), JSON.stringify(files));
  } catch {
    /* kuota penuh atau private mode — abaikan */
  }
}

/**
 * Mengelola persistence file submission yang sudah diupload per teamId (localStorage).
 * Kunci map = requirementId; mirip useUploadedDocuments tapi untuk submission files.
 */
export function useSubmittedFiles(teamId: string | undefined) {
  const [files, setFiles] = useState<SubmittedFilesMap>({});

  useEffect(() => {
    if (!teamId) return;
    setFiles(loadFromStorage(teamId));
  }, [teamId]);

  /** Simpan hasil submit. Dipanggil setelah submitFile berhasil. */
  const save = useCallback(
    (requirementId: string, fileName: string, filePath: string) => {
      if (!teamId) return;
      const entry: SubmittedFileEntry = {
        fileName,
        filePath,
        submittedAt: new Date().toISOString(),
        url: `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`,
      };
      setFiles((prev) => {
        const next = { ...prev, [requirementId]: entry };
        saveToStorage(teamId, next);
        return next;
      });
    },
    [teamId]
  );

  /** Hapus entri (saat pengguna ingin ganti/hapus). */
  const clear = useCallback(
    (requirementId: string) => {
      if (!teamId) return;
      setFiles((prev) => {
        const next = { ...prev };
        delete next[requirementId];
        saveToStorage(teamId, next);
        return next;
      });
    },
    [teamId]
  );

  /** Ambil satu entri file. */
  const get = useCallback(
    (requirementId: string): SubmittedFileEntry | null => {
      return files[requirementId] ?? null;
    },
    [files]
  );

  return { files, save, clear, get };
}
