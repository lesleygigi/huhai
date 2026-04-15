type BackgroundLayerProps = {
  image?: string;
};

export function BackgroundLayer({ image }: BackgroundLayerProps) {
  return (
    <div
      className="background-layer"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    />
  );
}
