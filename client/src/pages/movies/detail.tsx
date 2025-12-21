import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "@/api/movies";
import { fetchMovieReviews } from "@/api/reviews";
import { RatingStars } from "@/components/rating/RatingStars";
import { ChristmasRating } from "@/components/rating/ChristmasRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
  });

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", "movie", id],
    queryFn: () => fetchMovieReviews(id!, 1, 10),
    enabled: !!id,
  });

  const handleAddReview = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/movies/${id}/review`);
    }
  };

  if (movieLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
        </div>
      </Layout>
    );
  }

  if (movieError || !movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error al cargar la película.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/movies" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a películas
        </Link>

        {/* Movie Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <p className="text-xl text-gray-600">{movie.year}</p>
              </div>
              {movie.isKidFriendly && (
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  👶 Mantiene la magia
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-semibold">
                Director: <span className="font-normal">{movie.director}</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold w-32">Calidad:</span>
                <RatingStars rating={movie.averageRating} size={24} />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold w-32">Navidómetro:</span>
                <ChristmasRating rating={movie.christmasRating} size={28} />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold w-32">Reviews:</span>
                <span className="text-gray-600">{movie.reviewCount}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Sinopsis</h3>
              <p className="text-gray-700 leading-relaxed">{movie.synopsis}</p>
            </div>

            {movie.platforms && movie.platforms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Disponible en:</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleAddReview} size="lg" className="w-full md:w-auto">
              {user ? "Agregar Review" : "Iniciar sesión para agregar review"}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">
            Reviews ({movie.reviewCount})
          </h2>

          {reviewsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              Error al cargar las reviews.
            </div>
          ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.reviews.map((review) => (
                <Card key={review._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {review.user?.username || "Usuario"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt!).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} size={16} />
                        </div>
                        <div className="flex items-center gap-2">
                          <ChristmasRating
                            rating={review.christmasRating}
                            size={18}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">
                  Aún no hay reviews para esta película. ¡Sé el primero en
                  agregar una!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
