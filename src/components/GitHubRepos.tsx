import { Column, Grid, Row, Text, SmartLink } from "@once-ui-system/core";
import { HotkeyBound } from "./keyboard/HotkeyBound";
import type { Repo } from "@/lib/github";

export function GitHubRepos({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) return null;

  return (
    <Grid columns="3" m={{ columns: 2 }} s={{ columns: 1 }} gap="12" fillWidth>
      {repos.map((repo) => (
        <HotkeyBound key={repo.name} href={repo.url} block>
          <SmartLink
            href={repo.url}
            unstyled
            style={{ textDecoration: "none", display: "block", width: "100%", height: "100%", margin: 0 }}
          >
            <Column
              fillWidth
              fillHeight
              padding="m"
              gap="8"
              radius="m"
              border="neutral-alpha-weak"
              background="surface"
              style={{ transition: "border-color 0.15s" }}
            >
              <Text variant="label-strong-m" onBackground="neutral-strong">
                {repo.name}
              </Text>
              {repo.description && (
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ flex: 1 }}>
                  {repo.description}
                </Text>
              )}
              <Row gap="12" vertical="center" wrap>
                {repo.primaryLanguage && (
                  <Row gap="4" vertical="center">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: repo.primaryLanguage.color ?? "var(--neutral-alpha-medium)",
                        flexShrink: 0,
                      }}
                    />
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {repo.primaryLanguage.name}
                    </Text>
                  </Row>
                )}
                {repo.stargazerCount > 0 && (
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    ★ {repo.stargazerCount}
                  </Text>
                )}
              </Row>
            </Column>
          </SmartLink>
        </HotkeyBound>
      ))}
    </Grid>
  );
}
