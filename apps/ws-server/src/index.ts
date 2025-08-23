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
import { prisma } from "@repo/db/prisma";
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
  console.log(`token is ${token}`);
  const isVerified = veifyToken(token);

  if (!isVerified) {
    console.log("Invalied token");
    return ws.close(4001, "Invalid User");
  }
  const userId = isVerified.userId;
  const name = isVerified.name;

  UserConnection.set(ws, { userId: userId, name: name });

  ws.on("message", async (data) => {
    try {
      // can use .tostring();
      const parsedData: WS_Message = JSON.parse(data as unknown as string);
      if (!parsedData) return;
      if (!parsedData.roomId) return;
      let roomConnections: WebSocket[] | undefined;
      switch (parsedData.type) {
        case MessageType.JOIN:
          const roomData = await prisma.room.findFirst({
            where: {
              id: parsedData.roomId,
            },
          });

          if (!roomData) {
            return ws.close(4002, "Invalid Room Id");
          }

          roomConnections = Rooms.get(parsedData.roomId);
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
              username: name,
              message: `You Have Joined The Room`,
            })
          );
          break;
        case MessageType.LEAVE:
          roomConnections = Rooms.get(parsedData.roomId);
          if (!roomConnections) return;
          roomConnections = roomConnections.filter((socket) => socket != ws);
          if (roomConnections.length == 0) Rooms.delete(parsedData.roomId);
          else Rooms.set(parsedData.roomId, roomConnections);
          ws.close(
            1000,
            JSON.stringify({
              type: MessageType.LEAVE,
              roomId: parsedData.roomId,
              userId: userId,
              name: name,
              message: "You Have Left The Room",
            })
          );
          break;
        case MessageType.ERASER:
          const EraseData = parsedData as WS_Erase_Shape;
          const shapeId = EraseData.shapeId;

          roomConnections = Rooms.get(EraseData.roomId);
          if (!roomConnections) return;

          await prisma.shape.deleteMany({
            where: {
              id: { in: shapeId },
            },
          });

          roomConnections?.forEach((socket) => {
            if (ws != socket) {
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
            }
          });
          break;
        case MessageType.SHAPE_MOVE:
          const shapeMoveData = parsedData as WS_Shape_Move;
          const shapeToMove = shapeMoveData.shape;
          if (!shapeToMove || !shapeToMove.id) {
            ws.send("no shape provided");
            return;
          }
          roomConnections = Rooms.get(shapeMoveData.roomId);
          if (!roomConnections) return;

          if (shapeMoveData.lastMove) {
            await prisma.shape.update({
              where: {
                id: shapeToMove.id,
              },
              data: {
                message: JSON.stringify(shapeToMove),
              },
            });
          }

          roomConnections.forEach((socket) => {
            if (ws != socket) {
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
            }
          });
          break;
        case MessageType.SHAPE_RESIZE:
          const shapeResizeData = parsedData as WS_Shape_Move;
          const shapeToResize = shapeResizeData.shape;
          if (!shapeToResize || !shapeToResize.id) {
            ws.send("Empty message is not allowed");
            return;
          }
          roomConnections = Rooms.get(parsedData.roomId);
          if (!roomConnections) return;

          if (shapeResizeData.lastMove) {
            await prisma.shape.update({
              where: {
                id: shapeToResize.id,
              },
              data: {
                message: JSON.stringify(shapeToResize),
              },
            });
          }

          roomConnections.forEach((socket) => {
            if (ws != socket) {
              socket.send(
                JSON.stringify({
                  type: MessageType.SHAPE_RESIZE,
                  roomId: shapeResizeData.roomId,
                  userId: userId,
                  name: name,
                  message: shapeResizeData.message,
                  shapeToResize: shapeToResize,
                })
              );
            }
          });
          break;
        case MessageType.PREVIEW_SHAPE:
          const previewShapeData = parsedData as WS_New_Shape;
          let shape = previewShapeData.shape;
          if (!shape) {
            ws.send("no shape provided");
            return;
          }
          roomConnections = Rooms.get(previewShapeData.roomId);
          if (!roomConnections) return;
          roomConnections?.forEach((socket) => {
            if (ws != socket) {
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
            }
          });
          break;
        case MessageType.SHAPE:
          const shapeData = parsedData as WS_New_Shape;
          const newShape: Shape = shapeData.shape;
          if (!newShape || !newShape.id) {
            ws.send("no shape provided");
            return;
          }
          roomConnections = Rooms.get(shapeData.roomId);
          if (!roomConnections) return;
          //db call
          await prisma.shape.create({
            data: {
              id: newShape.id,
              userId: userId,
              roomId: shapeData.roomId,
              message: JSON.stringify(newShape),
            },
          });

          //send message
          roomConnections?.forEach((socket) => {
            if (ws != socket) {
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
            }
          });
          break;
      }
    } catch (error) {
      console.log("Error occrred in ws-server");
      console.log(error);
      ws.send(
        JSON.stringify({
          type: MessageType.ERROR,
          message: "Internal error occured, try ",
        })
      );
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
