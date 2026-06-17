"use client";

import { Column, Heading, IconButton, Media, Row, SmartLink, Text } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

interface SlideData {
  slug: string;
  title: string;
  summary: string;
  image: string;
}

const AUTO_PLAY_INTERVAL = 4500;

export function FeaturedWorkCarousel({ projects }: { projects: SlideData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const count = projects.length;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && count > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % count);
      }, AUTO_PLAY_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, count]);

  if (count === 0) return null;

  const goTo = (index: number) => setActiveIndex(((index % count) + count) % count);

  return (
    <Column fillWidth gap="12">
      <div style={{ overflow: "hidden", width: "100%", position: "relative", borderRadius: "var(--radius-l)" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
            transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
        >
          {projects.map((post) => (
            <SmartLink
              key={post.slug}
              href={`/work/${post.slug}`}
              unstyled
              style={{
                position: "relative",
                display: "block",
                width: "100%",
                margin: 0,
                flexShrink: 0,
              }}
            >
              <Media aspectRatio="16 / 9" sizes="(max-width: 960px) 100vw, 960px" src={post.image} alt={post.title} />
              <Column
                position="absolute"
                bottom="0"
                left="0"
                fillWidth
                gap="4"
                padding="l"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}
              >
                <Heading as="h3" variant="heading-strong-l" style={{ color: "white" }}>
                  {post.title}
                </Heading>
                <Text variant="body-default-s" wrap="balance" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {post.summary}
                </Text>
              </Column>
            </SmartLink>
          ))}
        </div>
        {count > 1 && (
          <Row position="absolute" top="16" right="16" gap="8" zIndex={1}>
            <Row radius="m" background="surface">
              <IconButton
                onClick={() => setIsPlaying((p) => !p)}
                variant="secondary"
                icon={isPlaying ? "pause" : "play"}
              />
            </Row>
          </Row>
        )}
      </div>
      {count > 1 && (
        <Row fillWidth gap="4" horizontal="center">
          {projects.map((post, index) => (
            <Row
              key={post.slug}
              onClick={() => goTo(index)}
              cursor="interactive"
              fillWidth
              height="12"
              vertical="center"
            >
              <Row
                radius="full"
                fillWidth
                height="2"
                background={index === activeIndex ? "brand-strong" : "neutral-alpha-medium"}
                transition="micro-short"
              />
            </Row>
          ))}
        </Row>
      )}
    </Column>
  );
}
