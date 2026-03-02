# Mareşal Web – Vercel Deployment Guide

First version deployment checklist for [Vercel](https://vercel.com).

---

## 1. Prerequisites

- [ ] Supabase project created
- [ ] SQL schema run in Supabase (see below)
- [ ] GitHub / GitLab / Bitbucket account (for Vercel)

---

## 2. Supabase Setup (Before Deploy)

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **API keys** (Settings → API)

### 2.2 Run SQL Scripts

In Supabase **SQL Editor**, run in this order:

1. **`supabase-schema.sql`** – Main schema (services, gallery, about, messages, site_settings)
2. **`supabase-about-content.sql`** – Hakkımızda content (optional if schema already seeds it)
3. **`supabase-main-service-m5.sql`** – M5 main service

### 2.3 Storage Bucket

The schema creates `site-content` bucket. If it fails, create manually:

- Storage → New bucket → Name: `site-content` → Public: Yes

---

## 3. Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your Git repository
3. **Root Directory**: 
   - If repo root is `maresal-next` → leave blank
   - If repo root contains `maresal-next` as subfolder → set to `maresal-next`
4. **Framework Preset**: Next.js (auto-detected)
5. **Build Command**: `npm run build` (default)
6. **Output Directory**: leave default

### 3.2 Environment Variables

In Vercel: **Project → Settings → Environment Variables**

Add these for **Production** (and Preview if you want):

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification | No |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Google Maps / Business URL | No |

### 3.3 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Your site will be at `https://your-project.vercel.app`

---

## 4. Custom Domain (Optional)

1. Vercel → Project → **Settings** → **Domains**
2. Add `maresal.com.tr` (or your domain)
3. Follow DNS instructions (A/CNAME records)

---

## 5. Post-Deploy Checklist

- [ ] Homepage loads
- [ ] Hakkımızda page works
- [ ] Hizmetler page shows services (incl. M5)
- [ ] Galeri loads images
- [ ] İletişim form submits
- [ ] Admin (`/admin`) accessible
- [ ] Update contact info in `src/lib/business.ts` or via Supabase `site_settings`

---

## 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check env vars are set in Vercel |
| Blank pages | Verify Supabase URL and keys |
| Images not loading | Ensure `images.unsplash.com` and `*.supabase.co` in `next.config.ts` |
| Admin not working | Admin uses server actions; ensure `SUPABASE_SERVICE_ROLE_KEY` is set |

---

## 7. File Reference

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Main DB schema + seed |
| `supabase-about-content.sql` | About page content |
| `supabase-main-service-m5.sql` | M5 main service |
| `.env.local.example` | Env var template |
