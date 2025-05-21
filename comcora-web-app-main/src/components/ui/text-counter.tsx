interface TextCounterProps {
  maxLength: number;
  symbolsCount: number;
}

export function TextCounter(props: TextCounterProps) {
  const { maxLength, symbolsCount } = props;

  return (
    <div className="flex justify-between px-4 pt-2">
      <span className="grow text-12-medium text-typography-secondary">
        Символов {symbolsCount}/{maxLength}
      </span>
    </div>
  );
}
