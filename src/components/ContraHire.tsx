"use client";

import { useEffect, useState } from "react";
import { SmartLink, Text, useTheme } from "@once-ui-system/core";
import { contra } from "@/resources";

function hireMeHref() {
  return `${contra.url}?utm_campaign=HireMeOnContra&utm_medium=${contra.analyticsUserId}`;
}

function hireMeSrc(theme: "light" | "dark") {
  const base = `https://contra.com/static/embed/media/hiremeoncontra-${theme}`;
  return { src: `${base}.png`, srcSet: `${base}.png 1x, ${base}@2x.png 2x` };
}

export function ContraRatingLine() {
  return (
    <Text variant="body-default-m" onBackground="neutral-medium">
      <SmartLink href={contra.url}>
        ★ {contra.rating} on Contra
      </SmartLink>
      {" · Open to contract work"}
    </Text>
  );
}

export function ContraHireButton() {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setTheme(resolvedTheme === "light" ? "light" : "dark");
  }, [resolvedTheme]);

  const { src, srcSet } = hireMeSrc(theme);

  return (
    <a
      href={hireMeHref()}
      target="_blank"
      rel="nofollow noopener noreferrer"
      title="Hire me on Contra"
      style={{ display: "inline-flex", borderRadius: 999, overflow: "hidden" }}
    >
      <img
        alt="Hire Me on Contra"
        src={src}
        srcSet={srcSet}
        style={{ borderWidth: 0, display: "block", height: 36, width: "auto" }}
      />
    </a>
  );
}
