interface ChristmasRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function ChristmasRating({
  rating,
  maxRating = 5,
  size = 24,
  interactive = false,
  onChange,
}: ChristmasRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }, (_, i) => {
        const treeValue = i + 1;
        const isFilled = treeValue <= rating;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(treeValue)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
            aria-label={`${treeValue} christmas trees`}
            style={{ fontSize: `${size}px` }}
          >
            <span
              className={`${isFilled ? "opacity-100" : "opacity-30"} ${isFilled ? "text-green-600" : "text-gray-400"}`}
            >
              🎄
            </span>
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
