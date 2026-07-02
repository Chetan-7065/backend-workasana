import { z } from "zod";
import mongoose from "mongoose";
import Project from "../models/project.models.js";

 const createProjectZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .refine(
      async (data) => {
        const duplicate = await Project.findOne({
          name: { $regex: `^${data.name}$`, $options: "i" },
        });
        return !duplicate;
      },
      {
        message:
          "This project name is already taken. Please choose another one.",
        path: ["name"],
      },
    ),
  description: z.string().trim().optional().or(z.literal("")),
});

export default createProjectZodSchema