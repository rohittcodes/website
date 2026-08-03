import { Column, Heading, Text, Row, Schema, Tag, Line, SmartLink } from "@once-ui-system/core";
import { about, baseURL, person } from "@/resources";
import { generateSeoMetadata } from "@/utils/seo";
import { assertRouteEnabled } from "@/utils/utils";

const nowTitle = `Now – ${person.name}`;
const nowDescription =
  "A running log of what I'm building, learning, and reading right now, updated periodically.";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: nowTitle,
    description: nowDescription,
    baseURL,
    path: "/now",
  });
}

const lastUpdated = "June 2025";

const now = {
  building: [
    {
      title: "RAG recommendation engine @ createxp",
      description:
        "Iterating on retrieval quality and latency, adding re-ranking and experimenting with hybrid sparse/dense search.",
    },
    {
      title: "Linea",
      description:
        "Adding a workflow marketplace so teams can share and fork agent pipelines. Building the execution sandbox.",
    },
  ],
  learning: [
    {
      title: "Distributed systems",
      description:
        "Working through Designing Data-Intensive Applications. Focused on consensus algorithms and replication strategies.",
    },
    {
      title: "Rust",
      description:
        "Learning for performance-critical infra work. Following the Book + building small CLI tools to practice ownership.",
    },
  ],
  reading: [
    {
      title: "The Pragmatic Programmer",
      description: "Rereading. Hits differently after a year in production.",
    },
    {
      title: "Attention Is All You Need",
      description:
        "Going back to the original transformer paper to understand what modern architectures are actually changing.",
    },
  ],
  thinking: `I've been thinking about the gap between "AI features" and "AI-native products." Most products bolt LLMs onto existing flows. The interesting companies are designing the product around the model's capabilities from the start, and that's a fundamentally different design problem.

Also thinking about where RAG actually breaks down at scale and whether graph-based retrieval (knowledge graphs + vector hybrid) is worth the complexity tradeoff.`,
};

export default function Now() {
  assertRouteEnabled("/now");

  return (
    <>
    <Schema
      as="webPage"
      baseURL={baseURL}
      path="/now"
      title={nowTitle}
      description={nowDescription}
      author={{
        name: person.name,
        url: `${baseURL}${about.path}`,
        image: `${baseURL}${person.avatar}`,
      }}
    />
    <Column maxWidth="s" paddingTop="16" paddingX="l" gap="xl">
      <Column gap="8">
        <Row fillWidth horizontal="between" vertical="end">
          <Heading variant="heading-strong-l">Now</Heading>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Updated {lastUpdated}
          </Text>
        </Row>
        <Text variant="body-default-m" onBackground="neutral-weak">
          A snapshot of what I&apos;m doing right now.{" "}
          <SmartLink href="https://nownownow.com/about">What is a now page?</SmartLink>
        </Text>
      </Column>

      <Line />

      {/* Building */}
      <Column gap="m">
        <Row gap="8" vertical="center">
          <Tag size="s">Building</Tag>
        </Row>
        <Column gap="m">
          {now.building.map((item) => (
            <Column key={item.title} gap="4">
              <Text variant="label-strong-m">{item.title}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {item.description}
              </Text>
            </Column>
          ))}
        </Column>
      </Column>

      <Line />

      {/* Learning */}
      <Column gap="m">
        <Row gap="8" vertical="center">
          <Tag size="s">Learning</Tag>
        </Row>
        <Column gap="m">
          {now.learning.map((item) => (
            <Column key={item.title} gap="4">
              <Text variant="label-strong-m">{item.title}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {item.description}
              </Text>
            </Column>
          ))}
        </Column>
      </Column>

      <Line />

      {/* Reading */}
      <Column gap="m">
        <Row gap="8" vertical="center">
          <Tag size="s">Reading</Tag>
        </Row>
        <Column gap="m">
          {now.reading.map((item) => (
            <Column key={item.title} gap="4">
              <Text variant="label-strong-m">{item.title}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {item.description}
              </Text>
            </Column>
          ))}
        </Column>
      </Column>

      <Line />

      {/* Thinking */}
      <Column gap="m">
        <Row gap="8" vertical="center">
          <Tag size="s">Thinking about</Tag>
        </Row>
        <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: "175%" }}>
          {now.thinking}
        </Text>
      </Column>
    </Column>
    </>
  );
}
