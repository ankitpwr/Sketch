import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { SignUpSchema, SignInSchema } from "@repo/types/zodSchema";
import { prisma } from "@repo/db/prisma";
import { authMiddleware, CustomRequest } from "./middleware";
import { sendEmail } from "./email";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

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

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    //bcrypt for password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 5);

    //update the password and name
    if (existingUser && !existingUser.isVerified) {
      const updatedUser = await prisma.user.update({
        where: { email: req.body.email },
        data: {
          name: req.body.name,
          password: hashedPassword,
        },
      });

      //generate and store otp.
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expireAt = new Date(Date.now() + 15 * 60 * 1000);
      await prisma.verificationToken.create({
        data: {
          token: otp,
          expiresAt: expireAt,
          userId: updatedUser.id,
        },
      });

      //send Email verification code.
      sendEmail(updatedUser.email, otp, updatedUser.name);

      return res.status(200).json({
        message:
          "Signup successful. Please check your email for verification code.",
        email: updatedUser.email,
      });
    } else {
      //db call
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          isVerified: false,
        },
      });

      //generate and store otp.
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expireAt = new Date(Date.now() + 15 * 60 * 1000);
      await prisma.verificationToken.create({
        data: {
          token: otp,
          userId: user.id,
          expiresAt: expireAt,
        },
      });

      sendEmail(user.email, otp, user.name);

      return res.status(200).json({
        message:
          "Signup successful. Please check your email for verification code.",
        email: user.email,
      });
    }
  } catch (error) {
    console.log(`Error Occured`);
    console.log(error);
    return res.status(500).json({
      error: `Internal server error`,
    });
  }
});

app.post("/verify-email", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    //check if otp is correct or not.
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        token: otp,
      },
    });

    if (!verificationToken) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (new Date() > verificationToken.expiresAt) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    //update verify status
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    //jwt token generation.
    const payload = { userId: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return res.status(200).json({
      message: " Email verified",
      token: token,
    });
  } catch (error) {
    console.log(`Error Occured`);
    console.log(error);
    return res.status(500).json({
      error: " Internal server error",
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
    if (!user.isVerified) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expireAt = new Date(Date.now() + 15 * 60 * 1000);
      await prisma.verificationToken.create({
        data: {
          token: otp,
          expiresAt: expireAt,
          userId: user.id,
        },
      });

      //send Email verification code.
      sendEmail(user.email, otp, user.name);

      return res.status(409).json({
        error: "Please verify your email before signin.",
        email: user.email,
      });
    }

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
      verified: userData.isVerified,
    });
  } catch (error) {}
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
    console.log(`room id  is ${roomId}`);
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
