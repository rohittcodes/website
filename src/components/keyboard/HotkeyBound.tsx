"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { HotkeyTarget } from "./HotkeyBadge";

function activateHref(href: string, router: ReturnType<typeof useRouter>) {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    window.location.href = href;
    return;
  }
  if (/^https?:\/\//i.test(href)) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  router.push(href);
}

export function HotkeyBound({
  href,
  enabled = true,
  children,
  className,
  fill,
  block,
}: {
  href: string;
  enabled?: boolean;
  children: React.ReactNode;
  className?: string;
  fill?: boolean;
  block?: boolean;
}) {
  const router = useRouter();
  const onActivate = useCallback(() => {
    activateHref(href, router);
  }, [href, router]);

  return (
    <HotkeyTarget
      onActivate={onActivate}
      enabled={enabled}
      className={className}
      fill={fill}
      block={block}
    >
      {children}
    </HotkeyTarget>
  );
}
