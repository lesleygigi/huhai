type StatsPanelProps = {
  variables: Record<string, unknown>;
};

export function StatsPanel({ variables }: StatsPanelProps) {
  const stats = [
    { id: "fear", name: "恐惧", value: variables.fear ?? 0 },
    { id: "strategy", name: "权谋", value: variables.strategy ?? 0 },
    { id: "prestige", name: "威望", value: variables.prestige ?? 0 },
    { id: "cruelty", name: "残暴", value: variables.cruelty ?? 0 },
    { id: "clan_support", name: "宗室支持", value: variables.clan_support ?? 0 },
    { id: "zhao_gao_evidence", name: "赵高罪证", value: variables.zhao_gao_evidence ?? 0 },
  ];

  return (
    <section className="stats-panel" aria-label="个人属性">
      <div className="stats-list">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-item">
            <span className="stat-name">{stat.name}</span>
            <span className="stat-value">{String(stat.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
