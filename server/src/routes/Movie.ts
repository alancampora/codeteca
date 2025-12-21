import express, { Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { Movie } from "../models/Movie";
import { Review } from "../models/Review";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// GET /api/movies - List movies with filters, search, and pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("year").optional().isInt().toInt(),
    query("minRating").optional().isFloat({ min: 0, max: 5 }).toFloat(),
    query("minChristmasRating").optional().isFloat({ min: 0, max: 5 }).toFloat(),
    query("isKidFriendly").optional().isBoolean().toBoolean(),
    query("search").optional().isString().trim(),
    query("sortBy")
      .optional()
      .isIn([
        "rating",
        "christmasRating",
        "year",
        "createdAt",
        "title",
      ]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};

      if (req.query.year) {
        filter.year = Number(req.query.year);
      }

      if (req.query.minRating) {
        filter.averageRating = { $gte: Number(req.query.minRating) };
      }

      if (req.query.minChristmasRating) {
        filter.christmasRating = { $gte: Number(req.query.minChristmasRating) };
      }

      if (req.query.isKidFriendly !== undefined) {
        filter.isKidFriendly = req.query.isKidFriendly === "true";
      }

      if (req.query.search) {
        filter.$text = { $search: req.query.search as string };
      }

      // Build sort object
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      const sort: any = { [sortBy === "rating" ? "averageRating" : sortBy]: sortOrder };

      const [movies, total] = await Promise.all([
        Movie.find(filter).sort(sort).skip(skip).limit(limit),
        Movie.countDocuments(filter),
      ]);

      res.json({
        movies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Error fetching movies", error: error.message });
    }
  }
);

// GET /api/movies/:id - Get movie details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error: any) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie", error: error.message });
  }
});

// POST /api/movies - Create movie (optional - for admins)
router.post(
  "/",
  authenticateToken,
  [
    body("title").notEmpty().trim().isLength({ min: 1, max: 200 }),
    body("year").isInt({ min: 1900, max: new Date().getFullYear() + 5 }),
    body("posterUrl").isURL(),
    body("synopsis").notEmpty().trim().isLength({ min: 10, max: 2000 }),
    body("director").notEmpty().trim().isLength({ min: 1, max: 100 }),
    body("isKidFriendly").isBoolean(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newMovie = new Movie({
        title: req.body.title,
        year: req.body.year,
        posterUrl: req.body.posterUrl,
        synopsis: req.body.synopsis,
        director: req.body.director,
        isKidFriendly: req.body.isKidFriendly,
        averageRating: 0,
        christmasRating: 0,
        reviewCount: 0,
        christmasVotes: 0,
      });

      await newMovie.save();
      res.status(201).json(newMovie);
    } catch (error: any) {
      console.error("Error creating movie:", error);
      res.status(500).json({ message: "Error creating movie", error: error.message });
    }
  }
);

// PUT /api/movies/:id - Update movie (optional - for admins)
router.put(
  "/:id",
  authenticateToken,
  [
    body("title").optional().trim().isLength({ min: 1, max: 200 }),
    body("year").optional().isInt({ min: 1900, max: new Date().getFullYear() + 5 }),
    body("posterUrl").optional().isURL(),
    body("synopsis").optional().trim().isLength({ min: 10, max: 2000 }),
    body("director").optional().trim().isLength({ min: 1, max: 100 }),
    body("isKidFriendly").optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.json(movie);
    } catch (error: any) {
      console.error("Error updating movie:", error);
      res.status(500).json({ message: "Error updating movie", error: error.message });
    }
  }
);

// DELETE /api/movies/:id - Delete movie (optional - for admins)
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Also delete all reviews for this movie
    await Review.deleteMany({ movieId: req.params.id });

    res.json({ message: "Movie deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Error deleting movie", error: error.message });
  }
});

export default router;
