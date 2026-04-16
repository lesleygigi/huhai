import { type SlotInfo } from "../engine/save";

type SavePanelProps = {
  slots: SlotInfo[];
  statusMessage: string;
  onSave: (slotId: number) => void;
};

export function SavePanel({
  slots,
  statusMessage,
  onSave,
}: SavePanelProps) {
  return (
    <section className="save-panel" aria-label="保存档案">
      {statusMessage ? <p className="save-status">{statusMessage}</p> : null}
      
      <div className="slot-list">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            className="slot-item"
            onClick={() => onSave(slot.id)}
          >
            <span className="slot-number">槽位 {slot.id}</span>
            <span className="slot-name">
              {slot.data 
                ? `${slot.data.chapterName} ${slot.data.sceneName}`
                : "--- 空白存档 ---"}
            </span>
            {slot.data && (
              <span className="slot-info">
                {new Date(slot.data.savedAt).toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
