import {
  getFlagConflicts,
  getFlagNames,
  getStatName,
  stats,
  type ChoiceHistoryItem,
} from "../engine/debug";
import { getEndingMatches } from "../engine/endings";
import type { StorySnapshot } from "../engine/ink";

type DebugPanelProps = {
  routeName: string;
  snapshot: StorySnapshot;
  history: ChoiceHistoryItem[];
};

export function DebugPanel({ routeName, snapshot, history }: DebugPanelProps) {
  const flags = getFlagNames(snapshot.variables.flags);
  const conflicts = getFlagConflicts(flags);
  const endingMatches = getEndingMatches(snapshot.variables, flags).slice(0, 3);

  return (
    <aside className="debug-panel">
      <h2>调试</h2>

      <section className="debug-section">
        <h3>路线</h3>
        <p>{routeName}</p>
      </section>

      <section className="debug-section">
        <h3>变量</h3>
        <dl>
          {stats.map((stat) => (
            <div key={stat.id}>
              <dt>{getStatName(stat.id)}</dt>
              <dd>{String(snapshot.variables[stat.id] ?? stat.initial)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="debug-section">
        <h3>标记</h3>
        {flags.length === 0 ? (
          <p>无</p>
        ) : (
          <ul>
            {flags.map((flag) => (
              <li key={flag}>【{flag}】</li>
            ))}
          </ul>
        )}
      </section>

      <section className="debug-section">
        <h3>标记冲突</h3>
        {conflicts.length === 0 ? (
          <p>无冲突</p>
        ) : (
          <ul className="debug-conflicts">
            {conflicts.map((conflict) => (
              <li key={conflict.group}>
                {conflict.group}：{conflict.flags.join("、")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="debug-section">
        <h3>可能结局</h3>
        <ol className="ending-list">
          {endingMatches.map((ending) => (
            <li key={ending.id}>
              <strong>
                {ending.name}（{ending.type}｜{ending.route}）
              </strong>
              <p>已满足：{ending.satisfied.slice(0, 4).join("，") || "无"}</p>
              <p>未满足：{ending.missing.slice(0, 4).join("，") || "无"}</p>
              <p>锁死：{ending.locked.join("，") || "无"}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="debug-section">
        <h3>标签</h3>
        {snapshot.tags.length === 0 ? (
          <p>无</p>
        ) : (
          <ul>
            {snapshot.tags.map((tag, index) => (
              <li key={`${tag}-${index}`}>{tag}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="debug-section">
        <h3>选择历史</h3>
        {history.length === 0 ? (
          <p>尚未选择</p>
        ) : (
          <ol>
            {history.map((item) => (
              <li key={item.id}>
                {item.text} - {item.routeName}
                {item.flags.length > 0 ? ` - ${item.flags.join("、")}` : ""}
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
}
