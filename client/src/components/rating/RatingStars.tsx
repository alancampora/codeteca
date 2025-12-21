import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} relative`}
            aria-label={`${starValue} stars`}
          >
            {isPartial ? (
              <div className="relative">
                <Star
                  size={size}
                  className="text-gray-300"
                  fill="currentColor"
                />
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    size={size}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                size={size}
                className={isFilled ? "text-yellow-400" : "text-gray-300"}
                fill="currentColor"
              />
            )}
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
