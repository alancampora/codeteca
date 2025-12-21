export interface IReview {
  _id?: any;
  movieId: string;
  userId: string;
  rating: number; // Rating de calidad general (1-5)
  christmasRating: number; // 🎄 Voto del navidómetro (1-5)
  comment: string; // Entre 10 y 1000 caracteres
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    username: string;
  };
  movie?: {
    title: string;
  };
}
