import { about, person, social } from "@/resources";
import { getPosts } from "@/utils/utils";

const ALLOWED_PATHS = [
  "/",
  "/about",
  "/work",
  "/blog",
  "/uses",
  "/now",
] as const;

export type AllowedPath = (typeof ALLOWED_PATHS)[number];

export function isAllowedPath(path: string): path is AllowedPath {
  return (ALLOWED_PATHS as readonly string[]).includes(path);
}

export function getAboutKnowledge() {
  return {
    name: person.name,
    role: person.role,
    location: "Hyderabad, India",
    timezone: person.location,
    languages: person.languages,
    email: person.email,
    calendar: about.calendar.display ? about.calendar.link : null,
    intro:
      "Software engineer based in Hyderabad, India. Interested in backend architecture, AI infrastructure, startups, and product development. Builds things, ships them, and shares what he learns.",
    experience: about.work.experiences.map((exp) => ({
      company: exp.company,
      role: exp.role,
      timeframe: exp.timeframe,
    })),
    education: about.studies.institutions.map((inst) => ({
      name: inst.name,
      detail:
        inst.name.includes("KMIT")
          ? "Bachelor of Technology in Computer Science (2023-2026)"
          : "Diploma in Computer Science (2020-2023)",
    })),
    skills: about.technical.skills.map((skill) => ({
      title: skill.title,
      tags: skill.tags?.map((tag) => tag.name) ?? [],
    })),
    social: social
      .filter((item) => item.link)
      .map((item) => ({ name: item.name, link: item.link })),
  };
}

export function getProjectsKnowledge(query?: string) {
  const projects = getPosts(["src", "app", "work", "projects"]).map((project) => ({
    title: project.metadata.title,
    subtitle: project.metadata.subtitle ?? null,
    summary: project.metadata.summary,
    tag: project.metadata.tag ?? null,
    slug: project.slug,
    path: `/work/${project.slug}`,
    link: project.metadata.link || null,
  }));

  if (!query?.trim()) return projects;

  const q = query.toLowerCase();
  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(q) ||
      project.summary.toLowerCase().includes(q) ||
      (typeof project.tag === "string" && project.tag.toLowerCase().includes(q)) ||
      (Array.isArray(project.tag) &&
        project.tag.some((tag) => String(tag).toLowerCase().includes(q))),
  );
}

export function getProjectTitles() {
  return getProjectsKnowledge().map((project) => project.title);
}

export function getBlogTitles() {
  return getBlogKnowledge().map((post) => post.title);
}

export function getBlogKnowledge(limit?: number) {
  const posts = getPosts(["src", "app", "blog", "posts"]).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  return (limit ? posts.slice(0, limit) : posts).map((post) => ({
      title: post.metadata.title,
      summary: post.metadata.summary,
      publishedAt: post.metadata.publishedAt,
      slug: post.slug,
      path: `/blog/${post.slug}`,
    }));
}

export function getUsesKnowledge() {
  return {
    path: "/uses",
    sections: [
      {
        title: "Editor & Terminal",
        items: [
          { name: "VS Code", description: "Primary editor. Clean, fast, and has everything I need." },
          { name: "Cursor", description: "AI-first editor I switch to for heavy feature work." },
          { name: "Warp", description: "Terminal with AI autocomplete and command search built in." },
        ],
      },
      {
        title: "Stack",
        items: [
          { name: "Next.js", description: "Default for anything web: App Router, RSC, the whole deal." },
          { name: "TypeScript", description: "Always. No exceptions." },
          { name: "Tailwind CSS", description: "For most styling outside this portfolio." },
          { name: "Prisma + PostgreSQL", description: "Primary DB setup for most projects. Simple schema workflow." },
          { name: "tRPC", description: "End-to-end typesafe APIs without the boilerplate." },
          { name: "Vercel", description: "Where most things ship. Zero-config deploys." },
          { name: "Docker", description: "Containerizing services for consistent local and prod environments." },
          { name: "Node.js", description: "Runtime for backend services and tooling scripts." },
        ],
      },
      {
        title: "AI & LLM Tools",
        items: [
          { name: "Claude", description: "Primary LLM for both building and day-to-day coding assistance." },
          { name: "OpenAI API", description: "Used for embeddings and specific model capabilities." },
          { name: "LangChain / LlamaIndex", description: "For RAG pipelines and agentic workflows." },
        ],
      },
      {
        title: "Hardware",
        items: [
          { name: 'MacBook Pro 14" (M3 Pro)', description: "Daily driver for everything: dev, design review, and meetings." },
          { name: 'LG 27" 4K Monitor', description: "Extra screen real estate for splitting code and docs." },
          { name: "Keychron K8 Pro", description: "Mechanical keyboard, swapped to brown switches." },
          { name: "Logitech MX Master 3S", description: "Comfortable for long sessions, great for multi-monitor flow." },
          { name: "Sony WH-1000XM5", description: "Noise cancelling for focus blocks and calls." },
        ],
      },
      {
        title: "Apps",
        items: [
          { name: "Notion", description: "Notes, planning, and project tracking." },
          { name: "Raycast", description: "Launcher that replaced everything else." },
          { name: "Arc", description: "Browser. Spaces keep work and personal separate." },
        ],
      },
    ],
  };
}

export function getNowKnowledge() {
  return {
    lastUpdated: "June 2025",
    building: [
      {
        title: "RAG recommendation engine @ createxp",
        description:
          "Iterating on retrieval quality and latency, adding re-ranking and experimenting with hybrid sparse/dense search.",
      },
      {
        title: "Linea",
        description:
          "Adding a workflow marketplace so teams can share and fork agent pipelines. Building the execution sandbox.",
      },
    ],
    learning: [
      {
        title: "Distributed systems",
        description:
          "Working through Designing Data-Intensive Applications. Focused on consensus algorithms and replication strategies.",
      },
      {
        title: "Rust",
        description:
          "Learning for performance-critical infra work. Following the Book and building small CLI tools.",
      },
    ],
  };
}

export function getContactKnowledge() {
  return {
    email: person.email,
    calendar: about.calendar.display ? about.calendar.link : null,
    social: social
      .filter((item) => item.essential && item.link)
      .map((item) => ({ name: item.name, link: item.link })),
  };
}

const PAGE_BODY_LIMIT = 8000;

function clipPageBody(content: string) {
  const trimmed = content.trim();
  if (trimmed.length <= PAGE_BODY_LIMIT) return trimmed;
  return `${trimmed.slice(0, PAGE_BODY_LIMIT)}\n\n[truncated]`;
}

export function getPageContext(pathname: string) {
  const path = pathname.split("?")[0] || "/";

  if (path === "/") {
    return {
      type: "home",
      path,
      label: "Home",
      note: "Landing page with featured work, recent posts, and intro.",
    };
  }

  if (path === "/about") {
    return { type: "about", path, label: "About" };
  }

  if (path === "/work") {
    return { type: "work-index", path, label: "Work" };
  }

  if (path.startsWith("/work/")) {
    const slug = path.slice("/work/".length).replace(/\/$/, "");
    const project = getPosts(["src", "app", "work", "projects"]).find(
      (item) => item.slug === slug,
    );
    if (project) {
      return {
        type: "project",
        path: `/work/${project.slug}`,
        label: project.metadata.title,
        summary: project.metadata.summary,
        tag: project.metadata.tag ?? null,
        link: project.metadata.link || null,
        body: clipPageBody(project.content),
      };
    }
    return { type: "project-unknown", path, label: slug };
  }

  if (path === "/blog") {
    return { type: "blog-index", path, label: "Blog" };
  }

  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length).replace(/\/$/, "");
    const post = getPosts(["src", "app", "blog", "posts"]).find(
      (item) => item.slug === slug,
    );
    if (post) {
      return {
        type: "blog-post",
        path: `/blog/${post.slug}`,
        label: post.metadata.title,
        summary: post.metadata.summary,
        publishedAt: post.metadata.publishedAt,
        body: clipPageBody(post.content),
      };
    }
    return { type: "blog-unknown", path, label: slug };
  }

  if (path === "/uses") {
    return { type: "uses", path, label: "Uses" };
  }

  if (path === "/now") {
    return { type: "now", path, label: "Now" };
  }

  return { type: "other", path, label: path };
}

export function buildSystemPrompt(pathname?: string) {
  const aboutData = getAboutKnowledge();
  const page = pathname ? getPageContext(pathname) : null;

  return `You are Rohith Singh's portfolio assistant on rohitt.codes.
Speak in first person as Rohith's AI guide (not as Rohith himself pretending to be human).
Never invent projects, jobs, or facts. Do not use em dashes.

Identity:
- Name: ${aboutData.name}
- Role: ${aboutData.role}
- Location: ${aboutData.location}
- Languages: ${(aboutData.languages ?? []).join(", ")}
- Currently building: Linea Labs / createxp

Available site routes: ${ALLOWED_PATHS.join(", ")}

Visitor's current page:
${page ? JSON.stringify(page, null, 2) : "unknown"}

Page awareness:
- If they ask about "this", "this page", "this project", or "this post", use the current page context above.
- On project or blog detail pages, \`body\` is the MDX content. Use it for summaries and detailed questions. Call tools only when they want related work or something else on the site.

You don't have the rest of the portfolio memorized. Call tools for anything beyond the current page context.

Question routing:
- Stack / tools / setup / "what's X" about a tool in the setup: call getUses only. Answer from that. Do NOT call getProjects, listProjectTitles, or navigateTo unless the visitor explicitly asks for projects or to open a page.
- Projects / work / portfolio pieces: listProjectTitles first, then getProjects for the relevant ones. If a query returns no matches, say so briefly and stop. Do not invent projects or keep retrying.
- Writing / blog: listBlogTitles first, then getBlogPosts.
- What I'm doing now: getNow.
- Bio / experience / education: getAbout.

Answer quality:
- One short reply. Do not repeat the same explanation twice in one turn.
- Do not dump every tool in one breath. For "what's in your stack", give a tight overview (core stack first), then offer to go deeper.
- For "what's tRPC" / similar: explain in Rohith's conversational voice using the getUses description, maybe one practical sentence about why it's in the stack. No textbook definitions. No project search unless they ask.
- Only call navigateTo when the visitor clearly wants to go somewhere, or after they ask to see a page. Never use it as a consolation prize after an empty project search.

Voice and tone (how Rohith actually talks, adapted for chat):
- Conversational and direct, not corporate or textbook. Explain technical things the way you'd explain them out loud to a teammate: "basically X happens, then Y picks it up, and if it fails we retry" rather than "the architecture consists of...".
- It's fine to think out loud briefly and self-correct once: "actually, more like..." or "not exactly that, more like...". Don't overdo it. One correction per answer, if any.
- Light, occasional fillers are okay in casual answers (actually, I mean, yeah, honestly) but keep written replies cleaner than live speech. No stacked filler words, no "uh"/"um".
- Prefer concrete specifics over vague claims. If a question is vague, it's okay to ask for specifics: "can you be more specific?" or "what do you mean exactly?"
- Compare options when relevant instead of just describing one: "instead of X, it made more sense to do Y because...".
- Occasional emphasis through repetition is fine for something Rohith actually cares about ("small small improvements", "very niche"), but sparingly, not in every message.
- End with light, honest uncertainty when it's genuinely uncertain ("...I think", "...or something"), not as a verbal tic on every sentence.
- Keep replies short by default. Expand only when the question needs depth.

Tool use rules:
1. Prefer the smallest tool set that answers the question. Extra tool calls make replies slower and messier.
2. For outreach: draftEmail first, then only call sendContactEmail after the visitor explicitly confirms and provides name + email.
3. If unsure, say so and point to /about, /work, /uses, the resume PDF at /data/rohitt.pdf, or contact channels.
4. After every substantive answer, call suggestFollowUps with 2-3 short follow-up questions a visitor might ask next. Write them from the visitor's point of view, under about 10 words each, specific to the last answer. Skip for pure greetings or while an email draft is waiting for confirmation.`;
}
