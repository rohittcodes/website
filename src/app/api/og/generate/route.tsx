import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import type { ReactNode } from "react";
import { baseURL, person } from "@/resources";

export const runtime = "nodejs";

function getAvatarDataUri(): string {
  const filePath = join(process.cwd(), "public", person.avatar);
  const buffer = readFileSync(filePath);
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const mime = isPng ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function loadGoogleFont(font: string, weight = 400) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`;
  const css = await (await fetch(cssUrl)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (resource) {
    const res = await fetch(resource[1]);
    if (res.status === 200) return await res.arrayBuffer();
  }
  throw new Error("failed to load font");
}

// Fonts don't change between requests, and Fluid Compute reuses warm
// instances, so cache the fetch instead of hitting Google Fonts every time.
let fontsPromise: Promise<{
  geistRegular: ArrayBuffer;
  geistBold: ArrayBuffer;
  mono: ArrayBuffer;
}> | null = null;

function getFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont("Geist", 400),
      loadGoogleFont("Geist", 600),
      loadGoogleFont("JetBrains+Mono", 400),
    ]).then(([geistRegular, geistBold, mono]) => ({ geistRegular, geistBold, mono }));
  }
  return fontsPromise;
}

const TAG_ACCENTS: Record<string, string> = {
  AI: "#5eead4",
  Solana: "#c4b5fd",
  Backend: "#86efac",
};
const DEFAULT_ACCENT = "#8fa8ff";

// Satori trims a trailing/leading regular space on a flex text node, so any
// boundary that needs a visible gap uses a non-breaking space instead.
const NBSP = " ";

function slugify(title: string, maxLen = 26): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  let slug = "";
  for (const word of words) {
    const next = slug ? `${slug}-${word}` : word;
    if (next.length > maxLen) break;
    slug = next;
  }
  return slug || (words[0] || "post").slice(0, maxLen);
}

// Deterministic hash so the same title always gets the same layout (social
// crawlers cache these), while different posts land on different variants.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(hash, 31) + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const MOCK_WIDTH = 420;

function WindowChrome({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: MOCK_WIDTH,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.035)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ width: 11, height: 11, borderRadius: 999, background: "#ff5f57", display: "flex" }} />
        <div style={{ width: 11, height: 11, borderRadius: 999, background: "#febc2e", display: "flex" }} />
        <div style={{ width: 11, height: 11, borderRadius: 999, background: "#28c840", display: "flex" }} />
      </div>
      {children}
    </div>
  );
}

function TerminalMock({ accent, filename, tag }: { accent: string; filename: string; tag?: string }) {
  return (
    <WindowChrome>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "22px 22px 26px",
          fontFamily: "JetBrains Mono",
          fontSize: 17,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.35)" }}>{tag ? "~/blog" : "~"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.9)" }}>
          <span style={{ display: "flex", color: accent }}>$</span>
          <span style={{ display: "flex" }}>cat {filename}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.5)" }}>
          → reading
          <span style={{ display: "flex", width: 9, height: 18, marginLeft: 8, background: accent }} />
        </span>
      </div>
    </WindowChrome>
  );
}

function EditorMock({ accent, filename }: { accent: string; filename: string }) {
  const lines: { num: number; parts: { text: string; color?: string }[] }[] = [
    {
      num: 1,
      parts: [
        { text: `export function${NBSP}`, color: "rgba(255,255,255,0.55)" },
        { text: "Post", color: accent },
        { text: "() {" },
      ],
    },
    {
      num: 2,
      parts: [
        { text: `return${NBSP}`, color: "rgba(255,255,255,0.55)" },
        { text: `<Article${NBSP}/>`, color: accent },
        { text: ";" },
      ],
    },
    { num: 3, parts: [{ text: "}" }] },
  ];

  return (
    <WindowChrome>
      <div style={{ display: "flex", padding: "0 22px" }}>
        <div
          style={{
            display: "flex",
            padding: "10px 16px",
            borderTop: `2px solid ${accent}`,
            fontFamily: "JetBrains Mono",
            fontSize: 14,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {filename}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "18px 22px 26px",
          fontFamily: "JetBrains Mono",
          fontSize: 16,
        }}
      >
        {lines.map((line) => (
          <span key={line.num} style={{ display: "flex", gap: 8, color: "rgba(255,255,255,0.9)" }}>
            <span style={{ display: "flex", width: 12, color: "rgba(255,255,255,0.25)" }}>{line.num}</span>
            <span style={{ display: "flex" }}>
              {line.parts.map((part, i) => (
                <span key={i} style={{ display: "flex", color: part.color || "rgba(255,255,255,0.9)" }}>
                  {part.text}
                </span>
              ))}
            </span>
          </span>
        ))}
      </div>
    </WindowChrome>
  );
}

function ChatMock({ accent }: { accent: string }) {
  return (
    <WindowChrome>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              maxWidth: 260,
              padding: "10px 16px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 16,
            }}
          >
            why did it fail?
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: 300,
              padding: "10px 16px",
              borderRadius: 14,
              border: `1px solid ${accent}55`,
              background: `${accent}14`,
              color: "rgba(255,255,255,0.9)",
              fontSize: 16,
            }}
          >
            checking the trace
            <span style={{ display: "flex", width: 8, height: 16, marginLeft: 8, background: accent }} />
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || person.name;
  const tag = url.searchParams.get("tag") || undefined;
  const accent = (tag && TAG_ACCENTS[tag]) || DEFAULT_ACCENT;
  const avatarSrc = getAvatarDataUri();
  const filename = `${slugify(title)}.mdx`;

  const seed = hashString(title);
  const mockups = [TerminalMock, EditorMock, ChatMock];
  const Mockup = mockups[seed % mockups.length];
  const mirror = ((seed >>> 4) & 1) === 1;
  const altCorners = ((seed >>> 8) & 1) === 1;

  const { geistRegular, geistBold, mono } = await getFonts();

  const titleBlock = (
    <div
      style={{
        display: "flex",
        fontSize: title.length > 44 ? 50 : 60,
        fontWeight: 600,
        lineHeight: 1.14,
        letterSpacing: "-0.03em",
        color: "#ffffff",
        maxWidth: 620,
        flexShrink: 0,
      }}
    >
      {title}
    </div>
  );

  const mockupBlock =
    Mockup === TerminalMock ? (
      <TerminalMock accent={accent} filename={filename} tag={tag} />
    ) : Mockup === EditorMock ? (
      <EditorMock accent={accent} filename={filename} />
    ) : (
      <ChatMock accent={accent} />
    );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Geist",
      }}
    >
      {/* Diagonal depth panels, echoing the hand-designed covers */}
      <div
        style={{
          position: "absolute",
          top: -260,
          ...(altCorners ? { left: -220 } : { right: -220 }),
          width: 720,
          height: 720,
          borderRadius: 64,
          background: "#131313",
          transform: `rotate(${altCorners ? -18 : 18}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -260,
          ...(altCorners ? { left: -220 } : { right: -220 }),
          width: 720,
          height: 720,
          borderRadius: 64,
          background: `radial-gradient(circle at 30% 30%, ${accent}26 0%, transparent 65%)`,
          transform: `rotate(${altCorners ? -18 : 18}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300,
          ...(altCorners ? { right: -260 } : { left: -260 }),
          width: 640,
          height: 640,
          borderRadius: 64,
          background: "#101010",
          transform: `rotate(${altCorners ? 12 : -12}deg)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 76px",
        }}
      >
        {/* Top: tag chip, only when the page actually has a category */}
        <div style={{ display: "flex", height: 40 }}>
          {tag && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, background: accent, display: "flex" }} />
              <span style={{ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{tag}</span>
            </div>
          )}
        </div>

        {/* Middle: title + mockup, order and mockup style vary per post */}
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          {mirror ? (
            <>
              {mockupBlock}
              {titleBlock}
            </>
          ) : (
            <>
              {titleBlock}
              {mockupBlock}
            </>
          )}
        </div>

        {/* Bottom: identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img
            src={avatarSrc}
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>
              {person.name}
            </span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
              {person.role}
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 16,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 400,
            }}
          >
            {baseURL.replace("https://", "")}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
      fonts: [
        { name: "Geist", data: geistRegular, style: "normal", weight: 400 },
        { name: "Geist", data: geistBold, style: "normal", weight: 600 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
