import "dotenv/config";
import mongoose, { Schema } from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import {verifyToken} from "../index.js"
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please Login." });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "4h" });
     return res
      .status(200)
      .json({ messge: "User registered successfully", token, name });
  } catch (error) {
    return  res
      .status(500)
      .json({ message: "Server Error", errorMessage: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "4h" });
    res
      .status(200)
      .json({ message: "Login successfully", token, name: user.name });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while login.", error: error.message });
  }
});

router.get("/me", verifyToken, async (req, res, next) => {
  try {
   const userId = req.user.id; 
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get User details", error: error.message });
  }
});

export default router;
