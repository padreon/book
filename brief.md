# PROJECT BRIEF: Banua Publisher Website

## Overview
Build a professional Indonesian book publisher website called "Banua Publisher" 
for ISBN registration purposes. The website serves as an official digital 
presence for the publisher, featuring a public-facing site and an admin CMS.

---

## Tech Stack
- Framework: Next.js 14 (App Router)
- Database & Auth: Supabase
- Storage: Supabase Storage (images)
- Hosting: Vercel
- Language: Indonesian
- Styling: Tailwind CSS
- Rich Text Editor: TipTap
- Analytics: Google Analytics (GA4)
- 2FA: Supabase TOTP (for master admin)

---

## Design
- Style: Formal, modern, editorial
- Font: Serif for headings (Playfair Display), 
  sans-serif for body (Inter)
- Colors: 
  Primary: Deep navy #1a2744
  Background: Warm white #fafaf8
  Accent: Gold #c9a84c
- Language: Bahasa Indonesia

---

## Roles & Auth
1. master_admin
   - Full access
   - Can add/remove admin accounts
   - 2FA (TOTP) mandatory
   - Can edit all site settings

2. admin
   - CRUD books
   - CRUD custom pages
   - View contact messages
   - Cannot manage accounts or site settings

---

## Database Schema

### Table: books
- id (uuid)
- title (text)
- slug (text, unique)
- author (text)
- editor (text, nullable)
- synopsis (text)
- cover_url (text) — hero image
- images (text[]) — additional images
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

### Table: pages
- id (uuid)
- title (text)
- slug (text, unique)
- content (text, HTML from TipTap)
- is_published (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### Table: contact_messages
- id (uuid)
- name (text)
- email (text)
- message (text)
- ip_address (text) — for rate limiting
- created_at (timestamp)

### Table: site_settings
- id (uuid)
- key (text, unique)
- value (text)
- Examples of keys:
  publisher_name, tagline, address, email, 
  phone, logo_url, favicon_url,
  instagram_url, twitter_url, facebook_url,
  youtube_url, tiktok_url, whatsapp_number,
  google_analytics_id,
  footer_text, meta_description

---

## Pages Structure

### Public
- / → Landing page
  - Hero section (dynamic: tagline from site_settings)
  - Latest books section (3-4 terbaru)
  - Footer (dynamic: from site_settings)

- /books → Book catalog
  - Grid layout, 3 columns desktop
  - Pagination (9 books per page)
  - Each card: cover, title, author, synopsis excerpt

- /books/[slug] → Book detail
  - Hero: cover image + info (title, author, editor, date)
  - Full synopsis
  - Additional images gallery
  - SEO: dynamic meta title & description per book

- /[slug] → Custom pages (About, Contact, etc.)
  - Rendered from TipTap HTML content
  - Contact page includes contact form

- /contact → Contact page
  - Form: name, email, message
  - Rate limiting: max 3 submissions per IP per hour
  - Saved to contact_messages table

- /404 → Custom 404 page
  - On-brand design
  - Link back to homepage

### Admin (protected)
- /admin/login
  - Email + password
  - 2FA input for master_admin

- /admin/dashboard
  - Stats: total books, total pages, 
    unread messages

- /admin/books
  - List all books (table)
  - Pagination
  - Edit / Delete actions

- /admin/books/new
  - Form: title, author, editor (optional),
    synopsis, cover image upload,
    additional images upload

- /admin/books/[id]/edit
  - Same form, pre-filled

- /admin/pages
  - List all custom pages
  - Toggle publish/unpublish

- /admin/pages/new
  - Title, slug (auto-generated, editable)
  - TipTap rich text editor
  - Publish toggle

- /admin/pages/[id]/edit
  - Same form, pre-filled

- /admin/messages
  - List contact messages
  - Mark as read

- /admin/accounts (master_admin only)
  - List all admin accounts
  - Add new admin (email + password)
  - Delete admin

- /admin/settings (master_admin only)
  - Form to edit all site_settings keys:
    Logo upload, favicon upload,
    Publisher name, tagline, address,
    Email, phone, WhatsApp,
    Social media URLs,
    Google Analytics ID,
    Footer text, meta description

---

## SEO
- Dynamic meta title & description per book 
  (from synopsis)
- robots.txt
- sitemap.xml (auto-generated, includes 
  all books and published pages)
- Open Graph tags for book pages

---

## Anti-Spam (Contact Form)
- Rate limit: max 3 messages per IP per hour
- Implemented via Supabase + Next.js 
  middleware or server action

---

## Analytics
- Google Analytics GA4
- GA ID managed via site_settings 
  (editable from dashboard, no code changes needed)

---

## Image Handling
- All images uploaded to Supabase Storage
- Cover image: portrait ratio, 
  displayed as hero on detail page
- Additional images: gallery on detail page
- Logo & favicon: uploaded from settings dashboard

---

## Additional Notes
- All social media URLs and logo are dynamic 
  (stored in site_settings, editable from dashboard)
- Slug for books auto-generated from title 
  (editable before publish)
- Slug for custom pages auto-generated from title 
  (editable before publish)
- Footer links auto-populated from site_settings
- No hard-coded content — 
  everything manageable from dashboard

## github
 - don't forget to commit and push to github
 - commit every task you finish