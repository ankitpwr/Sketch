import { Shape } from "./canvasTypes";

export enum MessageType {
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  SHAPE = "SHAPE",
  PREVIEW_SHAPE = "PREVIEW_SHAPE",
  ERASER = "ERASER",
  CURSOR = "CURSOR",
  SHAPE_MOVE = "SHAPE_MOVE",
  SHAPE_RESIZE = "SHAPE_RESIZE",
}
export interface WS_Message {
  type: MessageType;
  roomId: string;
  message: string;
}
export interface WS_New_Shape extends WS_Message {
  id: string;
  shape: Shape;
}
export interface WS_Erase_Shape extends WS_Message {
  shapeId: string[];
}

export interface WS_Shape_Move extends WS_Message {
  lastMove: boolean;
  shape: Shape;
}

export type ParsedData = WS_Message;

export interface CustomWebSocket extends WebSocket {
  userId: string;
  roomId: string;
}
