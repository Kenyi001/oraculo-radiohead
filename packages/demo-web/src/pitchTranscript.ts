/**
 * Static English transcript for judges (pitch video audio is Spanish).
 * Sources: docs/captions.en.srt + docs/RONALD_PITCH.md English spoken.
 */

export type PitchTranscriptBeat = {
  id: string;
  label: string;
  text: string;
};

export const PITCH_TRANSCRIPT_HEADING = "English transcript";
export const PITCH_TRANSCRIPT_FOR = "For judges";
export const PITCH_TRANSCRIPT_NOTE =
  "Video is spoken in Spanish — read along here.";

export const PITCH_TRANSCRIPT_BEATS: PitchTranscriptBeat[] = [
  {
    id: "hook",
    label: "Hook",
    text: "Hi — Augusto, Casandra, Santa Cruz. AI agents invent prices and still call send tools. Casandra is a lie detector for agents that talk about money. Your USDT stays in your WDK wallet — we never custody. Casandra only opens or closes the door.",
  },
  {
    id: "wallet",
    label: "Wallet + claim",
    text: "Here's your wallet: five hundred USDT. Self-custody — not Casandra's. The agent claims ETH is eight thousand dollars, risk is low, and wants to send two hundred USDT now.",
  },
  {
    id: "false",
    label: "Verdict FALSE",
    text: "Casandra compares the claim to the live market — same API judges hit. Verdict: FALSE. Contradictions are sealed, timestamped, and hashed. Same engine as the MCP.",
  },
  {
    id: "blocked",
    label: "WDK gate",
    text: "Try to send USDT through the WDK gate… BLOCKED. Money stays. Dry-run with @tetherto/wdk — no live broadcast.",
  },
  {
    id: "vs-wwall",
    label: "Vs WWall",
    text: "WWall gates spend policy — limits and allowlists. We gate on claim truth. Complementary, not the same angle.",
  },
  {
    id: "close",
    label: "Tracks + close",
    text: "Receipt hash can be anchored on Ethereum Sepolia. Tracks: General plus WDK Track 1. Not financial advice. Repo and live demo in the description. Casandra: they can speak. They cannot seal a lie.",
  },
];
