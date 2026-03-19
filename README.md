# Wildcat FE

Frontend Next.js untuk **Wildcat 2026** — platform kompetisi petroleum geoscience (PaPos, BCC, GnG, Essay) dengan fitur registrasi, administrasi dokumen, pembayaran, dan submission.

## Dokumentasi Lengkap

📖 **[DOCUMENTATION.md](./DOCUMENTATION.md)** — Dokumentasi lengkap aplikasi meliputi:

- Ringkasan proyek & kompetisi
- Tech stack & struktur proyek
- Alur autentikasi & role-based access
- Rute, API, dan fitur utama
- Konstanta, environment variables, deployment

## Quick Start

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Pastikan backend berjalan di `NEXT_PUBLIC_BACKEND_URL` (default: `http://localhost:3030`).

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Supabase Auth** (Google OAuth)
- **Tailwind CSS 4**
- **OpenNext + Cloudflare Workers** (deployment)

## Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run cf-build` | Build untuk Cloudflare Workers |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Environment

Buat file `.env.local` dengan variabel wajib:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_URL` (atau `BACKEND_URL`)
- `MAYAR_API_KEY` (untuk pembayaran online)

Lihat [DOCUMENTATION.md](./DOCUMENTATION.md#10-environment-variables) untuk daftar lengkap.
