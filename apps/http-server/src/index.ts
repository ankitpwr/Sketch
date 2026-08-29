import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { SignUpSchema, SignInSchema } from "@repo/types/zodSchema";
import { prisma } from "@repo/db/prisma";
import { authMiddleware, CustomRequest } from "./middleware";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/health-check", async (req, res) => {
  try {
    return res.status(200).json({ message: "all good" });
  } catch (error) {
    console.log(`Error Occured`);
    console.log(error);
    return res.status(500).json({
      error: `Internal server error`,
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        error: parseData.error.issues,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    //bcrypt for password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 5);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
      },
    });
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET!,
    );

    return res.status(200).json({
      message:
        "Signup successful. Please check your email for verification code.",
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(`Error Occured`);
    console.log(error);
    return res.status(500).json({
      error: `Internal server error`,
    });
  }
});

app.get("/get-users", async (req, res) => {
  try {
    const userData = await prisma.user.findMany({});
    return res.status(200).json({
      users: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parseData = SignInSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        error: parseData.error.issues,
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!user)
      return res.status(400).json({ error: "Email not found ! Please Signup" });

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!passwordMatches)
      return res.status(401).json({ error: "Invalid email or password" });

    const payload = { userId: user.id, name: user.name };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return res.status(200).json({
      message: "You have successfully signed in",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.post("/user-data", authMiddleware, async (req, res) => {
  try {
    const userId = (req as CustomRequest).userId;
    const name = (req as CustomRequest).name;
    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!userData)
      return res.status(400).json({
        message: "User does not exist",
      });
    return res.status(200).json({
      userId: userData.id,
      name: userData.name,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.post("/create-room", authMiddleware, async (req, res) => {
  try {
    const userId = (req as CustomRequest).userId;
    const name = (req as CustomRequest).name;

    console.log("userid is ", userId, " and name is ", name);
    const room = await prisma.room.create({
      data: {
        userId: userId,
      },
    });
    return res.status(200).json({
      message: "successfully created",
      roomId: room.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/room-messages", authMiddleware, async (req, res) => {
  try {
    const roomId = String(req.query.roomId);
    if (!roomId) return res.status(400).json({ error: "No room ID" });
    console.log(`room id  is ${roomId}`);
    const messages = await prisma.shape.findMany({
      where: {
        roomId: roomId,
      },
    });
    return res.status(200).json({
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get;

app.listen(process.env.PORT || 3000);
