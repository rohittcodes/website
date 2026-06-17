import { Column, Heading, Media, Row, SmartLink, Text } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";

interface FeaturedPostProps {
  post: any;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const image =
    post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`;

  return (
    <SmartLink href={`/blog/${post.slug}`} unstyled style={{ width: "100%", textDecoration: "none", margin: 0, display: "block" }}>
      <Row fillWidth gap="l" s={{ direction: "column" }}>
        <Column flex={3}>
          <Media
            priority
            sizes="(max-width: 960px) 100vw, 960px"
            border="neutral-alpha-weak"
            radius="l"
            src={image}
            alt={post.metadata.title}
            aspectRatio="16 / 9"
          />
        </Column>
        <Column flex={2} gap="12" vertical="center" paddingX="s">
          <Row gap="12" vertical="center">
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt, false)}
            </Text>
            {post.metadata.tag && (
              <Text variant="label-strong-s" onBackground="brand-weak">
                {post.metadata.tag}
              </Text>
            )}
          </Row>
          <Heading as="h2" wrap="balance" variant="heading-strong-l">
            {post.metadata.title}
          </Heading>
          {post.metadata.summary && (
            <Text variant="body-default-s" onBackground="neutral-weak" wrap="balance">
              {post.metadata.summary}
            </Text>
          )}
          <Text variant="body-default-s" onBackground="brand-weak">
            Read post →
          </Text>
        </Column>
      </Row>
    </SmartLink>
  );
}
