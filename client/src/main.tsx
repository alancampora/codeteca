import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home/index.tsx";
import Login from "./pages/login/index.tsx";
import Singup from "./pages/singup/index.tsx";
import { AuthProvider } from "./context/auth.tsx";
import Landing from "./pages/landing/index.tsx";
import Profile from "./pages/profile/index.tsx";
import MoviesPage from "./pages/movies/index.tsx";
import MovieDetailPage from "./pages/movies/detail.tsx";
import ReviewFormPage from "./pages/movies/review.tsx";
import ProtectedRoute from "./components/protected-route.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MoviesPage />,
  },
  {
    path: "/movies",
    element: <MoviesPage />,
  },
  {
    path: "/movies/:id",
    element: <MovieDetailPage />,
  },
  {
    path: "/movies/:id/review",
    element: (
      <ProtectedRoute>
        <ReviewFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/landing",
    element: <Landing />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Singup />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
);
