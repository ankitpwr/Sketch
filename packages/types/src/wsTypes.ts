export interface WebsocketMessage {
  type: "JOIN" | "LEAVE" | "MESSAGE";
  userId: string;
  userName: string;
  roomId: string;
  message: string | null;
}

export interface CustomWebSocket extends WebSocket {
  userId: string;
  roomId: string;
}
