import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  // getPosts()/getProjects() read these directories via fs at runtime using a
  // dynamically-built path (path.join(process.cwd(), ...customPath)), which Next's
  // output file tracing can't follow statically. Without this, the .mdx files are
  // missing from the deployed serverless function bundle: it works with `next dev`
  // (full source tree on disk) and even `next build` locally, but any route that
  // reads them at runtime (ISR revalidation, on-demand SSG for new slugs) 404s in
  // production because fs.existsSync(dir) fails.
  outputFileTracingIncludes: {
    "/": ["./src/app/blog/posts/**/*.mdx", "./src/app/work/projects/**/*.mdx"],
    "/blog": ["./src/app/blog/posts/**/*.mdx"],
    "/blog/[slug]": ["./src/app/blog/posts/**/*.mdx"],
    "/work": ["./src/app/work/projects/**/*.mdx"],
    "/work/[slug]": ["./src/app/work/projects/**/*.mdx"],
    "/sitemap.xml": ["./src/app/blog/posts/**/*.mdx", "./src/app/work/projects/**/*.mdx"],
    "/api/rss": ["./src/app/blog/posts/**/*.mdx"],
  },
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/api/og/generate",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
        pathname: "/uploads/**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
