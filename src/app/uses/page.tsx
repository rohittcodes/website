import { Column, Grid, Heading, Line, Row, Schema, Tag, Text } from "@once-ui-system/core";
import { about, baseURL, person } from "@/resources";
import { IconName } from "@/resources/icons";
import { generateSeoMetadata } from "@/utils/seo";
import { assertRouteEnabled } from "@/utils/utils";

const usesTitle = `Setup – ${person.name}`;
const usesDescription = "The tools, hardware, and software that get me through the day.";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: usesTitle,
    description: usesDescription,
    baseURL,
    path: "/uses",
  });
}

interface UseItem {
  name: string;
  description: string;
  tags: { name: string; icon?: IconName }[];
}

const sections: { title: string; items: UseItem[] }[] = [
  {
    title: "Editor & Terminal",
    items: [
      {
        name: "VS Code",
        description: "Primary editor. Clean, fast, and has everything I need.",
        tags: [{ name: "Editor" }],
      },
      {
        name: "Cursor",
        description: "AI-first editor I switch to for heavy feature work.",
        tags: [{ name: "Editor" }, { name: "AI" }],
      },
      {
        name: "Warp",
        description: "Terminal with AI autocomplete and command search built in.",
        tags: [{ name: "Terminal" }],
      },
    ],
  },
  {
    title: "Stack",
    items: [
      {
        name: "Next.js",
        description: "Default for anything web: App Router, RSC, the whole deal.",
        tags: [{ name: "Framework", icon: "nextjs" }],
      },
      {
        name: "TypeScript",
        description: "Always. No exceptions.",
        tags: [{ name: "Language", icon: "typescript" }],
      },
      {
        name: "Tailwind CSS",
        description: "For most styling outside this portfolio.",
        tags: [{ name: "Styling" }],
      },
      {
        name: "Prisma + PostgreSQL",
        description: "Primary DB setup for most projects. Simple schema workflow.",
        tags: [{ name: "Database", icon: "postgresql" }],
      },
      {
        name: "tRPC",
        description: "End-to-end typesafe APIs without the boilerplate.",
        tags: [{ name: "API" }],
      },
      {
        name: "Vercel",
        description: "Where most things ship. Zero-config deploys.",
        tags: [{ name: "Infra" }],
      },
      {
        name: "Docker",
        description: "Containerizing services for consistent local and prod environments.",
        tags: [{ name: "Infra", icon: "docker" }],
      },
      {
        name: "Node.js",
        description: "Runtime for backend services and tooling scripts.",
        tags: [{ name: "Runtime", icon: "nodejs" }],
      },
    ],
  },
  {
    title: "AI & LLM Tools",
    items: [
      {
        name: "Claude",
        description: "Primary LLM for both building and day-to-day coding assistance.",
        tags: [{ name: "AI" }],
      },
      {
        name: "OpenAI API",
        description: "Used for embeddings and specific model capabilities.",
        tags: [{ name: "AI", icon: "openai" }, { name: "API" }],
      },
      {
        name: "LangChain / LlamaIndex",
        description: "For RAG pipelines and agentic workflows.",
        tags: [{ name: "AI" }, { name: "Framework" }],
      },
    ],
  },
  {
    title: "Hardware",
    items: [
      {
        name: 'MacBook Pro 14" (M3 Pro)',
        description: "Daily driver for everything: dev, design review, and meetings.",
        tags: [{ name: "Laptop" }],
      },
      {
        name: "LG 27\" 4K Monitor",
        description: "Extra screen real estate for splitting code and docs.",
        tags: [{ name: "Display" }],
      },
      {
        name: "Keychron K8 Pro",
        description: "Mechanical keyboard, swapped to brown switches.",
        tags: [{ name: "Keyboard" }],
      },
      {
        name: "Logitech MX Master 3S",
        description: "Comfortable for long sessions, great for multi-monitor flow.",
        tags: [{ name: "Mouse" }],
      },
      {
        name: "Sony WH-1000XM5",
        description: "Noise cancelling for focus blocks and calls.",
        tags: [{ name: "Audio" }],
      },
    ],
  },
  {
    title: "Apps",
    items: [
      {
        name: "Notion",
        description: "Notes, planning, and project tracking.",
        tags: [{ name: "Productivity" }],
      },
      {
        name: "Raycast",
        description: "Launcher that replaced everything else.",
        tags: [{ name: "Productivity" }],
      },
      {
        name: "Arc",
        description: "Browser. Spaces keep work and personal separate.",
        tags: [{ name: "Browser" }],
      },
    ],
  },
];

export default function Uses() {
  assertRouteEnabled("/uses");

  return (
    <>
    <Schema
      as="webPage"
      baseURL={baseURL}
      path="/uses"
      title={usesTitle}
      description={usesDescription}
      author={{
        name: person.name,
        url: `${baseURL}${about.path}`,
        image: `${baseURL}${person.avatar}`,
      }}
    />
    <Column maxWidth="m" paddingTop="16">
      <Column paddingX="l" marginBottom="l" gap="8">
        <Heading variant="display-strong-s">Setup</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Tools and gear I use day to day. Updated occasionally.
        </Text>
      </Column>
      <Column fillWidth paddingX="l" gap="xl">
        {sections.map((section) => (
          <Column key={section.title} fillWidth gap="m">
            <Row fillWidth vertical="center" gap="16">
              <Heading as="h2" variant="display-strong-xs">
                {section.title}
              </Heading>
              <Line flex={1} />
            </Row>
            <Grid columns="2" m={{ columns: 1 }} gap="12" fillWidth>
              {section.items.map((item) => (
                <Column
                  key={item.name}
                  fillWidth
                  fillHeight
                  padding="m"
                  gap="8"
                  radius="m"
                  border="neutral-alpha-weak"
                  background="surface"
                >
                  <Text variant="label-strong-m" onBackground="neutral-strong">
                    {item.name}
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak" style={{ flex: 1 }}>
                    {item.description}
                  </Text>
                  <Row gap="8" wrap>
                    {item.tags.map((tag) => (
                      <Tag key={tag.name} size="s" prefixIcon={tag.icon}>
                        {tag.name}
                      </Tag>
                    ))}
                  </Row>
                </Column>
              ))}
            </Grid>
          </Column>
        ))}
      </Column>
    </Column>
    </>
  );
}
