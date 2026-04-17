import { useState, useCallback, type WheelEvent } from "react";
import { shortcutEdges, shortcutNodes } from "../engine/shortcuts";

type ShortcutsPanelProps = {
  currentPath: string | undefined;
  onJump: (path: string) => void;
  onClose: () => void;
};

const nodeById = new Map(shortcutNodes.map((node) => [node.id, node]));
const outgoingCount: Record<string, number> = {};
for (const edge of shortcutEdges) {
  outgoingCount[edge.from] = (outgoingCount[edge.from] ?? 0) + 1;
}

const graphWidth = 19000;
const graphHeight = 7200;
const nodeWidth = 172;
const nodeHeight = 72;
const coordinateWidth = 1600;
const coordinateHeight = 360;

function toGraphPoint(node: { x: number; y: number }) {
  return {
    x: (node.x / coordinateWidth) * graphWidth,
    y: (node.y / coordinateHeight) * graphHeight,
  };
}

function getEdgePath(
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  const fromPoint = toGraphPoint(from);
  const toPoint = toGraphPoint(to);
  const goesRight = toPoint.x >= fromPoint.x;
  const startX = fromPoint.x + (goesRight ? nodeWidth / 2 : -nodeWidth / 2);
  const endX = toPoint.x - (goesRight ? nodeWidth / 2 : -nodeWidth / 2);

  const distance = endX - startX;
  const controlGap = Math.max(80, Math.abs(distance) * 0.32);
  const controlStartX = startX + (goesRight ? controlGap : -controlGap);
  const controlEndX = endX - (goesRight ? controlGap : -controlGap);

  return `M ${startX} ${fromPoint.y} C ${controlStartX} ${fromPoint.y}, ${controlEndX} ${toPoint.y}, ${endX} ${toPoint.y}`;
}

function getEdgeLabelPosition(
  edge: { from: string; to: string },
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  const fromPoint = toGraphPoint(from);
  const toPoint = toGraphPoint(to);
  const goesRight = toPoint.x >= fromPoint.x;
  const startX = fromPoint.x + (goesRight ? nodeWidth / 2 : -nodeWidth / 2);
  const endX = toPoint.x - (goesRight ? nodeWidth / 2 : -nodeWidth / 2);
  const isBranch = (outgoingCount[edge.from] ?? 0) > 1;
  const anchorRatio = isBranch ? 0.34 : 0.5;

  return {
    x: startX + (endX - startX) * anchorRatio,
    y: fromPoint.y + (toPoint.y - fromPoint.y) * anchorRatio,
  };
}

export function ShortcutsPanel({
  currentPath,
  onJump,
  onClose,
}: ShortcutsPanelProps) {
  const [zoom, setZoom] = useState(0.25); // 初始缩放比例小一些，以便看到更多内容

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.05, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.05, 0.05));
  const handleResetZoom = () => setZoom(0.25);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      // 不再 preventDefault，让用户可以正常缩放
      const delta = e.deltaY > 0 ? -0.02 : 0.02;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.05), 1.5));
    }
  }, []);

  return (
    <section className="shortcut-graph-overlay" aria-label="快捷通道">
      <header className="shortcut-graph-header">
        <div>
          <p className="eyebrow">快捷通道</p>
          <h2>场景分支图</h2>
        </div>
        <div className="shortcut-graph-controls">
          <div className="zoom-controls">
            <button type="button" onClick={handleZoomOut} title="缩小">－</button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={handleZoomIn} title="放大">＋</button>
            <button type="button" onClick={handleResetZoom} className="btn-secondary">重置</button>
          </div>
          <button type="button" onClick={onClose} className="btn-close">
            关闭
          </button>
        </div>
      </header>

      <div className="shortcut-graph-board" onWheel={handleWheel}>
        <svg
          className="shortcut-graph-svg"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          width={graphWidth * zoom}
          height={graphHeight * zoom}
          role="img"
          aria-label="场景分支图"
        >
          <g className="shortcut-graph-lines">
            <defs>
              <marker
                id="shortcut-arrow"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="7"
                refY="4"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L8,4 L0,8 Z" />
              </marker>
            </defs>
            {shortcutEdges.map((edge) => {
              const from = nodeById.get(edge.from);
              const to = nodeById.get(edge.to);

              if (!from || !to) {
                return null;
              }

              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={getEdgePath(from, to)}
                  markerEnd="url(#shortcut-arrow)"
                />
              );
            })}
          </g>

          <g className="shortcut-graph-edge-labels" aria-hidden="true">
            {shortcutEdges.map((edge) => {
              const from = nodeById.get(edge.from);
              const to = nodeById.get(edge.to);

              if (!from || !to || !edge.label) {
                return null;
              }

              const labelPosition = getEdgeLabelPosition(edge, from, to);

              return (
                <g
                  key={`${edge.from}-${edge.to}-label`}
                  className="shortcut-edge-label"
                  transform={`translate(${labelPosition.x} ${labelPosition.y})`}
                >
                  <rect x="-22" y="-15" width="44" height="30" rx="6" />
                  <text dominantBaseline="middle" textAnchor="middle">
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </g>

          <g className="shortcut-graph-nodes">
            {shortcutNodes.map((node) => {
              const point = toGraphPoint(node);
              const isCurrent = currentPath === node.path;
              const className = [
                "shortcut-svg-node",
                isCurrent ? "shortcut-node-current" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <g
                  key={node.id}
                  className={className}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${point.x} ${point.y})`}
                  onClick={() => onJump(node.path)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onJump(node.path);
                    }
                  }}
                >
                  <rect
                    x={-nodeWidth / 2}
                    y={-nodeHeight / 2}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="8"
                  />
                  <text className="shortcut-node-chapter" y="-12">
                    {node.chapter}
                  </text>
                  <text className="shortcut-node-label" y="14">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <footer className="shortcut-graph-legend">
        <span className="legend-current">当前节点</span>
        <span className="legend-authored">已创作节点</span>
        <span>横向拖动底部滑动栏浏览，点击节点跳转至对应场景或分支。</span>
      </footer>
    </section>
  );
}
