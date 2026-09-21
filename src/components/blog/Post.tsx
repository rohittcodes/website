"use client";

import { Card, Column, Media, Row, Text } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import { readingTime } from "@/utils/readingTime";
import { getOgImage } from "@/utils/og";
import { HotkeyBound } from "../keyboard/HotkeyBound";

interface PostProps {
  post: any;
  thumbnail: boolean;
  direction?: "row" | "column";
  priority?: boolean;
}

export default function Post({ post, thumbnail, direction, priority = false }: PostProps) {
  const image = post.metadata.image || getOgImage(post.metadata.title, post.metadata.tag);

  return (
    <HotkeyBound href={`/blog/${post.slug}`} block>
      <Card
        fillWidth
        fillHeight
        key={post.slug}
        href={`/blog/${post.slug}`}
        transition="micro-medium"
        direction={direction}
        border="transparent"
        background="transparent"
        padding="4"
        radius="l-4"
        gap={direction === "column" ? undefined : "24"}
        s={{ direction: "column" }}
      >
        {thumbnail && (
          <Media
            priority={priority}
            sizes="(max-width: 768px) 100vw, 640px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            src={image}
            alt={"Thumbnail of " + post.metadata.title}
            aspectRatio="16 / 9"
            style={{ flexShrink: 0 }}
          />
        )}
        <Row fillWidth fillHeight style={{ minHeight: 0 }}>
          <Column fillWidth fillHeight paddingY="12" gap="8" vertical="start" horizontal="start" style={{ minHeight: 0 }}>
            <Row gap="12" vertical="center">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {formatDate(post.metadata.publishedAt, false)}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {readingTime(post.content)} min read
              </Text>
            </Row>
            {post.metadata.tag && (
              <Row>
                <Text variant="label-strong-s" onBackground="neutral-weak">
                  {post.metadata.tag}
                </Text>
              </Row>
            )}
            <Text
              variant="heading-strong-m"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.metadata.title}
            </Text>
            {post.metadata.summary && (
              <Text
                variant="body-default-s"
                onBackground="neutral-weak"
                wrap="balance"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.metadata.summary}
              </Text>
            )}
          </Column>
        </Row>
      </Card>
    </HotkeyBound>
  );
}
