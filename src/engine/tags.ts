export type PortraitPosition = "left" | "center" | "right";

export type StoryTag =
  | { type: "bg"; id: string }
  | {
      type: "show";
      character: string;
      expression: string;
      position: PortraitPosition;
    }
  | { type: "hide"; character: string }
  | { type: "music"; id: string }
  | { type: "sfx"; id: string }
  | { type: "fade"; color: string }
  | { type: "shake"; intensity: string }
  | { type: "unknown"; raw: string };

export function parseStoryTags(tags: string[]): StoryTag[] {
  return tags.map(parseStoryTag);
}

export function parseStoryTag(raw: string): StoryTag {
  const separator = raw.indexOf(":");
  const name = separator >= 0 ? raw.slice(0, separator).trim() : raw.trim();
  const value = separator >= 0 ? raw.slice(separator + 1).trim() : "";
  const args = value.split(/\s+/).filter(Boolean);

  switch (name) {
    case "bg":
      return { type: "bg", id: value };
    case "show":
      return {
        type: "show",
        character: args[0] ?? "",
        expression: args[1] ?? "neutral",
        position: toPortraitPosition(args[2]),
      };
    case "hide":
      return { type: "hide", character: value };
    case "music":
      return { type: "music", id: value };
    case "sfx":
      return { type: "sfx", id: value };
    case "fade":
      return { type: "fade", color: value || "black" };
    case "shake":
      return { type: "shake", intensity: value || "light" };
    default:
      return { type: "unknown", raw };
  }
}

function toPortraitPosition(value: string | undefined): PortraitPosition {
  if (value === "left" || value === "center" || value === "right") {
    return value;
  }

  return "center";
}
