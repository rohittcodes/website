import "server-only";

const GITHUB_USERNAME = "rohittcodes";

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
}

const FEATURED_REPOS: {
  owner?: string;
  name: string;
  description: string;
  language: string;
}[] = [
  {
    owner: "linea-org",
    name: "linea",
    description:
      "Visual AI workflow engine — compose, run, and debug agent pipelines on a canvas.",
    language: "TypeScript",
  },
  {
    name: "codepilot",
    description:
      "Rust multi-agent CLI that routes Linear, GitHub, and Supabase work through MCP.",
    language: "Rust",
  },
  {
    name: "rocketbase",
    description:
      "High-performance time series database in Rust, organized around DataCrates.",
    language: "Rust",
  },
  {
    name: "tracer",
    description:
      "Reasoning-focused observability — collect logs and traces without a full APM stack.",
    language: "TypeScript",
  },
  {
    name: "neon-osskit",
    description:
      "CLI that scaffolds a Next.js SaaS starter with Neon, Clerk, and Prisma or Drizzle.",
    language: "TypeScript",
  },
  {
    name: "solana-tx-landing",
    description:
      "Claude Code skill for landing Solana transactions: fees, ALTs, Jito, and blockhash expiry.",
    language: "Shell",
  },
];

function repoOwner(featured: (typeof FEATURED_REPOS)[number]) {
  return featured.owner ?? GITHUB_USERNAME;
}

function fallbackRepo(featured: (typeof FEATURED_REPOS)[number]): Repo {
  const owner = repoOwner(featured);
  return {
    name: featured.name,
    description: featured.description,
    url: `https://github.com/${owner}/${featured.name}`,
    stargazerCount: 0,
    forkCount: 0,
    primaryLanguage: { name: featured.language, color: null },
    repositoryTopics: { nodes: [] },
  };
}

export async function getPinnedRepos(): Promise<Repo[]> {
  const headers: HeadersInit = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  return Promise.all(
    FEATURED_REPOS.map(async (featured) => {
      const fallback = fallbackRepo(featured);

      try {
        const res = await fetch(
          `https://api.github.com/repos/${repoOwner(featured)}/${featured.name}`,
          { headers, next: { revalidate: 3600 } },
        );

        if (!res.ok) return fallback;

        const repo = await res.json();
        return {
          name: featured.name,
          description: featured.description,
          url: repo.html_url ?? fallback.url,
          stargazerCount: repo.stargazers_count ?? 0,
          forkCount: repo.forks_count ?? 0,
          primaryLanguage: {
            name: repo.language ?? featured.language,
            color: null,
          },
          repositoryTopics: { nodes: [] },
        };
      } catch {
        return fallback;
      }
    }),
  );
}
