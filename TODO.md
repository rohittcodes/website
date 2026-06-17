# TODO — Things to update manually

## High priority

### Images (replace placeholders)
- `public/images/avatar.jpg` — replace with your actual photo
- `public/images/og/home.jpg` — replace with a custom OG image for social sharing (1200×630px recommended)
- `public/images/projects/` — replace with real screenshots of your projects (or remove images from project MDX frontmatter)

### Blog posts (`src/app/blog/posts/`)
All 11 existing MDX files are Once UI template documentation. Do one of:
- **Delete them all** and write your own posts
- **Replace frontmatter** at minimum: update `title`, `summary`, `publishedAt`, `tag`, and remove `image` if you don't have one

Each post needs this frontmatter:
```mdx
---
title: "Your post title"
publishedAt: "2025-06-01"
summary: "One sentence description shown on cards and in RSS."
tag: "AI"  # used for related posts — pick a consistent tag per category
---
```

### Work projects (`src/app/work/projects/`)
All 3 MDX files are Once UI template projects. Replace with your actual work:
- Delete existing `.mdx` files
- Create new ones for createxp work, side projects, open source contributions

Each project needs:
```mdx
---
title: "Project name"
publishedAt: "2025-06-01"
summary: "What it does in one sentence."
images:
  - "/images/projects/your-project/cover.jpg"
link: "https://yourproject.com"
---

## Overview
...
```

---

## Medium priority

### Resend newsletter setup
Add these to `.env.local`:
```
RESEND_API_KEY=re_...         # from resend.com/api-keys
RESEND_AUDIENCE_ID=...        # from resend.com/audiences (create one first)
```

### `/uses` page (`src/app/uses/page.tsx`)
- Update the **Hardware** section with your actual machine/peripherals
- Update any tools/apps that don't match what you actually use
- Add or remove sections as needed

### About page (`src/resources/content.tsx`)
- `about.work.experiences` — update achievement bullets with real details about your work at createxp and Grit Labs
- `about.calendar.link` — currently `cal.com/rohittcodes`, confirm this is your actual cal.com slug

### Home page subline (`src/resources/content.tsx`)
- Update `home.subline` if you want a different intro tagline

---

## Lower priority

### Featured badge
Currently shows "Currently building · createxp" linking to `https://createxp.com`.
Update `home.featured.href` if the link changes or you want to point to a specific project.

### Domain
Update `baseURL` in `src/resources/once-ui.config.ts` from `https://rohittcodes.dev` to your actual domain once you have it set up.

### Social links
Confirm all links in `src/resources/content.tsx` → `social` array are correct:
- GitHub: `https://github.com/rohittcodes`
- LinkedIn: `https://www.linkedin.com/in/rohittcodes`
- X: `https://x.com/rohittcodes`

### Gallery
Gallery route is disabled (`/gallery: false` in config). Enable it and add photos if you want it.

---

## Already done (for reference)
- Personal info (name, role, location, email, languages)
- Social links wired to rohittcodes
- Resend API route created (`/api/subscribe`)
- Vercel Analytics added
- `/uses` page created with placeholder content
- Blog: related posts by tag, reading time, compact layout
- Work: carousel on project detail pages
- Navbar: fixed to top, Uses link added
- Newsletter: switched from Mailchimp to Resend
- Footer: removed Once UI attribution
