import {
  Heading,
  Text,
  Button,
  RevealFx,
  Column,
  Badge,
  Row,
  Line,
  SmartLink,
} from "@once-ui-system/core";
import { home, about, person, social, contra, baseURL, routes } from "@/resources";
import { ContactForm, GitHubRepos, Schema } from "@/components";
import { Projects } from "@/components/work/Projects";
import { FeaturedWork } from "@/components/work/FeaturedWork";
import { HeroStage } from "@/components/hero/HeroStage";
import { Posts } from "@/components/blog/Posts";
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
        <HeroStage>
        <Column
          fillWidth
          horizontal="center"
          vertical="center"
          gap="m"
          paddingY="16"
        >
          <Column maxWidth="s" horizontal="center" align="center">
            {home.featured.display && (
              <Column fillWidth horizontal="center" paddingTop="12" paddingBottom="16">
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
              </Column>
            )}
            <Heading wrap="balance" variant="display-strong-m" paddingBottom="8">
              {home.headline}
            </Heading>
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="body-default-l"
              paddingBottom="16"
            >
              {home.subline}
            </Text>
            <Row gap="12" vertical="center" wrap horizontal="center" paddingTop="12">
              <Button
                id="contact"
                data-border="rounded"
                href={`mailto:${person.email}`}
                variant="primary"
                size="m"
                prefixIcon="email"
              >
                Get in touch
              </Button>
              <Button
                id="work"
                data-border="rounded"
                href="/work"
                variant="primary"
                size="m"
                arrowIcon
              >
                View work
              </Button>
            </Row>
            <Row gap="16" vertical="center" wrap horizontal="center" paddingTop="12">
              <SmartLink href="/resume">
                <Text variant="label-default-s">Resume</Text>
              </SmartLink>
              {social
                .filter((item) => ["LinkedIn", "GitHub"].includes(item.name))
                .map((item) => (
                  <SmartLink key={item.name} href={item.link}>
                    <Text variant="label-default-s">{item.name}</Text>
                  </SmartLink>
                ))}
              <SmartLink href={contra.url}>
                <Text variant="label-default-s">Contra (contract)</Text>
              </SmartLink>
            </Row>
          </Column>
        </Column>
        </HeroStage>
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
          <Column fillWidth gap="16" paddingX="l" marginBottom="m">
            <Row fillWidth vertical="center" gap="16">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
              <Line flex={1} />
            </Row>
            <Posts range={[1, 2]} columns="2" />
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
