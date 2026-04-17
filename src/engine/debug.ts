import flagDefinitions from "../../data/flags.json";
import statDefinitions from "../../data/stats.json";

export type ChoiceHistoryItem = {
  id: number;
  text: string;
  routeName: string;
  flags: string[];
};

export type FlagConflict = {
  group: string;
  flags: string[];
};

export const stats = statDefinitions;

export function getStatName(id: string): string {
  return stats.find((stat) => stat.id === id)?.name ?? id;
}

export function getFlagNames(value: unknown): string[] {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((flag) => flag.trim())
    .filter(Boolean);
}

export function getRouteName(flags: string[]): string {
  const conflicts = getFlagConflicts(flags);

  if (conflicts.length > 0) {
    return "路线冲突";
  }

  if (flags.includes("大义灭亲")) {
    return "IF扶苏即位线";
  }

  if (flags.includes("知情不报")) {
    return "沉默线";
  }

  if (flags.includes("曾试图告发")) {
    return "告发线";
  }

  if (flags.includes("隐忍待发")) {
    return "隐忍线";
  }

  if (flags.includes("矫诏同谋")) {
    return "主线";
  }

  return "序章";
}

export function getFlagConflicts(flags: string[]): FlagConflict[] {
  const active = new Set(flags);
  const groups = new Map<string, string[]>();

  for (const flag of flagDefinitions) {
    if (!flag.exclusiveGroup || !active.has(flag.name)) {
      continue;
    }

    groups.set(flag.exclusiveGroup, [
      ...(groups.get(flag.exclusiveGroup) ?? []),
      flag.name,
    ]);
  }

  return [...groups.entries()]
    .filter(([, groupFlags]) => groupFlags.length > 1)
    .map(([group, groupFlags]) => ({ group, flags: groupFlags }));
}
