import endingDefinitions from "../../data/endings.json";
import { getStatName } from "./debug";

type EndingType = "HE" | "BE" | "TE";

type EndingDefinition = {
  id: string;
  name: string;
  type: EndingType;
  route: string;
  conditions: {
    min?: Record<string, number>;
    max?: Record<string, number>;
    flags?: string[];
    forbiddenFlags?: string[];
  };
};

export type EndingMatch = {
  id: string;
  name: string;
  type: EndingType;
  route: string;
  matched: boolean;
  score: number;
  satisfied: string[];
  missing: string[];
  locked: string[];
};

export function getEndingMatches(
  variables: Record<string, unknown>,
  flags: string[]
): EndingMatch[] {
  return (endingDefinitions as unknown as EndingDefinition[])
    .map((ending, index) => ({
      ...evaluateEnding(ending, variables, flags),
      sortIndex: index,
    }))
    .sort((a, b) => {
      if (a.matched !== b.matched) {
        return a.matched ? -1 : 1;
      }

      if (a.locked.length !== b.locked.length) {
        return a.locked.length - b.locked.length;
      }

      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return a.sortIndex - b.sortIndex;
    })
    .map(({ sortIndex: _sortIndex, ...match }) => match);
}

function evaluateEnding(
  ending: EndingDefinition,
  variables: Record<string, unknown>,
  flags: string[]
): EndingMatch {
  const satisfied: string[] = [];
  const missing: string[] = [];
  const locked: string[] = [];
  const activeFlags = new Set(flags);

  for (const [key, required] of Object.entries(ending.conditions.min ?? {})) {
    const current = getNumericValue(variables[key]);

    if (current >= required) {
      satisfied.push(`${getStatName(key)} >= ${required}`);
    } else {
      missing.push(`${getStatName(key)}还差 ${required - current}`);
    }
  }

  for (const [key, required] of Object.entries(ending.conditions.max ?? {})) {
    const current = getNumericValue(variables[key]);

    if (current <= required) {
      satisfied.push(`${getStatName(key)} <= ${required}`);
    } else {
      missing.push(`${getStatName(key)}超出 ${current - required}`);
    }
  }

  for (const flag of ending.conditions.flags ?? []) {
    if (activeFlags.has(flag)) {
      satisfied.push(`拥有【${flag}】`);
    } else {
      missing.push(`缺少【${flag}】`);
    }
  }

  for (const flag of ending.conditions.forbiddenFlags ?? []) {
    if (activeFlags.has(flag)) {
      locked.push(`存在【${flag}】`);
    } else {
      satisfied.push(`未获得【${flag}】`);
    }
  }

  return {
    id: ending.id,
    name: ending.name,
    type: ending.type,
    route: ending.route,
    matched: missing.length === 0 && locked.length === 0,
    score: satisfied.length,
    satisfied,
    missing,
    locked,
  };
}

function getNumericValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
