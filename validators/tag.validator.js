import { z } from "zod";
import mongoose from "mongoose";
import Tag from "../models/tag.models.js";

const createTagZodSchema = z.object({
  tag: z
    .string()
    .trim()
    .min(1, "Tag is required")
    .refine(
      async (data) => {
        const duplicate = await Tag.findOne({
          tag: { $regex: `^${data.tag}$`, $options: "i" },
        });
        return !duplicate;
      },
      {
        message:
          "This tag is already define. Please choose create another one.",
        path: ["tag"],
      },
    ),
});

export default createTagZodSchema
