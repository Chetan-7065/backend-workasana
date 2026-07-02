import { z } from "zod";
import mongoose from "mongoose";
import Team from "../models/team.models.js";

export const createTeamZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .refine(
      async (data) => {
        const duplicate = await Team.findOne({
          name: { $regex: `^${data.name}$`, $options: "i" },
        });
        return !duplicate;
      },
      {
        message:
          "This team name is already taken. Please choose another one.",
        path: ["name"],
      },
    ),
  description: z.string().trim().optional().or(z.literal("")),
});

export default createTeamZodSchema