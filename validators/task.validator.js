import { z } from "zod";
import mongoose from "mongoose";

const createTaskZodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  project: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid Project ID"),
  team: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid Team ID"),
  owners: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val))),
  tags: z.array(z.string()).nonempty("At least one tag is required"),
  dueDate: z.coerce.date(),
  timeToComplete: z.number().min(1),
  status: z.enum(["To Do", "In Progress", "Completed", "Blocked"]), 
});

export default createTaskZodSchema