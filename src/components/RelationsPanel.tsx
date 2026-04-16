type RelationsPanelProps = {
  variables: Record<string, unknown>;
};

export function RelationsPanel({ variables }: RelationsPanelProps) {
  const relations = [
    { id: "zhao_gao", name: "赵高", value: variables.zhao_gao ?? 0 },
    { id: "meng_yi", name: "蒙毅", value: variables.meng_yi ?? 0 },
    { id: "ziying", name: "子婴", value: variables.ziying ?? 0 },
    { id: "zhang_han", name: "章邯", value: variables.zhang_han ?? 0 },
  ];

  return (
    <section className="relations-panel" aria-label="人物好感">
      <div className="stats-list">
        {relations.map((rel) => (
          <div key={rel.id} className="stat-item">
            <span className="stat-name">{rel.name}</span>
            <span className="stat-value">{String(rel.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
