"use client";

import { Column, Heading, IconButton, Media, Row, SmartLink, Text } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";
import { HotkeyBound } from "../keyboard/HotkeyBound";

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
          {projects.map((post, index) => (
            <HotkeyBound
              key={post.slug}
              href={`/work/${post.slug}`}
              enabled={index === activeIndex}
              block
            >
              <SmartLink
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
                <Media
                  aspectRatio="16 / 9"
                  sizes="(max-width: 960px) 100vw, 960px"
                  src={post.image}
                  alt={post.title}
                  // The first slide is what's actually visible on first paint
                  // (this carousel is the home page's real LCP candidate).
                  priority={index === 0}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    height: "62%",
                    pointerEvents: "none",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                  }}
                />
                <Column
                  position="absolute"
                  bottom="0"
                  left="0"
                  fillWidth
                  gap="4"
                  padding="l"
                >
                  <Heading
                    as="h3"
                    variant="heading-strong-l"
                    style={{ color: "white" }}
                  >
                    {post.title}
                  </Heading>
                  <Text
                    variant="body-default-s"
                    wrap="balance"
                    style={{ color: "rgba(255,255,255,0.88)" }}
                  >
                    {post.summary}
                  </Text>
                </Column>
              </SmartLink>
            </HotkeyBound>
          ))}
        </div>
        {count > 1 && (
          <>
            <Row
              position="absolute"
              left="16"
              zIndex={1}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <Row radius="m" background="surface">
                <IconButton
                  onClick={() => goTo(activeIndex - 1)}
                  variant="secondary"
                  icon="chevronLeft"
                  aria-label="Previous project"
                />
              </Row>
            </Row>
            <Row
              position="absolute"
              right="16"
              zIndex={1}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <Row radius="m" background="surface">
                <IconButton
                  onClick={() => goTo(activeIndex + 1)}
                  variant="secondary"
                  icon="chevronRight"
                  aria-label="Next project"
                />
              </Row>
            </Row>
            <Row position="absolute" top="16" right="16" gap="8" zIndex={1}>
              <Row radius="m" background="surface">
                <IconButton
                  onClick={() => setIsPlaying((p) => !p)}
                  variant="secondary"
                  icon={isPlaying ? "pause" : "play"}
                  aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                />
              </Row>
            </Row>
          </>
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
