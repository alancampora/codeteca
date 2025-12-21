import mongoose, { Schema } from "mongoose";
import { IMovie } from "@common/Movie";

const MovieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    posterUrl: { type: String, required: true },
    synopsis: { type: String, required: true },
    director: { type: String, required: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    christmasRating: { type: Number, default: 0, min: 0, max: 5 },
    isKidFriendly: { type: Boolean, default: true },
    reviewCount: { type: Number, default: 0 },
    christmasVotes: { type: Number, default: 0 },
    platforms: { type: [String], default: [] }, // Streaming platforms
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for search functionality
MovieSchema.index({ title: "text" });

export const Movie = mongoose.model<IMovie>("Movie", MovieSchema);
