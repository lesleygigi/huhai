import { useState } from "react";
import { type StorySnapshot } from "../engine/ink";
import { type GameSettings } from "../engine/settings";
import { StatsPanel } from "./StatsPanel";
import { RelationsPanel } from "./RelationsPanel";
import { FlagsPanel } from "./FlagsPanel";
import { SavePanel } from "./SavePanel";
import { LoadPanel } from "./LoadPanel";
import { DebugPanel } from "./DebugPanel";
import { type ChoiceHistoryItem } from "../engine/debug";
import { type SlotInfo } from "../engine/save";

type MenuPage =
  | "main"
  | "save"
  | "load"
  | "stats"
  | "relations"
  | "flags"
  | "debug";

type GameMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onHistory: () => void;
  onSettings: () => void;
  snapshot: StorySnapshot;
  routeName: string;
  history: ChoiceHistoryItem[];
  settings: GameSettings;
  updateSettings: (settings: GameSettings) => void;
  // Slot-based Save/Load props
  slots: SlotInfo[];
  saveMessage: string;
  onSave: (slotId: number) => void;
  onLoad: (slotId: number) => void;
  onClear: (slotId: number) => void;
  onShortcuts: () => void;
  audioInfo: {
    music: string | undefined;
    sfx: string[];
  };
};

export function GameMenu({
  isOpen,
  onClose,
  onRestart,
  onHistory,
  onSettings,
  snapshot,
  routeName,
  history,
  settings,
  updateSettings,
  slots,
  saveMessage,
  onSave,
  onLoad,
  onClear,
  onShortcuts,
  audioInfo,
}: GameMenuProps) {
  const [currentPage, setCurrentPage] = useState<MenuPage>("main");

  if (!isOpen) return null;

  const renderContent = () => {
    switch (currentPage) {
      case "save":
        return (
          <SavePanel
            slots={slots}
            statusMessage={saveMessage}
            onSave={onSave}
          />
        );
      case "load":
        return (
          <LoadPanel
            slots={slots}
            statusMessage={saveMessage}
            onLoad={onLoad}
            onClear={onClear}
          />
        );
      case "stats":
        return <StatsPanel variables={snapshot.variables} />;
      case "relations":
        return <RelationsPanel variables={snapshot.variables} />;
      case "flags":
        return <FlagsPanel flagsValue={snapshot.variables.flags} />;
      case "debug":
        return (
          <DebugPanel
            routeName={routeName}
            snapshot={snapshot}
            history={history}
          />
        );
      case "main":
      default:
        return (
          <div className="menu-main-nav">
            <button type="button" onClick={onClose}>
              继续游戏
            </button>
            <button type="button" onClick={() => setCurrentPage("save")}>
              保存档案
            </button>
            <button type="button" onClick={() => setCurrentPage("load")}>
              读取档案
            </button>
            <button type="button" onClick={() => setCurrentPage("stats")}>
              个人属性
            </button>
            <button type="button" onClick={() => setCurrentPage("relations")}>
              人物好感
            </button>
            <button type="button" onClick={() => setCurrentPage("flags")}>
              已获标记
            </button>
            <button
              type="button"
              onClick={() => {
                onShortcuts();
                onClose();
                setCurrentPage("main");
              }}
            >
              快捷通道
            </button>
            <button type="button" onClick={onHistory}>
              历史回看
            </button>
            <button type="button" onClick={onSettings}>
              设置
            </button>
            <button type="button" onClick={onRestart}>
              重新开始
            </button>
            <button
              type="button"
              className="debug-toggle"
              onClick={() => setCurrentPage("debug")}
            >
              调试信息
            </button>
          </div>
        );
    }
  };

  return (
    <aside className="menu-panel" aria-label="菜单">
      <header className="menu-header">
        <div>
          <p className="eyebrow">
            {currentPage === "main" ? "胡亥模拟器" : "菜单"}
          </p>
          <h1>
            {currentPage === "main"
              ? "沙丘之夜"
              : currentPage === "save"
                ? "保存档案"
                : currentPage === "load"
                  ? "读取档案"
                  : currentPage === "stats"
                    ? "个人属性"
                    : currentPage === "relations"
                      ? "人物好感"
                      : currentPage === "flags"
                        ? "已获标记"
                        : "调试信息"}
          </h1>
        </div>
        {currentPage === "main" ? (
          <button type="button" onClick={onClose}>
            关闭
          </button>
        ) : (
          <button type="button" onClick={() => setCurrentPage("main")}>
            返回
          </button>
        )}
      </header>

      <div className="menu-content">{renderContent()}</div>

      {currentPage === "main" && (
        <section className="audio-status" aria-label="音频状态">
          <span>BGM：{audioInfo.music ?? "无"}</span>
          <span>SFX：{audioInfo.sfx.join("、") || "无"}</span>
          <span>BGM 音量：{Math.round(settings.bgmVolume * 100)}%</span>
          <span>SFX 音量：{Math.round(settings.sfxVolume * 100)}%</span>
          <button
            type="button"
            onClick={() =>
              updateSettings({ ...settings, muted: !settings.muted })
            }
          >
            {settings.muted ? "取消静音" : "静音"}
          </button>
        </section>
      )}
    </aside>
  );
}
