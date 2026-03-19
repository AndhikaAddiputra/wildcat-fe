# Dokumentasi Wildcat FE

Dokumentasi lengkap aplikasi frontend **Wildcat 2026** — platform kompetisi petroleum geoscience (PaPos, BCC, GnG, Essay) dengan fitur registrasi, administrasi dokumen, pembayaran (Mayar.id + manual), dan submission.

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Alur Autentikasi](#4-alur-autentikasi)
5. [Role & Akses](#5-role--akses)
6. [Rute & Halaman](#6-rute--halaman)
7. [API Routes](#7-api-routes)
8. [Fitur Utama](#8-fitur-utama)
9. [Konstanta & Konfigurasi](#9-konstanta--konfigurasi)
10. [Environment Variables](#10-environment-variables)
11. [Deployment](#11-deployment)

---

## 1. Ringkasan Proyek

**Wildcat FE** adalah aplikasi Next.js yang berfungsi sebagai frontend untuk event **Wildcat 2026** (AAPG Student Chapter ITB). Aplikasi ini menghubungkan peserta, committee, dan admin dengan backend Hono melalui API proxy.

### Kompetisi yang Didukung

| ID | Nama |
|----|------|
| `paper-poster` | Paper & Poster Competition (PaPos) |
| `business-case` | Business Case Competition (BCC) |
| `gng-case` | GnG Case Study Competition |
| `high-school-essay` | High School Essay Competition |

### Fitur Inti

- **Registrasi** multi-step (login Google → data tim → anggota)
- **Administrasi** dokumen (KTM, Twibbon, Poster) dan pembayaran
- **Pembayaran** via Mayar.id (online) atau transfer manual (verifikasi committee)
- **Submission** per kompetisi (preliminary & final)
- **Events** dengan RSVP dan link eksternal
- **Committee** verifikasi dokumen & pembayaran
- **Admin** statistik, akses committee, pengumuman

---

## 2. Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **React** | 19.2.3 |
| **Auth** | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`) |
| **Styling** | Tailwind CSS 4 |
| **UI** | Lucide React, clsx, tailwind-merge, sonner (toast) |
| **Deployment** | OpenNext + Cloudflare Workers (`@opennextjs/cloudflare`) |
| **Storage** | Cloudflare R2 (via backend presigned URLs) |

---

## 3. Struktur Proyek

```
wildcat-fe/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Rute publik (tanpa auth)
│   │   │   ├── landing/          # Landing page
│   │   │   ├── login/            # Login Google OAuth
│   │   │   └── register/         # Registrasi multi-step
│   │   ├── (dashboard)/          # Rute dashboard (protected)
│   │   │   ├── home/             # Home peserta
│   │   │   ├── teams/            # Profil tim & anggota
│   │   │   ├── administration/   # Dokumen & pembayaran
│   │   │   ├── events/           # Daftar event
│   │   │   ├── submission/       # BCC, GnG, Essay, PaPos
│   │   │   ├── committee/        # Dashboard committee
│   │   │   └── admin/            # Dashboard admin
│   │   ├── api/                  # API routes (proxy ke backend)
│   │   └── auth/callback/        # OAuth callback
│   ├── components/
│   │   ├── ui/                   # Button, Card, Modal, Navbar, Footer, dll.
│   │   └── shared/               # FileUploadZone, ContactFAB
│   ├── config/
│   │   └── navbar-config.tsx     # Nav links per role
│   ├── hooks/                    # useAuth, useTeamProfile, useEvents, dll.
│   ├── lib/
│   │   ├── api/                  # backend.ts, fetchWithAuth, types
│   │   ├── constants/            # competitions, roles, document-types, dll.
│   │   ├── mayar/                # Mayar payment client
│   │   ├── supabase/             # Supabase client/server
│   │   └── utils/
│   └── services/                 # auth, mayar, transaction, upload, submission
├── public/                       # Static assets (SVG, gambar)
├── dev.vars                      # Env lokal (Cloudflare/Wrangler)
├── wrangler.toml                 # Konfigurasi Cloudflare Workers
├── open-next.config.ts           # OpenNext untuk Cloudflare
└── next.config.ts
```

---

## 4. Alur Autentikasi

### Login

1. User membuka `/login`
2. Klik "Login with Google" → `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Redirect ke Google OAuth, lalu kembali ke `/auth/callback?code=...`

### Callback (`/auth/callback`)

1. Tukar `code` dengan session via `exchangeCodeForSession`
2. Panggil backend `GET /api/admin/me` untuk cek role
3. **Jika Admin** → redirect ke `/admin/home`
4. **Jika Committee** → redirect ke `/committee/home`
5. **Jika Participant**:
   - Panggil `GET /api/landing/check-registration`
   - `registered && isCompleted` → `/home`
   - `registered && !isCompleted` → `/home`
   - Belum daftar → `/register?step=2`

### Middleware

- **Public paths**: `/`, `/landing`, `/login`, `/register`, `/auth/callback` — tidak perlu auth
- **API routes** (`/api/*`): tidak dicek di middleware (auth per route)
- **Protected routes**: wajib punya session; jika tidak → redirect ke `/login`
- **Role checks**:
  - Committee paths (`/committee/*`) → hanya committee/admin
  - Admin paths (`/admin/*`) → hanya admin
  - Participant paths (`/home`, `/teams`, dll.) → hanya participant

---

## 5. Role & Akses

| Role | Prefix Path | Akses |
|------|-------------|-------|
| **Participant** | `/home`, `/teams`, `/administration`, `/events`, `/submission` | Dashboard peserta, tim, administrasi, submission |
| **Committee** | `/committee/*` | Verifikasi dokumen & pembayaran, lihat submission |
| **Admin** | `/admin/*` | Statistik, akses committee, pengumuman, export |

---

## 6. Rute & Halaman

### Public

| Rute | Deskripsi |
|------|------------|
| `/` | Root → redirect ke landing |
| `/landing` | Landing page (About, Competitions, Events, Timeline) |
| `/login` | Login Google OAuth |
| `/register` | Registrasi multi-step (Step 1–3) |
| `/auth/callback` | OAuth callback, redirect berdasarkan role |

### Participant

| Rute | Deskripsi |
|------|------------|
| `/home` | Dashboard home peserta |
| `/teams` | Profil tim & data anggota |
| `/administration` | Upload dokumen (KTM, Twibbon, Poster), pembayaran |
| `/events` | Daftar event & link RSVP |
| `/submission` | Dispatcher → halaman submission per kompetisi |
| `/submission/bcc` | Submission BCC |
| `/submission/gng` | Submission GnG |
| `/submission/essay` | Submission Essay |
| `/submission/papos` | Submission PaPos |

### Committee

| Rute | Deskripsi |
|------|------------|
| `/committee/home` | Dashboard committee |
| `/committee/verification` | Verifikasi dokumen & pembayaran |
| `/committee/submission` | Lihat submission tim per kompetisi |

### Admin

| Rute | Deskripsi |
|------|------------|
| `/admin/home` | Statistik kompetisi & event |
| `/admin/access` | Manajemen akses committee |
| `/admin/announcement` | Manajemen pengumuman |

---

## 7. API Routes

API routes di frontend bertindak sebagai **proxy** ke backend Hono. Client memanggil `/api/...` (same-origin), lalu Next.js mem-forward ke `NEXT_PUBLIC_BACKEND_URL`.

### Auth

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/auth/callback` | GET | OAuth callback, tukar code → session, redirect |

### Registrasi

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/landing/register/step1` | POST | Proxy: buat tim (Step 1) |
| `/api/landing/register/complete` | POST | Proxy: selesaikan registrasi (Step 2) |
| `/api/landing/check-registration` | GET | Proxy: cek status registrasi |
| `/api/landing/team` | GET | Proxy: ambil profil tim |

### Pembayaran

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/payment/token` | POST | Buat link pembayaran Mayar |
| `/api/payment/status` | GET | Cek status pembayaran |
| `/api/payment/callback` | POST | Mayar webhook → forward ke backend |
| `/api/mayar/webhook` | POST | Mayar webhook (payment.received) → backend confirm |
| `/api/transactions` | GET | Ambil transaksi tim |
| `/api/transactions/request-url` | POST | Presigned URL untuk bukti pembayaran manual |
| `/api/transactions/submit-proof` | POST | Submit bukti pembayaran manual |
| `/api/transactions/preview` | GET | Preview bukti pembayaran |

### Upload

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/upload/sign` | POST | Presigned URL untuk upload |
| `/api/upload/put` | POST | Proxy PUT ke storage (R2) |
| `/api/upload/confirm` | POST | Konfirmasi upload selesai |

### Submission

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/submissions` | GET | Daftar submission tim |
| `/api/submissions/request-url` | POST | Presigned URL untuk file submission |
| `/api/submission/essay` | POST | Submission Essay |
| `/api/submission/bcc` | POST | Submission BCC |
| `/api/submission/bcc/final` | POST | Submission final BCC |
| `/api/submission/gng` | POST | Submission GnG |
| `/api/submission/gng/final` | POST | Submission final GnG |
| `/api/submission/papos` | POST | Submission PaPos |
| `/api/submission/papos/final` | POST | Submission final PaPos |

### Admin

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/admin/me` | GET | Role user saat ini |
| `/api/admin/teams` | GET | Daftar tim |
| `/api/admin/committee` | GET/POST/PATCH | CRUD committee |
| `/api/admin/transactions` | GET | Daftar transaksi |
| `/api/admin/transactions/[id]/verify` | POST | Verifikasi pembayaran manual |
| `/api/admin/submissions` | GET | Daftar submission |
| `/api/admin/submissions/download` | GET | Download file submission |
| `/api/admin/documents/teams` | GET | Dokumen tim |
| `/api/admin/verify` | POST | Verifikasi dokumen tim |
| `/api/admin/attendance` | GET/POST | Kehadiran event |
| `/api/admin/metrics` | GET | Metrik kompetisi & event |
| `/api/admin/export/metrics-recap` | GET | Export recap metrik |
| `/api/admin/announcements` | GET/POST/PATCH | CRUD pengumuman |

### Lainnya

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/events` | GET | Daftar event |
| `/api/announcements` | GET | Pengumuman publik |
| `/api/guidebooks` | GET | URL guidebook |

---

## 8. Fitur Utama

### 8.1 Registrasi

- **Step 1**: Login Google (di `/register` atau `/login`)
- **Step 2**: Data tim (nama tim, leader, universitas, jurusan, kompetisi)
- **Step 3**: Data anggota (maksimal per kompetisi: PaPos=3, GnG=3, BCC=3, Essay=1)

Proksi ke backend: `POST /api/landing/register/step1`, `POST /api/landing/register/complete`.

### 8.2 Administrasi (Peserta)

**Dokumen:**
- KTM (leader, m1, m2)
- Twibbon proof (harus mencakup semua anggota tim)
- Poster/IG proof (link Instagram + Poster)

**Alur upload:** Sign → PUT → Confirm (presigned URLs ke R2).

**Pembayaran:**
- **Mayar**: `requestPaymentToken()` → redirect ke link Mayar; webhook konfirmasi pembayaran.
- **Manual**: `submitPaymentProof()` → request presigned URL → PUT → submit proof; committee verifikasi.

**Tab pembayaran:**
- Indonesian University: Mayar + IDR
- International University: USD wire transfer (manual)

Setelah pembayaran terverifikasi: link "Join Coordination Group" (LINE per kompetisi).

### 8.3 Pembayaran (Mayar + Manual)

**Mayar:**
- `POST /api/payment/token` → backend buat order → Mayar `payment/create` → link dikembalikan
- Webhook: `/api/mayar/webhook` dan `/api/payment/callback` forward ke backend

**Manual:**
- `POST /api/transactions/request-url` → PUT file → `POST /api/transactions/submit-proof`

### 8.4 Submission

Per kompetisi: BCC, GnG, Essay, PaPos. Stage-based: preliminary vs final (lihat `COMPETITION_STAGE_IDS`).

### 8.5 Events

Daftar event dari backend. Link RSVP di `EVENT_REGISTRATION_LINKS` (field-trip, grand-seminar, wishare).

### 8.6 Contact FAB

Floating Action Button menampilkan semua kontak (IT, tiap kompetisi, Event) di setiap halaman dashboard. Kontak: GnG (Davin), BCC (Tiara), Essay (Syifa), Papos (Fikri), Event (Aurel), IT (Andhika, Atharizza).

### 8.7 Modal Kompetisi & Event

- Tombol "Register Now" di modal kompetisi → `/register`
- Modal event: tombol "Register Now" disabled jika status bukan `available`; status dihitung H-14; webinar selalu "Event Ended"
- Link RSVP per event: Field Trip, Grand Seminar, WISHARE

---

## 9. Konstanta & Konfigurasi

| File | Deskripsi |
|------|-----------|
| `src/lib/constants/roles.ts` | `ROLES`, `PUBLIC_PATHS`, `PARTICIPANT_PREFIXES`, `COMMITTEE_PREFIXES`, `ADMIN_PREFIXES` |
| `src/lib/constants/competitions.ts` | `COMPETITIONS`, `COMPETITION_SUBMISSION_ROUTES`, timeline |
| `src/lib/constants/submission-requirements.ts` | `SUBMISSION_REQUIREMENTS`, `COMPETITION_DOCUMENT_COLUMNS` |
| `src/lib/constants/stage-ids.ts` | `COMPETITION_STAGE_IDS` (BCC, PaPos, GnG, Essay) |
| `src/lib/constants/document-types.ts` | `DOCUMENT_TYPES` (KTM, proofs, tipe submission) |
| `src/lib/constants/team-status.ts` | `TEAM_STATUS`, `deriveTeamStatusFromVerification` |
| `src/lib/constants/guidebooks.ts` | `GUIDEBOOK_URLS`, `COORDINATION_GROUP_LINKS` |
| `src/lib/constants/event-links.ts` | `EVENT_REGISTRATION_LINKS` |
| `src/lib/constants/contact.ts` | `CONTACT_GROUPS`, `PATH_TO_CONTACT` untuk ContactFAB |
| `src/config/navbar-config.tsx` | Nav links dan aksi per role |

---

## 10. Environment Variables

### Wajib

| Variable | Deskripsi |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_BACKEND_URL` / `BACKEND_URL` | URL backend API (default: `http://localhost:3030`) |
| `MAYAR_API_KEY` | API key Mayar (untuk pembayaran online) |

### Opsional

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role Supabase (server) | - |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi (redirect, dll.) | - |
| `NEXT_PUBLIC_PUBLIC_ASSET_URL` | Base URL asset publik (R2) | `https://storage.wildcat2026.com` |
| `MAYAR_BASE_URL` | Base URL API Mayar | `https://api.mayar.club` |
| `MAYAR_WEBHOOK_CONFIRM_PATH` | Path backend untuk webhook confirm | `/api/landing/payment/confirm` |
| `MAYAR_CALLBACK_BACKEND_PATH` | Path backend untuk payment callback | `/api/payment/callback` |
| `UPLOAD_SIGN_PATH` | Path backend sign | `/sign` |
| `UPLOAD_CONFIRM_PATH` | Path backend confirm | `/confirm` |
| `COMPETITION_FEE_AMOUNT` | Fee fallback create-invoice | 150000 |

### Cloudflare (dev.vars / wrangler)

- `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `PUBLIC_ASSET_URL`

---

## 11. Deployment

### Development

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Pastikan backend berjalan di `NEXT_PUBLIC_BACKEND_URL` (default `http://localhost:3030`).

### Build untuk Cloudflare

```bash
npm run cf-build
```

Output di `.open-next/`. `wrangler.toml` mengarah ke `.open-next/worker.js`.

### Deploy ke Cloudflare Workers

```bash
npx wrangler deploy
```

### Catatan Arsitektur

- **Backend proxy**: Sebagian besar API route mem-proxy ke backend Hono.
- **Storage**: Presigned URLs dari backend; PUT via `/api/upload/put` untuk menghindari CORS.
- **Logout**: Navbar "Logout" mengarah ke `/landing`; sign-out Supabase di-handle di client.

---

## Lampiran: Alur Peserta (Ringkas)

1. **Landing** → Klik "Register Now" → `/register`
2. **Login Google** → Callback → cek registrasi
3. **Step 2**: Isi data tim (nama, leader, universitas, kompetisi)
4. **Step 3**: Isi data anggota
5. **Home** → Lengkapi administrasi (dokumen + pembayaran)
6. **Teams** → Edit anggota (sebelum dokumen terverifikasi)
7. **Administration** → Upload KTM, Twibbon, Poster; bayar (Mayar/manual)
8. **Events** → Lihat event, RSVP
9. **Submission** → Submit per kompetisi (preliminary/final)

---

*Dokumentasi ini dibuat untuk Wildcat FE v0.1.0. Terakhir diperbarui: Maret 2026.*
