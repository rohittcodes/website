"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./ZoomLightbox.module.scss";

const FIT_SCALE = 1;
const ZOOM_SCALE = 2.2;
const CLICK_THRESHOLD = 6;

interface ZoomLightboxProps {
  open: boolean;
  onClose: () => void;
  label: string;
  width?: number;
  children: ReactNode;
}

export function ZoomLightbox({ open, onClose, label, width, children }: ZoomLightboxProps) {
  const [scale, setScale] = useState(FIT_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const pointerRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setScale(FIT_SCALE);
      setOffset({ x: 0, y: 0 });
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const toggleZoom = () => {
    setScale((current) => (current === FIT_SCALE ? ZOOM_SCALE : FIT_SCALE));
    setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer) return;

    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.moved && Math.hypot(dx, dy) < CLICK_THRESHOLD) return;

    pointer.moved = true;
    if (scale === FIT_SCALE) return;

    setDragging(true);
    setOffset({
      x: pointer.offsetX + dx,
      y: pointer.offsetY + dy,
    });
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    pointerRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (pointer && !pointer.moved) {
      toggleZoom();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <div
        className={styles.card}
        data-zoomed={scale > FIT_SCALE}
        data-dragging={dragging}
        style={{
          ...(width ? { ["--diagram-width" as string]: `${width}px` } : {}),
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
        }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
