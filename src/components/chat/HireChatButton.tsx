import { contra } from "@/resources";
import { ContraHireButton } from "../ContraHire";
import { HotkeyBound } from "../keyboard/HotkeyBound";

export function HireChatButton() {
  return (
    <HotkeyBound href={`${contra.url}?utm_campaign=HireMeOnContra&utm_medium=${contra.analyticsUserId}`}>
      <ContraHireButton />
    </HotkeyBound>
  );
}
