"use client";

import { Button } from "@once-ui-system/core";

export function PrintButton() {
  return (
    <Button variant="tertiary" size="s" prefixIcon="document" onClick={() => window.print()}>
      Print
    </Button>
  );
}
