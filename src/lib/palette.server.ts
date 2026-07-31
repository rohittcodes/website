import "server-only";

import { routes } from "@/resources";
import { getPosts } from "@/utils/utils";
import type { PaletteItem } from "./palette";

const PAGE_ITEMS: Array<{ path: string; title: string; subtitle: string }> = [
  { path: "/", title: "Home", subtitle: "Landing page" },
  { path: "/about", title: "About", subtitle: "Bio, experience, and skills" },
  { path: "/work", title: "Work", subtitle: "Selected projects" },
  { path: "/blog", title: "Blog", subtitle: "Writing and notes" },
  { path: "/uses", title: "Uses", subtitle: "Stack, tools, and setup" },
  { path: "/now", title: "Now", subtitle: "What I'm focused on" },
  { path: "/gallery", title: "Gallery", subtitle: "Photos" },
];

export function getPaletteItems(): PaletteItem[] {
  const actions: PaletteItem[] = [
    {
      id: "action-chat",
      title: "Ask Rohith",
      subtitle: "Open the AI chat",
      group: "Actions",
      action: "chat",
    },
    {
      id: "action-hire",
      title: "Work together",
      subtitle: "Start a collaboration chat",
      group: "Actions",
      action: "hire",
    },
    {
      id: "action-resume",
      title: "Download resume",
      subtitle: "PDF resume",
      group: "Actions",
      href: "/data/rohitt.pdf",
    },
  ];

  const pages: PaletteItem[] = PAGE_ITEMS.filter(
    (page) => routes[page.path as keyof typeof routes],
  ).map((page) => ({
    id: `page-${page.path}`,
    title: page.title,
    subtitle: page.subtitle,
    group: "Pages",
    href: page.path,
  }));

  const work: PaletteItem[] = getPosts(["src", "app", "work", "projects"]).map(
    (project) => ({
      id: `work-${project.slug}`,
      title: project.metadata.title,
      subtitle: project.metadata.summary,
      group: "Work",
      href: `/work/${project.slug}`,
    }),
  );

  const blog: PaletteItem[] = getPosts(["src", "app", "blog", "posts"])
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .map((post) => ({
      id: `blog-${post.slug}`,
      title: post.metadata.title,
      subtitle: post.metadata.summary,
      group: "Blog",
      href: `/blog/${post.slug}`,
    }));

  return [...actions, ...pages, ...work, ...blog];
}
