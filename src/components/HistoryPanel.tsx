import type { DialogueHistoryItem } from "../engine/history";

type HistoryPanelProps = {
  open: boolean;
  items: DialogueHistoryItem[];
  onClose: () => void;
};

export function HistoryPanel({ open, items, onClose }: HistoryPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <section className="overlay-panel history-panel" aria-label="对话历史">
      <header className="overlay-header">
        <h2>历史</h2>
        <button type="button" onClick={onClose}>
          关闭
        </button>
      </header>

      <div className="history-list">
        {items.length === 0 ? (
          <p className="muted-text">还没有可回看的文本。</p>
        ) : (
          items.map((item) => (
            <article className="history-item" key={item.id}>
              {item.choice ? <p className="history-choice">选择：{item.choice}</p> : null}
              {item.lines.map((line, index) => (
                <p key={`${item.id}-${index}`}>{line}</p>
              ))}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
