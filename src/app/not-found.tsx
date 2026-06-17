import { Column, Heading, Text, Button, Row } from "@once-ui-system/core";

export default function NotFound() {
  return (
    <Column as="section" fill center gap="l" paddingBottom="160">
      <Text
        variant="display-strong-xl"
        style={{ fontSize: "8rem", lineHeight: 1, opacity: 0.12 }}
      >
        404
      </Text>
      <Column horizontal="center" gap="s" style={{ marginTop: "-2rem" }}>
        <Heading variant="display-strong-s">
          Page not found
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" align="center">
          This page doesn&apos;t exist or was moved.
        </Text>
      </Column>
      <Row gap="12">
        <Button href="/" variant="secondary" size="m" prefixIcon="home">
          Back home
        </Button>
        <Button href="/work" variant="tertiary" size="m">
          See my work
        </Button>
      </Row>
    </Column>
  );
}
