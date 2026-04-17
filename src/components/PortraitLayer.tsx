import type { PortraitPosition, PortraitState } from "../engine/presentation";

type PortraitLayerProps = {
  portraits: Record<PortraitPosition, PortraitState | null>;
  portraitPaths: Record<PortraitPosition, string | undefined>;
};

const positions: PortraitPosition[] = ["left", "center", "right"];

export function PortraitLayer({ portraits, portraitPaths }: PortraitLayerProps) {
  return (
    <div className="portrait-layer" aria-hidden="true">
      {positions.map((position) => {
        const portrait = portraits[position];
        if (!portrait) return null;

        const imagePath = portraitPaths[position];
        return (
          <div key={position} className={`portrait portrait-${position}`}>
            {imagePath ? (
              <img src={imagePath} alt="" />
            ) : (
              <div>
                <strong>{portrait.character}</strong>
                <span>{portrait.expression}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
