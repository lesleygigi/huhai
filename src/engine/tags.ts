export type StoryTag =
  | { type: "bg"; id: string }
  | { type: "show"; character: string; expression: string; position: string }
  | { type: "hide"; character: string }
  | { type: "music"; id: string }
  | { type: "sfx"; id: string }
  | { type: "unknown"; raw: string };

export function parseStoryTag(raw: string): StoryTag {
  const [name, value = ""] = raw.split(":").map((part) => part.trim());
  const args = value.split(/\s+/).filter(Boolean);

  switch (name) {
    case "bg":
      return { type: "bg", id: value };
    case "show":
      return {
        type: "show",
        character: args[0] ?? "",
        expression: args[1] ?? "",
        position: args[2] ?? "center",
      };
    case "hide":
      return { type: "hide", character: value };
    case "music":
      return { type: "music", id: value };
    case "sfx":
      return { type: "sfx", id: value };
    default:
      return { type: "unknown", raw };
  }
}
