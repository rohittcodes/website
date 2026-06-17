import { Column, Heading, Line, Row, Schema, Text } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import FeaturedPost from "@/components/blog/FeaturedPost";
import { baseURL, blog, newsletter, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { generateSeoMetadata } from "@/utils/seo";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  const allPosts = getPosts(["src", "app", "blog", "posts"]).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  const featuredPost = allPosts[0];

  return (
    <Column maxWidth="m" paddingTop="16">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column paddingX="l" marginBottom="l" gap="8">
        <Heading variant="display-strong-s">{blog.title}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {blog.description}
        </Text>
      </Column>
      <Column fillWidth flex={1} gap="16" paddingX="l">
        {featuredPost && <FeaturedPost post={featuredPost} />}
        <Row fillWidth paddingY="8">
          <Line />
        </Row>
        <Posts range={[2]} columns="3" thumbnail direction="column" />
        {newsletter.display && <Mailchimp />}
      </Column>
    </Column>
  );
}
