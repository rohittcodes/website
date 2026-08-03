import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

const ROUTE_PRIORITY: Record<string, number> = {
  "/": 1,
  "/blog": 0.9,
  "/work": 0.9,
  "/about": 0.8,
  "/uses": 0.6,
  "/now": 0.6,
  "/gallery": 0.6,
};

export default async function sitemap() {
  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const works = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency:
      route === "/" || route === "/blog" ? ("weekly" as const) : ("monthly" as const),
    priority: ROUTE_PRIORITY[route] ?? 0.5,
  }));

  return [...routes, ...blogs, ...works];
}
