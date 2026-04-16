import { useState } from "react";

type ShortcutScene = {
  name: string;
  path: string;
};

type ShortcutChapter = {
  name: string;
  scenes: ShortcutScene[];
};

type ShortcutsPanelProps = {
  onJump: (path: string) => void;
};

const SHORTCUT_DATA: ShortcutChapter[] = [
  {
    name: "序章：沙丘之夜",
    scenes: [
      { name: "序章开始", path: "prologue_start" },
      { name: "寝殿门口", path: "prologue_at_door" },
      { name: "偏殿密谈", path: "prologue_side_hall" },
      { name: "灵前祭父", path: "prologue_coffin" },
      { name: "沙丘启程", path: "prologue_departure" },
    ],
  },
  {
    name: "第一章：暂无",
    scenes: [
      { name: "第一章开始", path: "chapter1_start" },
    ],
  },
];

export function ShortcutsPanel({ onJump }: ShortcutsPanelProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set([SHORTCUT_DATA[0].name]));

  const toggleChapter = (name: string) => {
    const next = new Set(expandedChapters);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setExpandedChapters(next);
  };

  return (
    <section className="shortcuts-panel" aria-label="快捷通道">
      <div className="shortcuts-list">
        {SHORTCUT_DATA.map((chapter) => (
          <div key={chapter.name} className="chapter-group">
            <button
              type="button"
              className="chapter-header"
              onClick={() => toggleChapter(chapter.name)}
            >
              <span className="chapter-toggle-icon">
                {expandedChapters.has(chapter.name) ? "▼" : "▶"}
              </span>
              {chapter.name}
            </button>
            
            {expandedChapters.has(chapter.name) && (
              <div className="scene-list">
                {chapter.scenes.map((scene) => (
                  <button
                    key={scene.path}
                    type="button"
                    className="scene-item"
                    onClick={() => onJump(scene.path)}
                  >
                    {scene.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
