import { IReview } from "@common/Review";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface ReviewsResponse {
  reviews: IReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateReviewData {
  movieId: string;
  rating: number;
  christmasRating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  christmasRating?: number;
  comment?: string;
}

export const fetchReviews = async (
  page: number = 1,
  limit: number = 20
): Promise<ReviewsResponse> => {
  const response = await fetch(`${API_URL}/reviews?page=${page}&limit=${limit}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

export const fetchMovieReviews = async (
  movieId: string,
  page: number = 1,
  limit: number = 20
): Promise<ReviewsResponse> => {
  const response = await fetch(
    `${API_URL}/reviews/movie/${movieId}?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie reviews");
  }

  return response.json();
};

export const fetchUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<ReviewsResponse> => {
  const response = await fetch(
    `${API_URL}/reviews/user/${userId}?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user reviews");
  }

  return response.json();
};

export const fetchReview = async (id: string): Promise<IReview> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch review");
  }

  return response.json();
};

export const createReview = async (reviewData: CreateReviewData): Promise<IReview> => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create review");
  }

  return response.json();
};

export const updateReview = async (
  id: string,
  reviewData: UpdateReviewData
): Promise<IReview> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update review");
  }

  return response.json();
};

export const deleteReview = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete review");
  }
};
