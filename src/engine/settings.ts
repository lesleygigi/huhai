export type GameSettings = {
  fontSize: "small" | "medium" | "large";
  textSpeed: "instant" | "normal" | "slow";
  bgmVolume: number;
  sfxVolume: number;
  muted: boolean;
};

const settingsKey = "huhai-settings";

export const defaultSettings: GameSettings = {
  fontSize: "medium",
  textSpeed: "instant",
  bgmVolume: 0.7,
  sfxVolume: 0.8,
  muted: true,
};

function isFontSize(value: unknown): value is GameSettings["fontSize"] {
  return value === "small" || value === "medium" || value === "large";
}

function isTextSpeed(value: unknown): value is GameSettings["textSpeed"] {
  return value === "instant" || value === "normal" || value === "slow";
}

function clampVolume(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(1, Math.max(0, value));
}

export function readSettings(): GameSettings {
  const raw = localStorage.getItem(settingsKey);

  if (!raw) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GameSettings>;

    return {
      fontSize: isFontSize(parsed.fontSize)
        ? parsed.fontSize
        : defaultSettings.fontSize,
      textSpeed: isTextSpeed(parsed.textSpeed)
        ? parsed.textSpeed
        : defaultSettings.textSpeed,
      bgmVolume: clampVolume(parsed.bgmVolume, defaultSettings.bgmVolume),
      sfxVolume: clampVolume(parsed.sfxVolume, defaultSettings.sfxVolume),
      muted:
        typeof parsed.muted === "boolean"
          ? parsed.muted
          : defaultSettings.muted,
    };
  } catch {
    return defaultSettings;
  }
}

export function writeSettings(settings: GameSettings): void {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}
