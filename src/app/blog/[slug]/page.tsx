import { notFound } from "next/navigation";
import { CustomMDX, Mailchimp, ScrollToHash } from "@/components";
import {
  Schema,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, blog, newsletter, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import { readingTime } from "@/utils/readingTime";
import { generateSeoMetadata } from "@/utils/seo";
import { Metadata } from "next";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "blog", "posts"]);
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return generateSeoMetadata({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    type: "article",
    publishedTime: post.metadata.publishedAt,
    author: { name: person.name, url: `${baseURL}${about.path}` },
    image: post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="m" paddingTop="16">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={
              post.metadata.image ||
              `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
            }
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Column maxWidth="s" gap="8" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Row gap="12" vertical="center" marginBottom="4">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {readingTime(post.content)} min read
              </Text>
            </Row>
            <Heading variant="display-strong-s">{post.metadata.title}</Heading>
            {post.metadata.subtitle && (
              <Text 
                variant="body-default-l" 
                onBackground="neutral-weak" 
                align="center"
                style={{ fontStyle: 'italic' }}
              >
                {post.metadata.subtitle}
              </Text>
            )}
          </Column>
          <Row marginBottom="8" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>
          
          <ShareSection 
            title={post.metadata.title} 
            url={`${baseURL}${blog.path}/${post.slug}`} 
          />

          {(() => {
            const hasTag = !!post.metadata.tag;
            const related = hasTag
              ? getPosts(["src", "app", "blog", "posts"]).filter(
                  (p) => p.slug !== post.slug && p.metadata.tag === post.metadata.tag,
                )
              : [];
            const showRelated = hasTag && related.length > 0;
            return (
              <Column fillWidth gap="16" horizontal="center" marginTop="24">
                <Line maxWidth="40" />
                <Text as="h2" id="related-posts" variant="heading-strong-m" marginBottom="8">
                  {showRelated ? "Related posts" : "Recent posts"}
                </Text>
                <Posts
                  exclude={[post.slug]}
                  {...(showRelated ? { tag: post.metadata.tag, range: undefined } : { range: [1, 2] })}
                  columns="2"
                  thumbnail
                  direction="column"
                />
              </Column>
            );
          })()}
          {newsletter.display && <Mailchimp marginTop="24" />}
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
