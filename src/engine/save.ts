import type { ChoiceHistoryItem } from "./debug";
import type { DialogueHistoryItem } from "./history";

const SAVE_KEY_PREFIX = "huhai-save-slot-";
export const TOTAL_SLOTS = 6;

export type SaveData = {
  version: 1;
  savedAt: string;
  chapterName: string;
  sceneName: string;
  inkStateJson: string;
  history: ChoiceHistoryItem[];
  dialogueHistory: DialogueHistoryItem[];
};

export type SlotInfo = {
  id: number;
  data: SaveData | null;
};

export function createSaveData(
  inkStateJson: string,
  chapterName: string,
  sceneName: string,
  history: ChoiceHistoryItem[],
  dialogueHistory: DialogueHistoryItem[] = []
): SaveData {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    chapterName,
    sceneName,
    inkStateJson,
    history,
    dialogueHistory,
  };
}

export function writeSave(slotId: number, data: SaveData): void {
  localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(data));
}

export function readSave(slotId: number): SaveData | null {
  const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
  return raw ? parseSaveData(raw) : null;
}

export function clearSave(slotId: number): void {
  localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotId}`);
}

export function getAllSlots(): SlotInfo[] {
  const slots: SlotInfo[] = [];
  for (let i = 1; i <= TOTAL_SLOTS; i++) {
    slots.push({
      id: i,
      data: readSave(i),
    });
  }
  return slots;
}

export function parseSaveData(raw: string): SaveData {
  const parsed = JSON.parse(raw) as Partial<SaveData>;

  if (parsed.version !== 1) {
    throw new Error("存档版本不受支持。");
  }

  if (typeof parsed.savedAt !== "string") {
    throw new Error("存档缺少保存时间。");
  }

  if (typeof parsed.inkStateJson !== "string") {
    throw new Error("存档缺少 Ink 状态。");
  }

  if (!Array.isArray(parsed.history)) {
    throw new Error("存档缺少选择历史。");
  }

  return {
    version: 1,
    savedAt: parsed.savedAt,
    chapterName: parsed.chapterName ?? "未知章节",
    sceneName: parsed.sceneName ?? "未知场景",
    inkStateJson: parsed.inkStateJson,
    history: parsed.history,
    dialogueHistory: Array.isArray(parsed.dialogueHistory)
      ? parsed.dialogueHistory
      : [],
  };
}
