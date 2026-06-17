import { MetadataRoute } from "next";
import { person } from "@/resources";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} – Portfolio`,
    short_name: person.name,
    description: `Portfolio of ${person.name}, ${person.role}`,
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e0e",
    theme_color: "#0e0e0e",
    icons: [
      {
        src: "/images/avatar.jpg",
        sizes: "460x460",
        type: "image/png",
      },
    ],
  };
}
