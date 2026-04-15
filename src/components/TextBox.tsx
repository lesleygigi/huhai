type TextBoxProps = {
  lines: string[];
};

export function TextBox({ lines }: TextBoxProps) {
  return (
    <section className="text-box">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`}>{line}</p>
      ))}
    </section>
  );
}
