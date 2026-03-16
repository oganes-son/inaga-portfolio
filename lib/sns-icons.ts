import { FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { SiNiconico, SiSpotify, SiApplemusic, SiAmazonmusic } from "react-icons/si";
import type { IconType } from "react-icons";

export type SnsIconKey = "soundcloud" | "youtube" | "niconico" | "spotify" | "appleMusic" | "amazonMusic";

export const SNS_ICONS: { key: SnsIconKey; Icon: IconType }[] = [
  { key: "soundcloud", Icon: FaSoundcloud },
  { key: "youtube",    Icon: FaYoutube    },
  { key: "niconico",   Icon: SiNiconico   },
  { key: "spotify",    Icon: SiSpotify    },
  { key: "appleMusic", Icon: SiApplemusic },
  { key: "amazonMusic",Icon: SiAmazonmusic},
];
