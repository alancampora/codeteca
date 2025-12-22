import mongoose, { Schema } from "mongoose";
import { IMagicLink } from "@common/MagicLink";

const MagicLinkSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index to automatically delete expired links
MagicLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MagicLink = mongoose.model<IMagicLink>("MagicLink", MagicLinkSchema);
