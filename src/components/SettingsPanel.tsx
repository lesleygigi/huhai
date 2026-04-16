import type { GameSettings } from "../engine/settings";

type SettingsPanelProps = {
  open: boolean;
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onClose: () => void;
};

export function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
}: SettingsPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <section className="overlay-panel settings-panel" aria-label="设置">
      <header className="overlay-header">
        <h2>设置</h2>
        <button type="button" onClick={onClose}>
          关闭
        </button>
      </header>

      <label className="settings-field">
        <span>字号</span>
        <select
          value={settings.fontSize}
          onChange={(event) =>
            onChange({
              ...settings,
              fontSize: event.currentTarget.value as GameSettings["fontSize"],
            })
          }
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      </label>

      <label className="settings-field">
        <span>文本速度</span>
        <select
          value={settings.textSpeed}
          onChange={(event) =>
            onChange({
              ...settings,
              textSpeed: event.currentTarget.value as GameSettings["textSpeed"],
            })
          }
        >
          <option value="instant">立即</option>
          <option value="normal">正常</option>
          <option value="slow">慢</option>
        </select>
      </label>

      <label className="settings-field">
        <span>BGM 音量：{Math.round(settings.bgmVolume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.bgmVolume}
          onChange={(event) =>
            onChange({
              ...settings,
              bgmVolume: Number(event.currentTarget.value),
            })
          }
        />
      </label>

      <label className="settings-field">
        <span>SFX 音量：{Math.round(settings.sfxVolume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.sfxVolume}
          onChange={(event) =>
            onChange({
              ...settings,
              sfxVolume: Number(event.currentTarget.value),
            })
          }
        />
      </label>

      <label className="settings-check">
        <input
          type="checkbox"
          checked={settings.muted}
          onChange={(event) =>
            onChange({
              ...settings,
              muted: event.currentTarget.checked,
            })
          }
        />
        <span>静音</span>
      </label>
    </section>
  );
}
