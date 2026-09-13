import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Line,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { ContactForm, GitHubRepos, Schema } from "@/components";
import { HireChatButton } from "@/components/chat/HireChatButton";
import { Projects } from "@/components/work/Projects";
import { FeaturedWork } from "@/components/work/FeaturedWork";
import { Posts } from "@/components/blog/Posts";
import { HotkeyBound } from "@/components/keyboard/HotkeyBound";
import { generateSeoMetadata } from "@/utils/seo";
import { assertRouteEnabled } from "@/utils/utils";
import { getPinnedRepos } from "@/lib/github";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  assertRouteEnabled("/");

  const repos = await getPinnedRepos();

  return (
    <RevealFx translateY="8" fillWidth horizontal="center">
      <Column maxWidth="m" gap="l" paddingY="8" horizontal="center">
        <Schema
          as="webPage"
          baseURL={baseURL}
          path={home.path}
          title={home.title}
          description={home.description}
          image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
          author={{
            name: person.name,
            url: `${baseURL}${about.path}`,
            image: `${baseURL}${person.avatar}`,
          }}
        />
        <Column fillWidth horizontal="center" gap="m">
          <Column maxWidth="s" horizontal="center" align="center">
            {home.featured.display && (
              <Column fillWidth horizontal="center" paddingTop="12" paddingBottom="16">
                <HotkeyBound href={home.featured.href}>
                  <Badge
                    background="brand-alpha-weak"
                    paddingX="12"
                    paddingY="4"
                    onBackground="neutral-strong"
                    textVariant="label-default-s"
                    arrow={false}
                    href={home.featured.href}
                  >
                    <Row paddingY="2">{home.featured.title}</Row>
                  </Badge>
                </HotkeyBound>
              </Column>
            )}
            <Heading wrap="balance" variant="display-strong-m" paddingBottom="8">
              {home.headline}
            </Heading>
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-l"
              paddingBottom="16"
            >
              {home.subline}
            </Text>
            <Row gap="12" vertical="center" wrap horizontal="center" paddingTop="12">
              <HotkeyBound href={about.path}>
                <Button
                  id="about"
                  data-border="rounded"
                  href={about.path}
                  variant="secondary"
                  size="m"
                  weight="default"
                  arrowIcon
                >
                  <Row gap="8" vertical="center" paddingRight="4">
                    {about.avatar.display && (
                      <Avatar
                        marginRight="8"
                        style={{ marginLeft: "-0.75rem" }}
                        src={person.avatar}
                        size="m"
                      />
                    )}
                    {about.title}
                  </Row>
                </Button>
              </HotkeyBound>
              <HireChatButton />
            </Row>
          </Column>
        </Column>
        <Column fillWidth gap="16" paddingX="l">
          <Row fillWidth vertical="center" gap="16">
            <Heading as="h2" variant="display-strong-xs">
              Selected work
            </Heading>
            <Line flex={1} />
          </Row>
          <FeaturedWork limit={3} />
        </Column>
        {routes["/blog"] && (
          <Column fillWidth gap="16" marginBottom="m">
            <Row fillWidth paddingRight="40">
              <Line maxWidth={48} />
            </Row>
            <Row fillWidth gap="16" marginTop="16" s={{ direction: "column" }}>
              <Row flex={1} paddingLeft="l" paddingTop="8">
                <Heading as="h2" variant="display-strong-xs" wrap="balance">
                  Latest from the blog
                </Heading>
              </Row>
              <Row flex={3} paddingX="20">
                <Posts range={[1, 2]} columns="2" />
              </Row>
            </Row>
            <Row fillWidth paddingLeft="40" horizontal="end">
              <Line maxWidth={48} />
            </Row>
          </Column>
        )}
        <Column fillWidth gap="16" paddingX="l">
          <Row fillWidth vertical="center" gap="16">
            <Heading as="h2" variant="display-strong-xs">
              Case studies
            </Heading>
            <Line flex={1} />
          </Row>
        </Column>
        <Projects range={[4, 5]} />
        <Column fillWidth gap="16" paddingX="l">
          <Row fillWidth vertical="center" gap="16">
            <Heading as="h2" variant="display-strong-xs">
              Open source
            </Heading>
            <Line flex={1} />
          </Row>
          <GitHubRepos repos={repos} />
        </Column>
        <ContactForm marginBottom="m" />
      </Column>
    </RevealFx>
  );
}
