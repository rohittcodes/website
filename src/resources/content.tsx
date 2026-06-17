import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";
import { Fragment } from "react/jsx-runtime";

function HeadlineChip({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        margin: "0 0.1em",
        height: "0.8em",
        width: "1.3em",
        overflow: "hidden",
        borderRadius: "0.25em",
        border: "2px solid var(--page-background)",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
    </span>
  );
}

const person: Person = {
  firstName: "Rohith",
  lastName: "Singh",
  name: "Rohith Singh",
  role: "Full Stack + AI Engineer",
  avatar: "/images/avatar.jpg",
  email: "rohittcodes@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "German (Deutsch)", "Hindi", "Telugu"], // optional: Leave the array empty if you don't want to display languages
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
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: `/api/og/generate?title=${encodeURIComponent("Rohith Singh: Full Stack + AI Engineer")}`,
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: "I build full-stack and AI-native products that actually ship, not just demo well. Here's the proof.",
  headline: (
    <>
      Building <HeadlineChip src="/images/projects/linea/cover-01.avif" alt="Linea" />{" "}
      AI-native software <HeadlineChip src="/images/projects/novabench/cover-01.avif" alt="NovaBench" />{" "}
      that ships and scales
    </>
  ),
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Linea Labs</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Currently building
        </Text>
      </Row>
    ),
    href: "https://createxp.com",
  },
  subline: (
    <>
      I build full-stack and AI-native products, obsess over backend architecture, and ship side projects to learn in public.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `I'm ${person.name}, a ${person.role} based in ${person.location}. I build things, ship them, and figure out the rest along the way.`,
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
        Software engineer based in Hyderabad, India. Interested in backend architecture, AI
        infrastructure, startups, and product development. I spend most of my time building things
        sometimes they ship, sometimes they teach me something better. Either way, I share what I
        learn along the way.
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
        role: "Software Engineer",
        achievements: [
          <Fragment key="createxp">
            Returned to createxp to continue building and scaling product features after a stint at
            Grit Labs.
          </Fragment>,
        ],
        images: [],
      },
      {
        company: "Grit Labs",
        timeframe: "Jul 2025 - Sep 2025",
        role: "Software Engineer",
        achievements: [
          <Fragment key="grit">
            Worked on full-stack engineering challenges, contributing to product development and
            internal tooling at Grit Labs.
          </Fragment>,
        ],
        images: [],
      },
      {
        company: "createxp",
        timeframe: "May 2025 - Jul 2025",
        role: "Software Engineer",
        achievements: [
          <Fragment key="createxp-initial">
            Joined createxp as a software engineer, contributing to product development across the
            full stack.
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
        name: "KMIT, Hyderabad",
        description: <>Bachelor of Technology in Computer Science (2023 – 2026)</>,
      },
      {
        name: "IOES, Hyderabad",
        description: <>Diploma in Computer Science (2020 – 2023)</>,
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
          <>Integrating LLMs into products: RAG pipelines, agentic workflows, tool use, and building AI-native features that actually ship.</>
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
          <>Designing scalable backend systems, working with databases, queues, and cloud infra. Interested in distributed systems and performance at scale.</>
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
  title: "Blog – AI, engineering & building in public",
  description: "What I'm building, breaking, and figuring out in public. No filter.",
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: "AI systems, full-stack products, and Web3 infra I've actually shipped, not just prototyped.",
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: "A photo collection of mine.",
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

export { person, social, newsletter, home, about, blog, work, gallery, uses };
