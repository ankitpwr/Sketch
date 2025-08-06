export enum MessageType {
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  MESSAGE = "MESSAGE",
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
