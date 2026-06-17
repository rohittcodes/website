import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { baseURL, person } from "@/resources";

export const runtime = "nodejs";

function getAvatarDataUri(): string {
  const filePath = join(process.cwd(), "public", person.avatar);
  const buffer = readFileSync(filePath);
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const mime = isPng ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || person.name;
  const avatarSrc = getAvatarDataUri();

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

  const [regular, bold] = await Promise.all([
    loadGoogleFont("Geist", 400),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0e0e0e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent gradient top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,180,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Accent gradient bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -60,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,160,80,0.12) 0%, transparent 70%)",
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
          padding: "72px 80px",
        }}
      >
        {/* Top: title */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 56 : 68,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Bottom: identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img
            src={avatarSrc}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>
              {person.name}
            </span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
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
        { name: "Geist", data: regular, style: "normal", weight: 400 },
        { name: "Geist", data: bold, style: "normal", weight: 600 },
      ],
    }
  );
}
