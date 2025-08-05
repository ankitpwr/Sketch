import { json } from "stream/consumers";
import { Shape } from "./types/types";

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
      if (messageData.type == "MESSAGE") {
        const shapeData = JSON.parse(messageData.message);
        console.log("shape data is");
        console.log(shapeData);
        this.existingShapes.push(shapeData);
        this.triggerRender();
      }
    };
  };
  sendMessage = (shape: Shape) => {
    this.socket.send(
      JSON.stringify({
        type: "MESSAGE",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      })
    );
  };
}
