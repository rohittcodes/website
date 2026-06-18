import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { person } from "@/resources";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function getAvatarDataUri(): string {
  const filePath = join(process.cwd(), "public", person.avatar);
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={getAvatarDataUri()}
          width={size.width}
          height={size.height}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
    ),
    { ...size }
  );
}
