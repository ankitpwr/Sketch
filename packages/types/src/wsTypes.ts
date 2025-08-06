export enum MessageType {
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  SHAPE = "SHAPE",
  PREVIEW_SHAPE = "PREVIEW_SHAPE",
  ERASER = "ERASER",
  CURSOR = "CURSOR",
}

export interface WebsocketMessage {
  type: MessageType;
  roomId: string;
  message: string | null;
}

export interface CustomWebSocket extends WebSocket {
  userId: string;
  roomId: string;
}
