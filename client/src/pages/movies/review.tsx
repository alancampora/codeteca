import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMovie } from "@/api/movies";
import { createReview, updateReview, fetchMovieReviews } from "@/api/reviews";
import { RatingStars } from "@/components/rating/RatingStars";
import { ChristmasRating } from "@/components/rating/ChristmasRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth";

export default function ReviewFormPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [christmasRating, setChristmasRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);

  const { data: movie } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", "movie", id],
    queryFn: () => fetchMovieReviews(id!, 1, 100),
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (reviewsData?.reviews && user) {
      const userReview = reviewsData.reviews.find(
        (review) => review.userId === user.id
      );
      if (userReview) {
        setExistingReviewId(userReview._id!);
        setRating(userReview.rating);
        setChristmasRating(userReview.christmasRating);
        setComment(userReview.comment);
      }
    }
  }, [reviewsData, user]);

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "movie", id] });
      navigate(`/movies/${id}`);
    },
    onError: (error: any) => {
      setError(error.message || "Error al crear la review");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) =>
      updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "movie", id] });
      navigate(`/movies/${id}`);
    },
    onError: (error: any) => {
      setError(error.message || "Error al actualizar la review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (comment.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("El comentario no puede superar los 1000 caracteres");
      return;
    }

    const reviewData = {
      rating,
      christmasRating,
      comment: comment.trim(),
    };

    if (existingReviewId) {
      updateMutation.mutate({ reviewId: existingReviewId, data: reviewData });
    } else {
      createMutation.mutate({
        movieId: id!,
        ...reviewData,
      });
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Película no encontrada.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          to={`/movies/${id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Volver a la película
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">
              {existingReviewId ? "Editar Review" : "Agregar Review"}
            </h1>
            <p className="text-gray-600 mt-2">
              {movie.title} ({movie.year})
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-3">
                  Rating de Calidad (1-5 estrellas)
                </label>
                <RatingStars
                  rating={rating}
                  size={32}
                  interactive={true}
                  onChange={setRating}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Rating seleccionado: {rating}/5
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Navidómetro (1-5 árboles)
                </label>
                <ChristmasRating
                  rating={christmasRating}
                  size={32}
                  interactive={true}
                  onChange={setChristmasRating}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Navidómetro seleccionado: {christmasRating}/5
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Comentario (10-1000 caracteres)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe tu opinión sobre la película..."
                  rows={6}
                  maxLength={1000}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {comment.length}/1000 caracteres
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Guardando..."
                    : existingReviewId
                      ? "Actualizar Review"
                      : "Publicar Review"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/movies/${id}`)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
