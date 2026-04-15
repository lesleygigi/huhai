type ChoiceListProps = {
  choices: string[];
  onChoose: (index: number) => void;
};

export function ChoiceList({ choices, onChoose }: ChoiceListProps) {
  return (
    <div className="choice-list">
      {choices.map((choice, index) => (
        <button key={choice} type="button" onClick={() => onChoose(index)}>
          {choice}
        </button>
      ))}
    </div>
  );
}
