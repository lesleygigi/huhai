import { type SlotInfo } from "../engine/save";

type LoadPanelProps = {
  slots: SlotInfo[];
  statusMessage: string;
  onLoad: (slotId: number) => void;
  onClear: (slotId: number) => void;
};

export function LoadPanel({
  slots,
  statusMessage,
  onLoad,
  onClear,
}: LoadPanelProps) {
  return (
    <section className="save-panel" aria-label="读取档案">
      {statusMessage ? <p className="save-status">{statusMessage}</p> : null}

      <div className="slot-list">
        {slots.map((slot) => (
          <div key={slot.id} className="slot-row">
            <button
              type="button"
              className="slot-item"
              disabled={!slot.data}
              onClick={() => onLoad(slot.id)}
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
            {slot.data && (
              <button 
                type="button" 
                className="slot-delete"
                onClick={() => onClear(slot.id)}
                title="清除此存档"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
