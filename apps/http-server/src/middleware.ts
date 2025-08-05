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
  next: NextFunction
) {
  let decode;
  try {
    console.log(req.header);
    console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] ?? "";
    decode = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
  } catch (error) {
    return res.status(401).json({ error: "Please signin " });
  }
  (req as CustomRequest).userId = decode.userId;
  (req as CustomRequest).name = decode.name;
  next();
}
