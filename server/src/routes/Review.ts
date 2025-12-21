import express, { Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { Review } from "../models/Review";
import { Movie } from "../models/Movie";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Helper function to update movie ratings
async function updateMovieRatings(movieId: string): Promise<void> {
  const reviews = await Review.find({ movieId });

  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
      christmasRating: 0,
      reviewCount: 0,
      christmasVotes: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const totalChristmasRating = reviews.reduce(
    (sum, review) => sum + review.christmasRating,
    0
  );

  const averageRating = totalRating / reviews.length;
  const christmasRating = totalChristmasRating / reviews.length;

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    christmasRating: Math.round(christmasRating * 10) / 10,
    reviewCount: reviews.length,
    christmasVotes: reviews.length,
  });
}

// GET /api/reviews - List all reviews with pagination
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
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

      const [reviews, total] = await Promise.all([
        Review.find()
          .populate("userId", "username")
          .populate("movieId", "title")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments(),
      ]);

      res.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
  }
);

// GET /api/reviews/movie/:movieId - Get reviews for a specific movie
router.get(
  "/movie/:movieId",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
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

      const [reviews, total] = await Promise.all([
        Review.find({ movieId: req.params.movieId })
          .populate("userId", "username")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments({ movieId: req.params.movieId }),
      ]);

      res.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Error fetching movie reviews:", error);
      res.status(500).json({ message: "Error fetching movie reviews", error: error.message });
    }
  }
);

// GET /api/reviews/user/:userId - Get reviews by a specific user
router.get(
  "/user/:userId",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
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

      const [reviews, total] = await Promise.all([
        Review.find({ userId: req.params.userId })
          .populate("movieId", "title posterUrl")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments({ userId: req.params.userId }),
      ]);

      res.json({
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Error fetching user reviews", error: error.message });
    }
  }
);

// GET /api/reviews/:id - Get a specific review
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "username")
      .populate("movieId", "title");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error: any) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
});

// POST /api/reviews - Create a new review (requires authentication)
router.post(
  "/",
  authenticateToken,
  [
    body("movieId").notEmpty().isMongoId(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("christmasRating").isInt({ min: 1, max: 5 }),
    body("comment").trim().isLength({ min: 10, max: 1000 }),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.id;

      // Check if movie exists
      const movie = await Movie.findById(req.body.movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Check if user already reviewed this movie
      const existingReview = await Review.findOne({
        movieId: req.body.movieId,
        userId,
      });

      if (existingReview) {
        return res.status(409).json({
          message: "You have already reviewed this movie. Use PUT to update your review.",
          reviewId: existingReview._id,
        });
      }

      // Create new review
      const newReview = new Review({
        movieId: req.body.movieId,
        userId,
        rating: req.body.rating,
        christmasRating: req.body.christmasRating,
        comment: req.body.comment,
      });

      await newReview.save();

      // Update movie ratings
      await updateMovieRatings(req.body.movieId);

      // Populate user info before returning
      await newReview.populate("userId", "username");

      res.status(201).json(newReview);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Error creating review", error: error.message });
    }
  }
);

// PUT /api/reviews/:id - Update a review (requires authentication + ownership)
router.put(
  "/:id",
  authenticateToken,
  [
    body("rating").optional().isInt({ min: 1, max: 5 }),
    body("christmasRating").optional().isInt({ min: 1, max: 5 }),
    body("comment").optional().trim().isLength({ min: 10, max: 1000 }),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.id;
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check ownership
      if (review.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only edit your own reviews" });
      }

      // Update review
      if (req.body.rating !== undefined) review.rating = req.body.rating;
      if (req.body.christmasRating !== undefined)
        review.christmasRating = req.body.christmasRating;
      if (req.body.comment !== undefined) review.comment = req.body.comment;

      await review.save();

      // Update movie ratings
      await updateMovieRatings(review.movieId.toString());

      await review.populate("userId", "username");

      res.json(review);
    } catch (error: any) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Error updating review", error: error.message });
    }
  }
);

// DELETE /api/reviews/:id - Delete a review (requires authentication + ownership)
router.delete("/:id", authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    const movieId = review.movieId.toString();
    await Review.findByIdAndDelete(req.params.id);

    // Update movie ratings
    await updateMovieRatings(movieId);

    res.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
});

export default router;
