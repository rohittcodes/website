"use client";

import { Column, IconButton, Media, Row } from "@once-ui-system/core";
import { useState } from "react";

interface WorkCarouselProps {
  items: { src: string; alt?: string }[];
  sizes?: string;
  priority?: boolean;
}

export function WorkCarousel({ items, sizes, priority = false }: WorkCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;

  if (count === 0) return null;

  const goTo = (index: number) => setActiveIndex(((index % count) + count) % count);

  return (
    <Column fillWidth gap="8">
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          position: "relative",
          borderRadius: "var(--radius-l)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
            transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {items.map((item, index) => (
            <div key={`${item.src}-${index}`} style={{ width: "100%", flexShrink: 0 }}>
              <Media
                sizes={sizes}
                radius="l"
                src={item.src}
                alt={item.alt ?? ""}
                // Only the first slide of an above-the-fold carousel is a real
                // LCP candidate; every other slide lazy-loads like normal.
                priority={priority && index === 0}
              />
            </div>
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
                  aria-label="Previous image"
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
                  aria-label="Next image"
                />
              </Row>
            </Row>
          </>
        )}
      </div>
      {count > 1 && (
        <Row fillWidth gap="4" horizontal="center" paddingX="s">
          {items.map((item, index) => (
            <Row
              key={`${item.src}-indicator-${index}`}
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
                background={index === activeIndex ? "neutral-strong" : "neutral-alpha-medium"}
                transition="micro-short"
              />
            </Row>
          ))}
        </Row>
      )}
    </Column>
  );
}
