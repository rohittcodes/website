import { Column, Row, Heading, Text, Tag, Line, Button } from "@once-ui-system/core";
import { baseURL, person, about, social } from "@/resources";
import { PrintButton } from "@/components/resume/PrintButton";
import { generateSeoMetadata } from "@/utils/seo";
import styles from "./resume.module.css";
import "./print.css";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: `Resume – ${person.name}`,
    description: `${person.role}. Here's the receipts: experience, education, and the skills behind it.`,
    baseURL,
    path: "/resume",
  });
}

export default function Resume() {
  return (
    <Column maxWidth="s" paddingY="24" paddingX="l" gap="xl">

      {/* Header */}
      <Column gap="8">
        <Row fillWidth horizontal="between" vertical="end" wrap gap="16">
          <Column gap="4">
            <Heading variant="display-strong-l">{person.name}</Heading>
            <Text variant="heading-default-m" onBackground="neutral-weak">{person.role}</Text>
          </Column>
          <Row gap="8" className={styles.printButton}>
            <PrintButton />
            <Button
              href="/rohith-singh-resume.pdf"
              variant="secondary"
              size="s"
              prefixIcon="arrowUpRight"
              download
            >
              Download PDF
            </Button>
          </Row>
        </Row>
        <Row gap="16" wrap paddingTop="4">
          {social.filter((s) => s.essential).map((s) => (
            <Text key={s.name} variant="body-default-s" onBackground="neutral-weak">
              <a href={s.link} style={{ color: "inherit" }}>{s.name === "Email" ? person.email : s.link.replace("https://", "")}</a>
            </Text>
          ))}
        </Row>
      </Column>

      <Line />

      {/* Summary */}
      <Column gap="8">
        <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">SUMMARY</Heading>
        <Text variant="body-default-m">
          {about.intro.description}
        </Text>
      </Column>

      <Line />

      {/* Experience */}
      {about.work.display && (
        <Column gap="l">
          <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">EXPERIENCE</Heading>
          {about.work.experiences.map((exp, i) => (
            <Column key={i} gap="8">
              <Row fillWidth horizontal="between" vertical="end">
                <Text variant="heading-strong-m">{exp.company}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">{exp.timeframe}</Text>
              </Row>
              <Text variant="body-default-s" onBackground="brand-weak" marginBottom="4">{exp.role}</Text>
              <Column as="ul" gap="4" paddingLeft="m">
                {exp.achievements.map((achievement, j) => (
                  <Text as="li" key={j} variant="body-default-s">{achievement}</Text>
                ))}
              </Column>
            </Column>
          ))}
        </Column>
      )}

      <Line />

      {/* Education */}
      {about.studies.display && (
        <Column gap="l">
          <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">EDUCATION</Heading>
          {about.studies.institutions.map((inst, i) => (
            <Column key={i} gap="4">
              <Text variant="heading-strong-m">{inst.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">{inst.description}</Text>
            </Column>
          ))}
        </Column>
      )}

      <Line />

      {/* Skills */}
      {about.technical.display && (
        <Column gap="l">
          <Heading as="h2" variant="label-strong-l" onBackground="neutral-weak">SKILLS</Heading>
          {about.technical.skills.map((skill, i) => (
            <Column key={i} gap="8">
              <Text variant="label-strong-m">{skill.title}</Text>
              {skill.tags && skill.tags.length > 0 && (
                <Row wrap gap="8">
                  {skill.tags.map((tag, j) => (
                    <Tag key={j} size="s">{tag.name}</Tag>
                  ))}
                </Row>
              )}
            </Column>
          ))}
        </Column>
      )}

    </Column>
  );
}
