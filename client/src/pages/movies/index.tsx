import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies, MovieFilters } from "@/api/movies";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";

export default function MoviesPage() {
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    limit: 20,
    sortBy: "christmasRating",
    sortOrder: "desc",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", filters],
    queryFn: () => fetchMovies(filters),
  });

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilters({ ...filters, search: e.target.value, page: 1 });
  // };

  // const handleYearFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value ? parseInt(e.target.value) : undefined;
  //   setFilters({ ...filters, year: value, page: 1 });
  // };

  // const handleMinRatingFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value ? parseFloat(e.target.value) : undefined;
  //   setFilters({ ...filters, minRating: value, page: 1 });
  // };

  // const handleMinChristmasRatingFilter = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const value = e.target.value ? parseFloat(e.target.value) : undefined;
  //   setFilters({ ...filters, minChristmasRating: value, page: 1 });
  // };

  // const handleKidFriendlyToggle = () => {
  //   setFilters({
  //     ...filters,
  //     isKidFriendly: filters.isKidFriendly === true ? undefined : true,
  //     page: 1,
  //   });
  // };

  // const handleSortChange = (sortBy: MovieFilters["sortBy"]) => {
  //   const newOrder =
  //     filters.sortBy === sortBy && filters.sortOrder === "desc" ? "asc" : "desc";
  //   setFilters({ ...filters, sortBy, sortOrder: newOrder, page: 1 });
  // };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "christmasRating",
      sortOrder: "desc",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-white">
        {/* Header */}
        <div className="mb-8">
          <p className="text-center text-gray-600 text-lg">
            Descubre y reseña las mejores películas de Navidad
          </p>
        </div>

        {/* Filters 
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <Input
                type="text"
                placeholder="Buscar películas..."
                value={filters.search || ""}
                onChange={handleSearchChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Año</label>
              <Input
                type="number"
                placeholder="Ej: 2003"
                value={filters.year || ""}
                onChange={handleYearFilter}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rating mínimo
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="0.0 - 5.0"
                value={filters.minRating || ""}
                onChange={handleMinRatingFilter}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Navidómetro mínimo
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="0.0 - 5.0"
                value={filters.minChristmasRating || ""}
                onChange={handleMinChristmasRatingFilter}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant={filters.isKidFriendly ? "default" : "outline"}
              onClick={handleKidFriendlyToggle}
              size="sm"
            >
              👶 Aptas para chicos
            </Button>

            <div className="flex gap-2">
              <span className="text-sm text-gray-600 self-center">
                Ordenar por:
              </span>
              <Button
                variant={
                  filters.sortBy === "christmasRating" ? "default" : "outline"
                }
                onClick={() => handleSortChange("christmasRating")}
                size="sm"
              >
                Navidómetro{" "}
                {filters.sortBy === "christmasRating" &&
                  (filters.sortOrder === "desc" ? "↓" : "↑")}
              </Button>
              <Button
                variant={filters.sortBy === "rating" ? "default" : "outline"}
                onClick={() => handleSortChange("rating")}
                size="sm"
              >
                Rating{" "}
                {filters.sortBy === "rating" &&
                  (filters.sortOrder === "desc" ? "↓" : "↑")}
              </Button>
              <Button
                variant={filters.sortBy === "year" ? "default" : "outline"}
                onClick={() => handleSortChange("year")}
                size="sm"
              >
                Año{" "}
                {filters.sortBy === "year" &&
                  (filters.sortOrder === "desc" ? "↓" : "↑")}
              </Button>
            </div>

            <Button variant="ghost" onClick={clearFilters} size="sm">
              Limpiar filtros
            </Button>
          </div>
        </div>
*/}

          {/* Content */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
              Error al cargar las películas. Por favor, intenta de nuevo.
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) :
            data?.movies && data.movies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {data.movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page! - 1)}
                      disabled={filters.page === 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Página {data.pagination.page} de {data.pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page! + 1)}
                      disabled={filters.page === data.pagination.pages}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron películas con estos filtros.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Limpiar filtros
                </Button>
              </div>
            )}
        </div>
    </Layout>
  );
}
