"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, uses } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import { MobileChatTrigger } from "./chat/MobileChatTrigger";
import { HotkeyTarget } from "./keyboard/HotkeyBadge";
import { hotkeyForPath } from "./keyboard/navShortcuts";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

function withHotkey(path: string, node: React.ReactNode) {
  const hotkey = hotkeyForPath(path);
  if (!hotkey) return node;
  return <HotkeyTarget label={hotkey}>{node}</HotkeyTarget>;
}

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
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
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
          s={{ hide: true }}
        >
          {display.location && <Row>{person.location}</Row>}
        </Row>
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
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
            className={styles.navPill}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && (
                <>
                  <Row s={{ hide: true }}>
                    {withHotkey(
                      "/",
                      <ToggleButton
                        className={styles.navButton}
                        prefixIcon="home"
                        href="/"
                        selected={pathname === "/"}
                      />,
                    )}
                  </Row>
                  <Row hide s={{ hide: false }}>
                    {withHotkey(
                      "/",
                      <ToggleButton
                        className={styles.navButton}
                        size="l"
                        prefixIcon="home"
                        href="/"
                        selected={pathname === "/"}
                      />,
                    )}
                  </Row>
                </>
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="32" />
              {routes["/about"] && (
                <>
                  <Row s={{ hide: true }}>
                    {withHotkey(
                      "/about",
                      <ToggleButton
                        className={styles.navButton}
                        prefixIcon="person"
                        href="/about"
                        label={about.label}
                        selected={pathname === "/about"}
                      />,
                    )}
                  </Row>
                  <Row hide s={{ hide: false }}>
                    {withHotkey(
                      "/about",
                      <ToggleButton
                        className={styles.navButton}
                        size="l"
                        prefixIcon="person"
                        href="/about"
                        selected={pathname === "/about"}
                      />,
                    )}
                  </Row>
                </>
              )}
              {routes["/work"] && (
                <>
                  <Row s={{ hide: true }}>
                    {withHotkey(
                      "/work",
                      <ToggleButton
                        className={styles.navButton}
                        prefixIcon="grid"
                        href="/work"
                        label={work.label}
                        selected={pathname.startsWith("/work")}
                      />,
                    )}
                  </Row>
                  <Row hide s={{ hide: false }}>
                    {withHotkey(
                      "/work",
                      <ToggleButton
                        className={styles.navButton}
                        size="l"
                        prefixIcon="grid"
                        href="/work"
                        selected={pathname.startsWith("/work")}
                      />,
                    )}
                  </Row>
                </>
              )}
              {routes["/blog"] && (
                <>
                  <Row s={{ hide: true }}>
                    {withHotkey(
                      "/blog",
                      <ToggleButton
                        className={styles.navButton}
                        prefixIcon="book"
                        href="/blog"
                        label={blog.label}
                        selected={pathname.startsWith("/blog")}
                      />,
                    )}
                  </Row>
                  <Row hide s={{ hide: false }}>
                    {withHotkey(
                      "/blog",
                      <ToggleButton
                        className={styles.navButton}
                        size="l"
                        prefixIcon="book"
                        href="/blog"
                        selected={pathname.startsWith("/blog")}
                      />,
                    )}
                  </Row>
                </>
              )}
              {routes["/uses"] && (
                <>
                  <Row s={{ hide: true }}>
                    {withHotkey(
                      "/uses",
                      <ToggleButton
                        className={styles.navButton}
                        prefixIcon="toolbox"
                        href="/uses"
                        label={uses.label}
                        selected={pathname.startsWith("/uses")}
                      />,
                    )}
                  </Row>
                  <Row hide s={{ hide: false }}>
                    {withHotkey(
                      "/uses",
                      <ToggleButton
                        className={styles.navButton}
                        size="l"
                        prefixIcon="toolbox"
                        href="/uses"
                        selected={pathname.startsWith("/uses")}
                      />,
                    )}
                  </Row>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="32" />
                  <Row s={{ hide: true }}>
                    <ThemeToggle className={styles.navButton} />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ThemeToggle className={styles.navButton} size="l" />
                  </Row>
                </>
              )}
            </Row>
          </Row>
          <Row hide s={{ hide: false }} className={styles.chatSlot}>
            <MobileChatTrigger />
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center" s={{ hide: true }}>
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            {display.time && <TimeDisplay timeZone={person.location} />}
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
