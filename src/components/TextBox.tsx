type TextBoxProps = {
  line: string;
  speaker?: string;
  canAdvance: boolean;
  onAdvance: () => void;
};

export function TextBox({ line, speaker, canAdvance, onAdvance }: TextBoxProps) {
  // 处理行文本：如果有说话人，则移除文本中的“名字：”部分
  const text = speaker ? line.replace(/^[^：:]{1,12}[：:]\s*/, "") : line;

  return (
    <button
      className="text-box"
      type="button"
      onClick={onAdvance}
      disabled={!canAdvance}
    >
      {line ? (
        <>
          {speaker ? (
            <span className="speaker-name">{speaker}</span>
          ) : null}
          <span className="dialogue-line">{text}</span>
          {canAdvance ? <span className="advance-hint">点击继续</span> : null}
        </>
      ) : (
        <p className="muted-text">本段剧情已结束。</p>
      )}
    </button>
  );
}
