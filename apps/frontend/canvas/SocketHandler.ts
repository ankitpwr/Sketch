import { json } from "stream/consumers";
import { Shape } from "./types/types";
import { MessageType } from "@repo/types/wsTypes";
export class SocketHandler {
  private socket: WebSocket;
  private existingShapes: Shape[];
  private triggerRender: () => void;
  private roomId: string;
  private setPreviewShape: (shape: Shape | null) => void;
  private userId: string = "";
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
        console.log("existingShapes are");
        console.log(this.existingShapes);
        this.triggerRender();
      } else if (messageData.type == MessageType.PREVIEW_SHAPE) {
        const shapeData = messageData.message;
        this.setPreviewShape(shapeData);
        this.triggerRender();
      } else if (messageData.type == MessageType.ERASER) {
        const EraseData = messageData.message;
        console.log(`shape id to remove ${EraseData[0]}`);
        const shapeToKeep = this.existingShapes.filter((shape) => {
          if (shape.id == EraseData[0]) {
            console.log(`found one shape to remove`);
            console.log(shape);
            return false;
          } else return true;
        });

        this.existingShapes.length = 0;
        this.existingShapes.push(...shapeToKeep);
        this.triggerRender();
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
}
