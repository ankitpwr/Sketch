import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

export interface CustomRequest extends Request {
  userId: string;
  name: string;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  name: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let decode;
  try {
    const token = req.headers["authorization"] ?? "";
    if (!token || token == "") {
      return res.status(401).json({
        message: "Invalid user",
        error: "Unauthorized User, please login first",
      });
    }
    decode = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
    if (!decode || !decode.name || !decode.userId) {
      return res.status(401).json({
        message: "Invalid user",
        error: "Unauthorized User, please login first",
      });
    }

    console.log("userid ", decode.userId);
    console.log("name is ", decode.name);
    (req as CustomRequest).userId = decode.userId;
    (req as CustomRequest).name = decode.name;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid user",
      error: "Unauthorized User, please login first",
    });
  }
}
