import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { SignUpSchema, SignInSchema } from "@repo/types/zodSchema";
import { prisma } from "@repo/db/index";
import { authMiddleware, CustomRequest } from "./middleware";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.post("/signup", async (req, res) => {
  try {
    console.log("ho");
    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        error: parseData.error.issues,
      });
    }
    //bcrypt for password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    console.log(hashedPassword);

    //db call
    console.log("before db call");
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
      },
    });
    //jwt token generation.
    const payload = { userId: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return res.status(200).json({
      message: "You have signed in successfully",
      token: token,
    });
  } catch (error) {
    console.log(`Error Occured`);
    console.log(error);
    return res.status(500).json({
      error: `Internal server error`,
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
    if (!user) return res.status(400).json({ error: "Email not found" });
    const verifyPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifyPassword) {
      return res.status(400).json({ error: "Incorrect Password" });
    }
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

app.post("/create-room", authMiddleware, async (req, res) => {
  try {
    const userId = (req as CustomRequest).userId;
    const name = (req as CustomRequest).name;
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
    console.log("Internal server error");
  }
});

app.get("/room-messages", authMiddleware, async (req, res) => {
  try {
    const roomId = String(req.query.roomId);
    if (!roomId) return res.status(400).json({ error: "No room ID" });
    const messages = await prisma.shape.findMany({
      where: {
        roomId: roomId,
      },
    });
    return res.status(200).json({
      messages: messages,
    });
  } catch (error) {}
});

app.get;

app.listen(process.env.PORT);
