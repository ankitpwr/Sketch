import { WebSocketServer, WebSocket } from "ws";
import {
  CustomWebSocket,
  MessageType,
  ParsedData,
  WS_Erase_Shape,
  WS_Message,
  WS_New_Shape,
  WS_Shape_Move,
} from "@repo/types/wsTypes";
import { CustomJwtPayload } from "@repo/types/commonTypes";
import { prisma } from "@repo/db/index";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Shape } from "@repo/types/canvasTypes";
dotenv.config();
const UserConnection = new Map<WebSocket, { userId: string; name: string }>();
const Rooms = new Map<string, WebSocket[]>();

const wss = new WebSocketServer({ port: 8080 });

function veifyToken(token: string) {
  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;
    return { userId: decode.userId, name: decode.name };
  } catch (error) {
    console.log(error);
    return null;
  }
}
wss.on("connection", (ws: WebSocket, request) => {
  console.log("connection initiated");
  const url = request.url;
  if (!url) {
    console.log("URl_not_present");
    ws.close(1008, "Invalid URL");
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const isVerified = veifyToken(token);

  if (!isVerified) {
    console.log("Invalied token");
    return ws.close(1008, "Invalid User");
  }
  const userId = isVerified.userId;
  const name = isVerified.name;

  //adding ws to map along with userId
  UserConnection.set(ws, { userId: userId, name: name });

  ws.on("message", async (data) => {
    try {
      // can use .tostring();
      const parsedData: WS_Message = JSON.parse(data as unknown as string);
      if (!parsedData) return;
      if (!parsedData.roomId) return;
      if (parsedData.type == MessageType.JOIN) {
        //checking if room is already present or not
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) {
          roomConnections = [];
          Rooms.set(parsedData.roomId, roomConnections);
        }
        roomConnections.push(ws);

        ws.send(
          JSON.stringify({
            type: MessageType.JOIN,
            roomId: parsedData.roomId,
            userId: userId,
            name: name,
            message: `You Have Joined The Room`,
          })
        );
      } else if (parsedData.type == MessageType.LEAVE) {
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) return;
        roomConnections = roomConnections.filter((socket) => socket != ws);
        if (roomConnections.length == 0) Rooms.delete(parsedData.roomId);
        else Rooms.set(parsedData.roomId, roomConnections);
        ws.send(
          JSON.stringify({
            type: MessageType.LEAVE,
            roomId: parsedData.roomId,
            userId: userId,
            name: name,
            message: "You Have Left The Room",
          })
        );
      } else if (parsedData.type == MessageType.ERASER) {
        const EraseData: WS_Erase_Shape = JSON.parse(data.toString());
        const shapeId = EraseData.shapeId;
        if (!shapeId) {
          ws.send("no Shape to delete");
          return;
        }
        let roomConnections = Rooms.get(EraseData.roomId);
        if (!roomConnections) return;

        await prisma.shape.deleteMany({
          where: {
            id: { in: shapeId },
          },
        });

        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.ERASER,
              roomId: EraseData.roomId,
              userId: userId,
              name: name,
              message: EraseData.message,
              shapeId: shapeId,
            })
          );
        });
      } else if (parsedData.type == MessageType.SHAPE_MOVE) {
        const shapeMoveData: WS_Shape_Move = JSON.parse(data.toString());
        const shapeToMove = shapeMoveData.shape;
        if (!shapeToMove || !shapeToMove.id) {
          ws.send("no shape provided");
          return;
        }
        let roomConnections = Rooms.get(shapeMoveData.roomId);
        if (!roomConnections) return;

        roomConnections.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.SHAPE_MOVE,
              roomId: shapeMoveData.roomId,
              userId: userId,
              name: name,
              message: shapeMoveData.message,
              shapeToMove: shapeToMove,
            })
          );
        });
      } else if (parsedData.type == MessageType.SHAPE_RESIZE) {
        const message = parsedData.message;
        if (!message) {
          ws.send("Empty message is not allowed");
          return;
        }
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) return;
        roomConnections.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.SHAPE_RESIZE,
              roomId: parsedData.roomId,
              userId: userId,
              name: name,
              message: parsedData.message,
            })
          );
        });
      } else if (parsedData.type == MessageType.PREVIEW_SHAPE) {
        const previewShapeData: WS_New_Shape = JSON.parse(data.toString());
        const shape = previewShapeData.shape;
        if (!shape) {
          ws.send("no shape provided");
          return;
        }
        let roomConnections = Rooms.get(previewShapeData.roomId);

        if (!roomConnections) return;

        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.PREVIEW_SHAPE,
              roomId: previewShapeData.roomId,
              userId: userId,
              name: name,
              message: previewShapeData.message,
              shape: previewShapeData.shape,
            })
          );
        });
      } else if (parsedData.type == MessageType.SHAPE) {
        const shapeData: WS_New_Shape = JSON.parse(data.toString());
        const newShape: Shape = shapeData.shape;
        if (!newShape || !newShape.id) {
          ws.send("no shape provided");
          return;
        }
        let roomConnections = Rooms.get(shapeData.roomId);
        if (!roomConnections) return;
        //db call
        const shape = await prisma.shape.create({
          data: {
            id: newShape.id,
            userId: userId,
            roomId: shapeData.roomId,
            message: JSON.stringify(newShape),
          },
        });

        //send message
        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.SHAPE,
              roomId: shapeData.roomId,
              userId: userId,
              name: name,
              message: shapeData.message,
              shape: newShape,
            })
          );
        });
      }
    } catch (error) {
      console.log(error);
      console.log(`something Wrong`);
    }
  });

  ws.on("close", () => {
    UserConnection.delete(ws);
    Rooms.forEach((socket, roomId) => {
      socket = socket.filter((s) => s != ws);
      if (socket.length == 0) Rooms.delete(roomId);
      else Rooms.set(roomId, socket);
    });
  });
});
