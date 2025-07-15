import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  userId: string;
  name: string;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  name: string;
}
