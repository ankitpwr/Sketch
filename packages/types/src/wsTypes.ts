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

export interface WS_Message_Shape {
  id: string;
  type: MessageType;
  roomId: string;
  message: string | null;
}
export interface WS_Message_Erase {
  id: string;
  type: MessageType;
  roomId: string;
  message: string[];
}

export type ParsedData = WS_Message_Erase | WS_Message_Shape;

export interface CustomWebSocket extends WebSocket {
  userId: string;
  roomId: string;
}
