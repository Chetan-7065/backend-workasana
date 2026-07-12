import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initializeDatabase } from "./db/db.connect.js";
import Task from "./models/task.models.js";
import Project from "./models/project.models.js";
import Team from "./models/team.models.js";
import Tag from "./models/tag.models.js";
import User from "./models/user.models.js";
import authRoutes from "./routes/auth.js";
import createProjectZodSchema from "./validators/project.validator.js";
import createTaskZodSchema from "./validators/task.validator.js";
import createTagZodSchema from "./validators/tag.validator.js";
import createTeamZodSchema from "./validators/team.validator.js";
import createUserZodSchema from "./validators/user.validator.js";
const app = express();
// initializeDatabase();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      error: "Database Connection Failed",
      errorMessage: error.message,
    });
  }
});

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello , Express server");
});

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

{
  /* Project API */
}

async function createNewProject(projectData) {
  try {
    const newProject = new Project(projectData);
    const saveProject = await newProject.save();
    return saveProject;
  } catch (error) {
    throw error;
  }
}

app.post("/project", verifyToken, async (req, res) => {
  try {
    const validatedBody = await createProjectZodSchema.parseAsync(req.body);
    req.body = validatedBody;
    const savedProject = await createNewProject(req.body);
    if (savedProject) {
      return res.status(200).json(savedProject);
    }
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      });
    }
    return res.status(500).json({
      error: "Failed to add new project.",
      errorMessage: error.message,
    });
  }
});

async function readAllProjects() {
  try {
    const allProjects = await Project.find();
    return allProjects;
  } catch (error) {
    throw error;
  }
}

app.get("/project", verifyToken, async (req, res) => {
  try {
    const allProjects = await readAllProjects();
    if (allProjects.length != 0) {
      return res.json(allProjects);
    } else {
      return res.status(404).json({ error: "Projects not found." });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to get projects details.",
      errorMessage: error.message,
    });
  }
});

{
  /* Team API */
}

async function createNewTeam(teamData) {
  try {
    const newTeam = new Team(teamData);
    const saveTeam = await newTeam.save();
    return saveTeam;
  } catch (error) {
    throw error;
  }
}

app.post("/team", verifyToken, async (req, res) => {
  try {
    const validatedBody = await createTeamZodSchema.parseAsync(req.body);
    req.body = validatedBody
    const savedTeam = await createNewTeam(req.body);
    if (savedTeam) {
      res.status(200).json(savedTeam);
    }
  } catch (error) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to add new team.", errorMessage: error.message });
  }
});

async function readAllTeams() {
  try {
    const allTeams = await Team.find();
    return allTeams;
  } catch (error) {
    throw error;
  }
}

app.get("/team", verifyToken, async (req, res) => {
  try {
    const allTeams = await readAllTeams();
    if (allTeams.length != 0) {
      res.json(allTeams);
    } else {
      res.status(404).json({ error: "Teams not found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to get teams details.",
      errorMessage: error.message,
    });
  }
});

{
  /* Tag API */
}

async function createNewTag(tagData) {
  try {
    const newTag = new Tag(tagData);
    const saveTag = await newTag.save();
    return saveTag;
  } catch (error) {
    throw error;
  }
}

app.post("/tag", verifyToken, async (req, res) => {
  try {
    const validatedBody = await createTagZodSchema.parseAsync(req.body);
    req.body = validatedBody;
    const savedTag = await createNewTag(req.body);
    if (savedTag) {
      res.status(200).json(savedTag);
    }
  } catch (error) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to add new tag.", errorMessage: error.message });
  }
});

async function readAllTag() {
  try {
    const allTags = await Tag.find();
    return allTags;
  } catch (error) {
    throw error;
  }
}

app.get("/tag", verifyToken, async (req, res) => {
  try {
    const allTags = await readAllTag();
    if (allTags.length != 0) {
      res.json(allTags);
    } else {
      res.status(404).json({ error: "Tags not found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to get tag details.",
      errorMessage: error.message,
    });
  }
});

{
  /* Task API */
}

async function createNewTask(taskData) {
  try {
    const newTask = new Task(taskData);
    const saveTask = await newTask.save();
    return saveTask;
  } catch (error) {
    throw error;
  }
}

app.post("/task", verifyToken, async (req, res) => {
  try {
    const validatedBody = await createTaskZodSchema.parseAsync(req.body);
    req.body = validatedBody;
    const savedTask = await createNewTask(req.body);
    if (savedTask) {
      res.status(201).json(savedTask);
    }
  } catch (error) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to add new task.", errorMessage: error.message });
  }
});

async function readAllTask(filter) {
  try {
    const allTask = await Task.find(filter)
      .populate("project", "-_id")
      .populate("team", "-_id")
      .populate("owners", "-_id");
    return allTask;
  } catch (error) {
    throw error;
  }
}

app.get("/task", verifyToken, async (req, res) => {
  try {
    const filterFields = ["tag", "owner", "project", "team"];
    const filter = filterFields.reduce((acc, field) => {
      const value = req.query[field];
      if (value) {
        acc[field] = value;
      }
      return acc;
    }, {});

    const allTasks = await readAllTask(filter);
    if (allTasks.length > 0) {
      const flattendTask = allTasks.map((task) => {
        const taskObj = task.toObject();
        return {
          ...taskObj,
          project: taskObj.project ? taskObj.project.name : null,
          team: taskObj.team ? taskObj.team.name : null,
          owners: taskObj.owners
            ? taskObj.owners.map((owner) => owner.name)
            : [],
        };
      });
      return res.json(flattendTask);
    } else {
      return res.status(404).json({ error: "No task found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to get tasks details.",
      errorMessage: error.message,
    });
  }
});

async function updateTaskById(taskId, dataToUpdate) {
  try {
    const updateTask = await Task.findByIdAndUpdate(taskId, dataToUpdate, {
      returnDocument: "after",
    });
    return updateTask;
  } catch (error) {
    throw error;
  }
}

app.post("/task/:taskId", verifyToken, async (req, res) => {
  try {
    const validatedBody = await createTaskZodSchema.parseAsync(req.body);
    req.body = validatedBody;
    const updatedTask = await updateTaskById(req.params.taskId, req.body);
    if (updatedTask) {
      res.status(201).json({ message: "Updated successfully", updatedTask });
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (error) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to update task.", details: error.message });
  }
});

async function deleteTaskById(taskId) {
  try {
    const updateTask = await Task.findByIdAndDelete(taskId);
    return updateTask;
  } catch (error) {
    throw error;
  }
}

app.delete("/task/:taskId", verifyToken, async (req, res) => {
  try {
    const deletedTask = await deleteTaskById(req.params.taskId);
    if (deletedTask) {
      res.status(201).json({ message: "Deleted successfully", deletedTask });
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to delete the task.",
        errorMessage: error.message,
      });
  }
});

/* user Api */

async function readUsersName(){
  try{
    const users = await User.find().select("name _id")
    return users
  }catch(error){
    throw error
  }
}

app.get("/owners", verifyToken , async (req , res) => {
  try{
    const users = await readUsersName()
    if(users.length > 0){
      res.status(200).json(users)
    }else{
      res.status(404).json({error: "Users not found"})
    }
  }catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to get owners.",
        errorMessage: error.message,
      });
  }
})


/* Reports Api */

async function getLastWeekTasksReport() {
  try {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    const filter = {
      status: "Completed",
      updatedAt: { $gte: lastWeek },
    };
    const tasks = await Task.find(filter);
    return tasks;
  } catch (error) {
    throw error;
  }
}

app.get("/report/last-week", verifyToken, async (req, res) => {
  try {
    const tasks = await getLastWeekTasksReport();
    if (tasks.length > 0) {
      return res.json(tasks);
    } else {
      return res.status(404).json({ error: "no report found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate last week tasks report.",
      errorMessage: error.message,
    });
  }
});

async function getPendingTasksReport() {
  try {
    const reportArray = await Task.aggregate([
      { $match: { status: { $ne: "Completed" } } },
      {
        $group: {
          _id: "$status",
          totalTimePending: { $sum: "$timeToComplete" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          totalTimePending: 1,
        },
      },
    ]);
    return reportArray;
  } catch (error) {
    throw error;
  }
}

app.get("/report/pending", verifyToken, async (req, res) => {
  try {
    const reportData = await getPendingTasksReport();
    if (reportData.length > 0) {
      return res.json(reportData);
    } else {
      res.status(404).json({ error: "No report found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate pending tasks report.",
      errorMessage: error.message,
    });
  }
});

async function getClosedTasksReport() {
  try {
    const reportArray = await Task.aggregate([
      {
        $match: { status: "Completed" },
      },
      {
        $facet: {
          byTeam: [
            { $group: { _id: "$team", totalCompleted: { $sum: 1 } } },
            {
              $lookup: {
                from: "teams",
                localField: "_id",
                foreignField: "_id",
                as: "teamDetails",
              },
            },
            {
              $project: {
                _id: 0,
                team: { $arrayElemAt: ["$teamDetails.name", 0] }, // Extracts the string out of the lookup array
                totalCompleted: 1,
              },
            },
          ],
          byOwners: [
            { $unwind: "$owners" },
            { $group: { _id: "$owners", totalCompleted: { $sum: 1 } } },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "ownerDetails",
              },
            },
            {
              $project: {
                _id: 0,
                owner: { $arrayElemAt: ["$ownerDetails.name", 0] },
                totalCompleted: 1,
              },
            },
          ],
          byProject: [
            { $group: { _id: "$project", totalCompleted: { $sum: 1 } } },
            {
              $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "_id",
                as: "projectDetails",
              },
            },
            {
              $project: {
                _id: 0,
                project: { $arrayElemAt: ["$projectDetails.name", 0] },
                totalCompleted: 1,
              },
            },
          ],
        },
      },
    ]);

    return reportArray[0];
  } catch (error) {
    throw error;
  }
}

app.get("/report/closed-tasks", verifyToken, async (req, res) => {
  try {
    const reportData = await getClosedTasksReport();
    if (reportData) {
      return res.json(reportData);
    } else {
      res.status(404).json({ error: "No report found." });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate closed tasks work report.",
      errorMessage: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Port running on the ${PORT}`);
});

export default app;
