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
  private setPreviewShape: (shape: Shape | null) => void;
  constructor(
    socket: WebSocket,
    existingShapes: Shape[],
    triggerRender: () => void,
    roomId: string,
    setPreviewShape: (shape: Shape | null) => void
  ) {
    this.socket = socket;
    this.existingShapes = existingShapes;
    this.triggerRender = triggerRender;
    this.roomId = roomId;
    this.onMessage();
    this.setPreviewShape = setPreviewShape;
  }

  onMessage = () => {
    this.socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type == MessageType.SHAPE) {
        const shapeData = messageData.message;
        this.existingShapes.push(shapeData);
        this.triggerRender();
      } else if (messageData.type == MessageType.PREVIEW_SHAPE) {
        const shapeData = messageData.message;
        this.setPreviewShape(shapeData);
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

  sendPreviewShape = (shape: Shape) => {
    this.socket.send(
      JSON.stringify({
        type: MessageType.PREVIEW_SHAPE,
        roomId: this.roomId,
        message: shape,
      })
    );
  };
}
