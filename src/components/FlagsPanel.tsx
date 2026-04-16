import { getFlagNames } from "../engine/debug";

type FlagsPanelProps = {
  flagsValue: unknown;
};

export function FlagsPanel({ flagsValue }: FlagsPanelProps) {
  const flags = getFlagNames(flagsValue);

  return (
    <section className="flags-panel" aria-label="已获标记">
      {flags.length > 0 ? (
        <ul className="flags-list">
          {flags.map((flag) => (
            <li key={flag} className="flag-item">
              【{flag}】
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-hint">尚未获得标记</p>
      )}
    </section>
  );
}
