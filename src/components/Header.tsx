"use client";

import { usePathname } from "next/navigation";

import { Fade, Line, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, about, blog, work, uses } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade fillWidth position="fixed" height="80" zIndex={9} />
      <Row
        fitHeight
        className={styles.position}
        position="fixed"
        top="0"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >
        <Row
          fillWidth
          horizontal="center"
          vertical="center"
          gap="8"
          className={styles.navCluster}
        >
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="s"
            padding="4"
            horizontal="center"
            zIndex={1}
            className={styles.navPill}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && (
                <>
                  <Row m={{ hide: true }}>
                    <ToggleButton
                      className={styles.navButton}
                      prefixIcon="home"
                      href="/"
                      selected={pathname === "/"}
                    />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ToggleButton
                      className={styles.navButton}
                      size="l"
                      prefixIcon="home"
                      href="/"
                      selected={pathname === "/"}
                    />
                  </Row>
                </>
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="32" />
              {routes["/about"] && (
                <>
                  <Row m={{ hide: true }}>
                    <ToggleButton
                      className={styles.navButton}
                      prefixIcon="person"
                      href="/about"
                      label={about.label}
                      selected={pathname === "/about"}
                    />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ToggleButton
                      className={styles.navButton}
                      size="l"
                      prefixIcon="person"
                      href="/about"
                      selected={pathname === "/about"}
                    />
                  </Row>
                </>
              )}
              {routes["/work"] && (
                <>
                  <Row m={{ hide: true }}>
                    <ToggleButton
                      className={styles.navButton}
                      prefixIcon="grid"
                      href="/work"
                      label={work.label}
                      selected={pathname.startsWith("/work")}
                    />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ToggleButton
                      className={styles.navButton}
                      size="l"
                      prefixIcon="grid"
                      href="/work"
                      selected={pathname.startsWith("/work")}
                    />
                  </Row>
                </>
              )}
              {routes["/blog"] && (
                <>
                  <Row m={{ hide: true }}>
                    <ToggleButton
                      className={styles.navButton}
                      prefixIcon="book"
                      href="/blog"
                      label={blog.label}
                      selected={pathname.startsWith("/blog")}
                    />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ToggleButton
                      className={styles.navButton}
                      size="l"
                      prefixIcon="book"
                      href="/blog"
                      selected={pathname.startsWith("/blog")}
                    />
                  </Row>
                </>
              )}
              {routes["/uses"] && (
                <>
                  <Row m={{ hide: true }}>
                    <ToggleButton
                      className={styles.navButton}
                      prefixIcon="toolbox"
                      href="/uses"
                      label={uses.label}
                      selected={pathname.startsWith("/uses")}
                    />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ToggleButton
                      className={styles.navButton}
                      size="l"
                      prefixIcon="toolbox"
                      href="/uses"
                      selected={pathname.startsWith("/uses")}
                    />
                  </Row>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="32" />
                  <Row m={{ hide: true }}>
                    <ThemeToggle className={styles.navButton} />
                  </Row>
                  <Row hide m={{ hide: false }}>
                    <ThemeToggle className={styles.navButton} size="l" />
                  </Row>
                </>
              )}
            </Row>
          </Row>
        </Row>
      </Row>
    </>
  );
};
