import mongoose, { Schema } from "mongoose";
import { IReview } from "@common/Review";

const ReviewSchema: Schema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    christmasRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Ensure a user can only review a movie once
ReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
