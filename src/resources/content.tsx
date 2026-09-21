import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Row, Text } from "@once-ui-system/core";
import { Fragment } from "react/jsx-runtime";

const person: Person = {
  firstName: "Rohith",
  lastName: "Singh",
  name: "Rohith Singh",
  role: "AI / Full-Stack Engineer",
  avatar: "/images/avatar.jpg",
  email: "rohittcodes@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Japanese (日本語)", "Hindi", "Telugu"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to my newsletter</>,
  description: <>Thoughts on AI, backend systems, and building things that matter</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/rohittcodes",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/rohittcodes",
    essential: true,
  },
  {
    name: "X",
    icon: "x",
    link: "https://x.com/rohittcodes",
    essential: true,
  },
  {
    name: "Contra",
    icon: "contra",
    link: "https://contra.com/rohittcodes",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const contra = {
  username: "rohittcodes",
  url: "https://contra.com/rohittcodes",
  analyticsUserId: "00ddd8f3-86cd-4ad2-9cf8-86a9249a0358",
  rating: "5.0",
} as const;

const home: Home = {
  path: "/",
  image: `/api/og/generate?title=${encodeURIComponent("Rohith Singh: AI / Full-Stack Engineer")}`,
  label: "Home",
  title: "Rohith Singh | AI / Full-Stack Engineer | Open to full-time",
  description:
    "AI-native full-stack engineer in Hyderabad. Production RAG, agents, and workflow systems. Building Linea Labs. Open to full-time roles. Proof at rohitt.codes/work.",
  headline: <>AI / full-stack engineer who ships</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <Text marginLeft="4" marginRight="4" onBackground="brand-medium">
          Open to full-time roles
        </Text>
      </Row>
    ),
    href: "/resume",
  },
  subline: <>RAG, agents, and systems in production. Hyderabad. Building Linea Labs. RAG at createxp.</>,
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About ${person.name} | AI / Full-Stack Engineer`,
  description: `Rohith Singh is an AI-native full-stack engineer in Hyderabad, India. Production RAG, agents, and workflow systems. Open to full-time roles.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/rohittcodes",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        AI-native full-stack engineer in Hyderabad. Backend architecture, AI infrastructure, and
        products people use. Full Stack Developer at createxp (NovaBench RAG) and founder of Linea
        Labs.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "createxp",
        timeframe: "Sep 2025 - Present",
        role: "Full Stack Developer",
        achievements: [
          <Fragment key="createxp-rag">
            Built and deployed a production RAG pipeline combining LLM-based intent extraction,
            vector retrieval, and contextual ranking, delivering streaming AI responses in under
            200ms
          </Fragment>,
          <Fragment key="createxp-ranking">
            Designed a multi-signal ranking service (vector similarity, specification matching,
            contextual scoring) and shipped it as a Dockerized backend with authentication,
            webhooks, and structured logging
          </Fragment>,
          <Fragment key="createxp-migration">
            Redesigned the underlying PostgreSQL specification data model and built automated
            migration tooling, safely migrating 10,000+ records with no manual cleanup
          </Fragment>,
        ],
        images: [
          {
            src: "/images/projects/novabench/cover-01.avif",
            alt: "NovaBench RAG recommendation engine",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Grit Labs",
        timeframe: "Jul 2025 - Sep 2025",
        role: "Software Development Engineer Intern",
        achievements: [
          <Fragment key="grit-fam">
            Built fam.cool, an internal testbed for prototyping AI personas, using prompt-based
            conditioning and behavioral tuning to differentiate agent personalities, with real-time
            messaging via Express.js, PostgreSQL, RabbitMQ, and WebSockets
          </Fragment>,
          <Fragment key="grit-jumble">
            Built full-stack systems for jumble[cash], an AI-assisted on-chain arcade used by 1K+
            users, implementing complex client state, multi-round game flows, and integration with
            an AI decision engine
          </Fragment>,
          <Fragment key="grit-infra">
            Owned deployment infrastructure across both products (Docker, Kubernetes, DigitalOcean),
            enabling the two-person team to ship independently to production
          </Fragment>,
        ],
        images: [
          {
            src: "/images/projects/jumblecash/cover-01.webp",
            alt: "jumble[cash] on-chain arcade",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "createxp",
        timeframe: "May 2025 - Jul 2025",
        role: "Full Stack Developer",
        achievements: [
          <Fragment key="createxp-trpc">
            Migrated an application from a tightly-coupled tRPC architecture to a dedicated
            Express.js backend and Next.js frontend, decoupling client and server concerns and
            simplifying state management with React Query
          </Fragment>,
          <Fragment key="createxp-s3">
            Built a hierarchical file-management system on Amazon S3, replacing ad hoc file handling
            with structured nested directories, uploads, and public/private access controls
          </Fragment>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Keshav Memorial Institute of Technology",
        description: "B.Tech, Computer Science. CGPA 8.4/10.0. Sep 2023 - Aug 2026",
      },
      {
        name: "Government Institute of Electronics",
        description: "Diploma CS, 9.67/10.0, Rank 2, Gold Medalist. Oct 2020 - May 2023",
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Full Stack Development",
        description: (
          <>Building end-to-end web apps with Next.js, React, TypeScript, and Node.js, from API design to polished UIs.</>
        ),
        tags: [
          { name: "TypeScript", icon: "typescript" },
          { name: "Next.js", icon: "nextjs" },
          { name: "Node.js", icon: "nodejs" },
        ],
        images: [],
      },
      {
        title: "AI & LLM Engineering",
        description: (
          <>Integrating LLMs into products: RAG pipelines, agentic workflows, and tool use that holds up in production.</>
        ),
        tags: [
          { name: "OpenAI", icon: "openai" },
          { name: "Python", icon: "python" },
        ],
        images: [],
      },
      {
        title: "Backend & Infrastructure",
        description: (
          <>Designing scalable backend systems for SaaS products: databases, queues, and cloud infra. Interested in distributed systems and performance at scale.</>
        ),
        tags: [
          { name: "PostgreSQL", icon: "postgresql" },
          { name: "Docker", icon: "docker" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "AI Engineering & SaaS Blog | Rohith Singh",
  description: "RAG pipelines, AI agents, and AI-powered SaaS products, documented as I build them. No filter.",
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Work | ${person.name}`,
  description: "Production RAG, agents, and AI workflow systems. Linea Labs, NovaBench, 3DLabs, Live Race, jumble[cash].",
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: "A personal photo collection outside of code — updated occasionally.",
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

const uses = {
  path: "/uses",
  label: "Setup",
  title: `Setup – ${person.name}`,
  description: "The tools, hardware, and software I use day to day.",
};

const resume = {
  title: "AI / Full-Stack Engineer: AI Infrastructure & Agentic Systems",
  location: "Hyderabad, India",
  summary:
    "AI / full-stack engineer who builds production AI systems, from RAG pipelines to workflow-orchestration engines, designed to hold up under real traffic and multi-tenant load. Works across backend architecture, agent infrastructure, and full-stack delivery with TypeScript, Python, NestJS, FastAPI, PostgreSQL/pgvector, and Docker.",
  projects: [
    {
      name: "Linea: Open-Source AI Workflow Orchestration Platform",
      stack: "TypeScript, NestJS, LangGraph.js, BullMQ, PostgreSQL/pgvector",
      href: "https://getlinea.app",
      hrefLabel: "getlinea.app",
      bullets: [
        "Architected and open-sourced a production-grade AI workflow orchestration platform built around LangGraph, BullMQ, NestJS, and PostgreSQL/pgvector, with a published TypeScript SDK",
        "Supports composing agents, RAG, tool calls, and human approvals into durable, multi-tenant workflows, including subworkflows and checkpointed execution with retries and token accounting",
        "Designed a provider-agnostic AI abstraction spanning Anthropic, OpenAI, Google, Groq, xAI, and Ollama, with workspace-level bring-your-own-key resolution",
      ],
    },
    {
      name: "3DLabs: Autonomous AI Video Pipeline",
      stack: "Next.js, TypeScript, Gemini, Replicate, ElevenLabs, FFmpeg",
      href: "https://3dlabs.it.com",
      hrefLabel: "3dlabs.it.com",
      bullets: [
        "Architected and built an autonomous AI video-generation pipeline used by 5 teams / 40-50 users, orchestrating 12+ AI models across story generation, scene planning, image/video generation, TTS, sound design, and FFmpeg assembly to generate videos up to 15 minutes long",
        "Designed a credit-reservation workflow and multi-tenant workspace isolation for projects, collaborators, and credit accounting",
      ],
    },
  ],
  skills: [
    { title: "Languages", items: "TypeScript, JavaScript, Python, Rust, SQL" },
    {
      title: "Backend",
      items: "Node.js, NestJS, Express.js, FastAPI, REST APIs, WebSockets, tRPC, Drizzle, Prisma",
    },
    {
      title: "AI / Agents",
      items:
        "LangGraph, LangChain, RAG, agent orchestration, tool calling, MCP, embeddings, vector search, prompt engineering",
    },
    {
      title: "Data & Messaging",
      items:
        "PostgreSQL, pgvector, Redis, MongoDB, hybrid retrieval, BullMQ, RabbitMQ, event-driven workflows",
    },
    { title: "Frontend", items: "React, Next.js, TanStack Query, Tailwind CSS" },
    {
      title: "Infrastructure",
      items: "Docker, Kubernetes, AWS, Amazon S3, DigitalOcean, GitHub Actions, NGINX",
    },
  ],
  openSource: [
    "TS-Circuit: Contributor to React/TypeScript frontend tooling, PCB visualization, and geometry/rendering; shipped improvements to component polarity markings, hull rendering, cursor positioning, and editor validation",
    "DocsGPT / CopilotKit: Contributed AI features to DocsGPT and built example agent applications using CopilotKit",
    "50+ merged pull requests across open-source projects, plus $1K+ earned through OSS bounty programs",
    "6x Hackathon Winner across AI, DeFi, and developer-tooling categories, with $5K+ in combined winnings",
  ],
  writing: [
    "Production AI Agents with LangChain (6K+ views)",
    "MCP Protocol Deep Dive (4K+ views)",
    "Scaling Next.js Applications (3.2K+ views)",
  ],
};

export { person, social, contra, newsletter, home, about, blog, work, gallery, uses, resume };
