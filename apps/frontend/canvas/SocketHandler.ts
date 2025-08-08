import { Shape } from "./types/types";
import { MessageType } from "@repo/types/wsTypes";
export class SocketHandler {
  private socket: WebSocket;
  private existingShapes: Shape[];
  private triggerRender: () => void;
  private roomId: string;
  private setPreviewShape: (shape: Shape | null) => void;
  private userId: string;
  private addShape: (shape: Shape) => void;
  private removeShape: (shape: Shape) => void;
  private manageShape: (shape: Shape) => void;
  constructor(
    socket: WebSocket,
    existingShapes: Shape[],
    triggerRender: () => void,
    roomId: string,
    setPreviewShape: (shape: Shape | null) => void,
    userId: string,
    addShape: (shape: Shape) => void,
    removeShape: (shapeId: any) => void,
    manageShape: (shape: Shape) => void
  ) {
    this.socket = socket;
    this.existingShapes = existingShapes;
    this.triggerRender = triggerRender;
    this.roomId = roomId;
    this.onMessage();
    this.setPreviewShape = setPreviewShape;
    this.userId = userId;
    this.addShape = addShape;
    this.removeShape = removeShape;
    this.manageShape = manageShape;
  }

  onMessage = () => {
    this.socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);

      if (messageData.type == MessageType.SHAPE) {
        const shapeData = messageData.message;
        this.setPreviewShape(null);
        this.addShape(shapeData);
      } else if (messageData.type == MessageType.PREVIEW_SHAPE) {
        const shapeData = messageData.message;
        this.setPreviewShape(shapeData);
        this.triggerRender();
      } else if (messageData.type == MessageType.ERASER) {
        const EraseData = messageData.message;
        this.removeShape(EraseData);
      } else if (messageData.type == MessageType.SHAPE_MOVE) {
        if (messageData.userId == this.userId) return;
        const shape = messageData.message;
        this.manageShape(shape);
      } else if (messageData.type == MessageType.SHAPE_RESIZE) {
        if (messageData.userId == this.userId) return;
        const shape = messageData.message;
        this.manageShape(shape);
      }
    };
  };
  sendShape = (shape: Shape, id: string) => {
    this.socket.send(
      JSON.stringify({
        id: id,
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

  eraseShape = (shapes: Shape[]) => {
    const shapeId = shapes.map((s) => s.id);
    this.socket.send(
      JSON.stringify({
        type: MessageType.ERASER,
        roomId: this.roomId,
        message: shapeId,
      })
    );
  };

  shapeMove = (shape: Shape) => {
    this.socket.send(
      JSON.stringify({
        type: MessageType.SHAPE_MOVE,
        roomId: this.roomId,
        message: shape,
      })
    );
  };

  shapeResize = (shape: Shape) => {
    this.socket.send(
      JSON.stringify({
        type: MessageType.SHAPE_RESIZE,
        roomId: this.roomId,
        message: shape,
      })
    );
  };
}
