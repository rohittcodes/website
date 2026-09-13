import { createElement } from "react";
import { IconType } from "react-icons";

import {
  HiArrowUpRight,
  HiOutlineLink,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiArrowRight,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiChevronDown,
  HiArrowTurnDownLeft,
  HiMagnifyingGlass,
  HiPaperAirplane,
  HiXMark,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineDocument,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
  PiToolboxDuotone,
} from "react-icons/pi";

import {
  SiJavascript,
  SiNextdotjs,
  SiFigma,
  SiSupabase,
  SiTypescript,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiPostgresql,
  SiDocker,
} from "react-icons/si";

import { FaDiscord, FaGithub, FaLinkedin, FaX, FaThreads, FaInstagram, FaXTwitter, FaFacebook, FaPinterest, FaWhatsapp, FaReddit, FaTelegram, } from "react-icons/fa6";

const ContraIcon: IconType = ({ size = "1em", color = "currentColor", ...props }) =>
  createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: color,
      "aria-hidden": true,
      ...props,
    },
    createElement("path", {
      fillRule: "evenodd",
      d: "M8.533 4.125C7.376 5.889 5.862 7.397 4.09 8.548A20.4 20.4 0 0 1 0 10.603V11.007h11V.006h-.387A20.4 20.4 0 0 1 8.533 4.125Zm4.464-4.12V11.05h11v-.403a20.4 20.4 0 0 0-4.085-2.055c-1.77-1.151-3.286-2.66-4.442-4.423A20.4 20.4 0 0 0 13.37.006h-.372ZM24 12.946H13v11.049h.372a20.4 20.4 0 0 0 2.098-4.167c1.156-1.764 2.672-3.272 4.442-4.423A20.4 20.4 0 0 0 24 13.35v-.403ZM11 23.995V12.993H0v.404a20.4 20.4 0 0 0 4.086 2.055c1.771 1.151 3.285 2.66 4.442 4.423a20.4 20.4 0 0 0 2.081 4.119H11Z",
    }),
  );

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  chevronLeft: HiChevronLeft,
  chevronRight: HiChevronRight,
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  arrowTurnDownLeft: HiArrowTurnDownLeft,
  search: HiMagnifyingGlass,
  close: HiXMark,
  send: HiPaperAirplane,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  toolbox: PiToolboxDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  typescript: SiTypescript,
  nodejs: SiNodedotjs,
  openai: SiOpenai,
  python: SiPython,
  postgresql: SiPostgresql,
  docker: SiDocker,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  contra: ContraIcon,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
