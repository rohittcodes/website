"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Column, Feedback, Text, useTheme } from "@once-ui-system/core";
import { ZoomLightbox } from "./ZoomLightbox";

interface MermaidProps {
  chart: string;
}

type ThemeKey = "light" | "dark";

export function Mermaid({ chart }: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const activeTheme: ThemeKey = resolvedTheme === "dark" ? "dark" : "light";
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const [svgByTheme, setSvgByTheme] = useState<Partial<Record<ThemeKey, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [inlineSize, setInlineSize] = useState<{ width: number; height: number }>();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Pre-render both theme variants up front so toggling the site theme just
  // swaps a cached string instead of re-parsing the diagram, which used to
  // lag a beat behind the rest of the page flipping color.
  useEffect(() => {
    let cancelled = false;

    async function renderBoth() {
      try {
        const { default: mermaid } = await import("mermaid");
        const rendered: Partial<Record<ThemeKey, string>> = {};

        // mermaid.initialize sets shared global config, so these must run
        // sequentially, not in parallel, or the two renders race on theme.
        for (const themeKey of ["light", "dark"] as const) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: themeKey === "dark" ? "dark" : "default",
            fontFamily: "var(--font-default)",
          });
          const { svg } = await mermaid.render(`${id}-${themeKey}`, chart.trim());
          rendered[themeKey] = svg;
        }

        if (!cancelled) {
          setSvgByTheme(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram.");
        }
      }
    }

    renderBoth();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  const svg = svgByTheme[activeTheme] ?? null;

  if (error) {
    return (
      <Feedback
        marginTop="8"
        marginBottom="16"
        variant="danger"
        title="Mermaid diagram failed to render"
        description={error}
      />
    );
  }

  return (
    <Column
      fillWidth
      radius="l"
      background="surface"
      border="neutral-alpha-weak"
      overflowX="auto"
      horizontal="center"
      padding="16"
      marginTop="8"
      marginBottom="16"
    >
      {svg ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (rect) setInlineSize({ width: rect.width, height: rect.height });
            setOpen(true);
          }}
          aria-label="Open diagram"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            height: open ? inlineSize?.height : undefined,
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "zoom-in",
          }}
        >
          {!open && <div style={{ maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />}
        </button>
      ) : (
        <Text variant="body-default-s" onBackground="neutral-weak">
          Rendering diagram…
        </Text>
      )}
      {svg && (
        <ZoomLightbox open={open} onClose={() => setOpen(false)} label="Diagram" width={inlineSize?.width}>
          <div style={{ maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
        </ZoomLightbox>
      )}
    </Column>
  );
}
