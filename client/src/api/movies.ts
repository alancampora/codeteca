import { IMovie } from "@common/Movie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface MovieFilters {
  page?: number;
  limit?: number;
  year?: number;
  minRating?: number;
  minChristmasRating?: number;
  isKidFriendly?: boolean;
  search?: string;
  sortBy?: "rating" | "christmasRating" | "year" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface MoviesResponse {
  movies: IMovie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fetchMovies = async (filters: MovieFilters = {}): Promise<MoviesResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_URL}/movies?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
};

export const fetchMovie = async (id: string): Promise<IMovie> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
};

export const createMovie = async (movieData: Partial<IMovie>): Promise<IMovie> => {
  const response = await fetch(`${API_URL}/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create movie");
  }

  return response.json();
};

export const updateMovie = async (
  id: string,
  movieData: Partial<IMovie>
): Promise<IMovie> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update movie");
  }

  return response.json();
};

export const deleteMovie = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete movie");
  }
};
