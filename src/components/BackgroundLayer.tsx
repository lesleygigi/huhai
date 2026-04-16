type BackgroundLayerProps = {
  backgroundId?: string;
  imagePath?: string;
};

export function BackgroundLayer({ backgroundId, imagePath }: BackgroundLayerProps) {
  return (
    <div className="scene-bg">
      {imagePath ? (
        <div
          className="scene-bg-image"
          style={{ backgroundImage: `url(${imagePath})` }}
        />
      ) : null}
      {backgroundId ? <div className="scene-bg-label">{backgroundId}</div> : null}
    </div>
  );
}
