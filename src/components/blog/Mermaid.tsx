"use client";

import { useEffect, useId, useState } from "react";
import { Column, Feedback, Text, useTheme } from "@once-ui-system/core";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "default",
          fontFamily: "var(--font-default)",
        });

        const { svg: rendered } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram.");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

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
        <div style={{ maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <Text variant="body-default-s" onBackground="neutral-weak">
          Rendering diagram…
        </Text>
      )}
    </Column>
  );
}
