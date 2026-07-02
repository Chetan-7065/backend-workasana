import { z } from "zod";
import mongoose from "mongoose";
import User from "../models/User.models.js";

const createUserZodSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[`^a-zA-Z0-9`]/, "Password must contain at least one special character."),
  })
  .refine(
    async (data) => {
      const duplicate = await User.findOne({
        $or: [
          { name: { $regex: `^${data.name}$`, $options: "i" } },
          { email: { $regex: `^${data.email}$`, $options: "i" } },
        ],
      });
      return !duplicate;
    },
    {
      message: "Username or Email is already taken.",
      path: ["email"],
    },
  );

  export default createUserZodSchema