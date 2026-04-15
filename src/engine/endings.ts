export type EndingMatch = {
  id: string;
  name: string;
  matched: boolean;
  missing: string[];
};

export function getEndingMatches(): EndingMatch[] {
  return [];
}
