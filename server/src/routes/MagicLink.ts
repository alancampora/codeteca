import express, { Request, Response } from "express";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import { MagicLink } from "../models/MagicLink";
import { User } from "../models/User";
import { sendMagicLinkEmail } from "../utils/email";
import jwt from "jsonwebtoken";

const router = express.Router();

// Request a magic link
router.post(
  "/request",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if user exists, if not create one
      let user = await User.findOne({ email });
      if (!user) {
        // Auto-create user with magic link
        const username = email.split("@")[0];
        user = await User.create({
          email,
          username,
          password: crypto.randomBytes(32).toString("hex"), // Random password (won't be used)
        });
      }

      // Generate secure random token
      const token = crypto.randomBytes(32).toString("hex");

      // Create magic link that expires in 15 minutes
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Save magic link to database
      await MagicLink.create({
        email,
        token,
        expiresAt,
        used: false,
      });

      // Generate the magic link URL
      const magicLinkUrl = `${process.env.FE_URI}/magic-link/verify?token=${token}`;

      // Send email with magic link
      await sendMagicLinkEmail(email, magicLinkUrl);

      res.status(200).json({
        message: "Magic link sent! Check your email.",
        dev: !process.env.EMAIL_HOST, // Indicate if in dev mode
      });
    } catch (error) {
      console.error("Error creating magic link:", error);
      res.status(500).json({ message: "Error creating magic link" });
    }
  }
);

// Verify magic link and log in
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Token is required" });
    }

    // Find the magic link
    const magicLink = await MagicLink.findOne({ token });

    if (!magicLink) {
      return res.status(404).json({ message: "Invalid or expired magic link" });
    }

    // Check if already used
    if (magicLink.used) {
      return res.status(400).json({ message: "Magic link already used" });
    }

    // Check if expired
    if (new Date() > magicLink.expiresAt) {
      return res.status(400).json({ message: "Magic link has expired" });
    }

    // Find the user
    const user = await User.findOne({ email: magicLink.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark magic link as used
    magicLink.used = true;
    await magicLink.save();

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const authToken = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error verifying magic link:", error);
    res.status(500).json({ message: "Error verifying magic link" });
  }
});

export default router;
