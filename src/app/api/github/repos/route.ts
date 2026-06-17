import { NextResponse } from "next/server";

const GITHUB_USERNAME = "rohittcodes";

const PINNED_QUERY = `
  query {
    user(login: "${GITHUB_USERNAME}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 4) {
              nodes {
                topic { name }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    if (process.env.GITHUB_TOKEN) {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: PINNED_QUERY }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const { data } = await res.json();
        const repos = data?.user?.pinnedItems?.nodes ?? [];
        return NextResponse.json(repos);
      }
    }

    // Fallback: public REST API (no token needed) — surface the most substantial
    // repos (most stars, excluding forks) rather than just recently touched ones.
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return NextResponse.json([]);

    const repos = await res.json();
    const ranked = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    return NextResponse.json(
      ranked.map((r: any) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stargazerCount: r.stargazers_count,
        forkCount: r.forks_count,
        primaryLanguage: r.language ? { name: r.language, color: null } : null,
        repositoryTopics: { nodes: [] },
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
