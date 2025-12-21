import { IMovie } from "@common/Movie";
import { Card, CardContent } from "./ui/card";
import { RatingStars } from "./rating/RatingStars";
import { ChristmasRating } from "./rating/ChristmasRating";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: IMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movies/${movie._id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {movie.isKidFriendly && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              👶 Mantiene la magia
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{movie.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{movie.year}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Calidad:</span>
              <RatingStars rating={movie.averageRating} size={16} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Navidómetro:</span>
              <ChristmasRating rating={movie.christmasRating} size={18} />
            </div>
          </div>

          {movie.platforms && movie.platforms.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Disponible en:</p>
              <div className="flex flex-wrap gap-1">
                {movie.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {movie.reviewCount} {movie.reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
