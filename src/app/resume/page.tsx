import { Column, Row, Heading, Text, Line, Button } from "@once-ui-system/core";
import { baseURL, person, about, resume } from "@/resources";
import { PrintButton } from "@/components/resume/PrintButton";
import { generateSeoMetadata } from "@/utils/seo";
import { assertRouteEnabled } from "@/utils/utils";
import styles from "./resume.module.css";
import "./print.css";

const contacts = [
  { label: resume.location, href: undefined },
  { label: person.email, href: `mailto:${person.email}` },
  { label: "rohitt.codes", href: baseURL },
  { label: "linkedin.com/in/rohittcodes", href: "https://www.linkedin.com/in/rohittcodes" },
  { label: "github.com/rohittcodes", href: "https://github.com/rohittcodes" },
];

export async function generateMetadata() {
  return generateSeoMetadata({
    title: `Resume | ${person.name}`,
    description: resume.summary,
    baseURL,
    path: "/resume",
  });
}

export default function Resume() {
  assertRouteEnabled("/resume");

  return (
    <Column maxWidth="s" paddingY="24" paddingX="l" gap="xl">
      <Column gap="8" className="section">
        <Row fillWidth horizontal="between" vertical="end" wrap gap="16">
          <Column gap="4">
            <Heading variant="display-strong-l">{person.name}</Heading>
            <Text variant="heading-default-m" onBackground="neutral-weak">
              {resume.title}
            </Text>
          </Column>
          <Row gap="8" className={styles.printButton} wrap>
            <Button href="/data/rohitt.pdf" variant="primary" size="s" prefixIcon="document" download>
              Download PDF
            </Button>
            <Button href={`mailto:${person.email}`} variant="secondary" size="s" prefixIcon="email">
              Email
            </Button>
            <Button
              href="https://www.linkedin.com/in/rohittcodes"
              variant="secondary"
              size="s"
              prefixIcon="linkedin"
            >
              LinkedIn
            </Button>
            <PrintButton />
          </Row>
        </Row>
        <Row gap="16" wrap paddingTop="4">
          {contacts.map((contact) => (
            <Text key={contact.label} variant="body-default-s" onBackground="neutral-weak">
              {contact.href ? (
                <a href={contact.href} style={{ color: "inherit" }}>
                  {contact.label}
                </a>
              ) : (
                contact.label
              )}
            </Text>
          ))}
        </Row>
      </Column>

      <Line />

      <Column gap="8" className="section">
        <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
          SUMMARY
        </Heading>
        <Text variant="body-default-m">{resume.summary}</Text>
      </Column>

      <Line />

      {about.work.display && (
        <Column gap="l" className="section">
          <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
            EXPERIENCE
          </Heading>
          {about.work.experiences.map((exp, i) => (
            <Column key={`${exp.company}-${exp.timeframe}-${i}`} gap="8">
              <Row fillWidth horizontal="between" vertical="end" wrap gap="8">
                <Text variant="heading-strong-m">
                  {exp.role}, {exp.company}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {exp.timeframe}
                </Text>
              </Row>
              <Column as="ul" gap="4" paddingLeft="m">
                {exp.achievements.map((achievement, j) => (
                  <Text as="li" key={j} variant="body-default-s">
                    {achievement}
                  </Text>
                ))}
              </Column>
            </Column>
          ))}
        </Column>
      )}

      <Line />

      <Column gap="l" className="section">
        <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
          PROJECTS
        </Heading>
        {resume.projects.map((project) => (
          <Column key={project.name} gap="8">
            <Row fillWidth horizontal="between" vertical="end" wrap gap="8">
              <Column gap="4">
                <Text variant="heading-strong-m">{project.name}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {project.stack}
                </Text>
              </Column>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                <a href={project.href} style={{ color: "inherit" }}>
                  {project.hrefLabel}
                </a>
              </Text>
            </Row>
            <Column as="ul" gap="4" paddingLeft="m">
              {project.bullets.map((bullet) => (
                <Text as="li" key={bullet} variant="body-default-s">
                  {bullet}
                </Text>
              ))}
            </Column>
          </Column>
        ))}
      </Column>

      <Line />

      <Column gap="8" className="section">
        <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
          SKILLS & TECHNOLOGIES
        </Heading>
        {resume.skills.map((group) => (
          <Text key={group.title} variant="body-default-s">
            <Text as="span" variant="label-strong-s">
              {group.title}:{" "}
            </Text>
            {group.items}
          </Text>
        ))}
      </Column>

      <Line />

      <Column gap="8" className="section">
        <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
          OPEN SOURCE & ACHIEVEMENTS
        </Heading>
        <Column as="ul" gap="4" paddingLeft="m">
          {resume.openSource.map((item) => (
            <Text as="li" key={item} variant="body-default-s">
              {item}
            </Text>
          ))}
          <Text as="li" variant="body-default-s">
            Technical writing: {resume.writing.join(" | ")}
          </Text>
        </Column>
      </Column>

      <Line />

      {about.studies.display && (
        <Column gap="l" className="section">
          <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">
            EDUCATION
          </Heading>
          {about.studies.institutions.map((inst) => (
            <Column key={inst.name} gap="4">
              <Text variant="heading-strong-m">{inst.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {inst.description}
              </Text>
            </Column>
          ))}
        </Column>
      )}
    </Column>
  );
}
