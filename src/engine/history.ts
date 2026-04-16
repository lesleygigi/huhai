export type DialogueHistoryItem = {
  id: number;
  lines: string[];
  choice?: string;
};

export function createDialogueHistoryItem(
  id: number,
  lines: string[],
  choice?: string
): DialogueHistoryItem {
  return {
    id,
    lines,
    choice,
  };
}
