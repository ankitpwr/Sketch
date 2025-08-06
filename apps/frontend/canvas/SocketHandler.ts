import { json } from "stream/consumers";
import { Shape } from "./types/types";
import {
  WebsocketMessage,
  CustomWebSocket,
  MessageType,
} from "@repo/types/wsTypes";
export class SocketHandler {
  private socket: WebSocket;
  private existingShapes: Shape[];
  private triggerRender: () => void;
  private roomId: string;
  constructor(
    socket: WebSocket,
    existingShapes: Shape[],
    triggerRender: () => void,
    roomId: string
  ) {
    this.socket = socket;
    this.existingShapes = existingShapes;
    this.triggerRender = triggerRender;
    this.roomId = roomId;
    this.onMessage();
  }

  onMessage = () => {
    this.socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type == MessageType.SHAPE) {
        console.log("message data is ");
        console.log(messageData);
        const shapeData = messageData.message;

        this.existingShapes.push(shapeData);
        this.triggerRender();
      }
    };
  };
  sendShape = (shape: Shape) => {
    this.socket.send(
      JSON.stringify({
        type: MessageType.SHAPE,
        roomId: this.roomId,
        message: shape,
      })
    );
  };
}
