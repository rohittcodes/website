import { getPosts } from "@/utils/utils";
import { FeaturedWorkCarousel } from "./FeaturedWorkCarousel";

export function FeaturedWork({ limit }: { limit?: number }) {
  const projects = getPosts(["src", "app", "work", "projects"])
    .filter((post) => post.metadata.images?.length > 0)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, limit ?? Number.POSITIVE_INFINITY)
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary,
      image: post.metadata.images[0],
    }));

  return <FeaturedWorkCarousel projects={projects} />;
}
