import { WebSocketServer, WebSocket } from "ws";
import {
  WebsocketMessage,
  CustomWebSocket,
  MessageType,
} from "@repo/types/wsTypes";
import { CustomJwtPayload } from "@repo/types/commonTypes";
import { prisma } from "@repo/db/index";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
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
  console.log(`token ${token}`);
  const isVerified = veifyToken(token);

  if (!isVerified) {
    console.log("Invalied token");
    return ws.close(1008, "Invalid User");
  }
  const userId = isVerified.userId;
  const name = isVerified.name;
  console.log(`${userId} and ${name}`);

  //adding ws to map along with userId
  UserConnection.set(ws, { userId: userId, name: name });

  ws.on("message", async (data) => {
    try {
      // can use .tostring();
      const parsedData: WebsocketMessage = JSON.parse(
        data as unknown as string
      );
      console.log(parsedData);
      if (!parsedData) return;
      if (!parsedData.roomId) return;
      if (parsedData.type == MessageType.JOIN) {
        //checking if room is already present or not
        console.log("join");
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) {
          roomConnections = [];
          Rooms.set(parsedData.roomId, roomConnections);
        }
        roomConnections.push(ws);

        ws.send(
          JSON.stringify({
            type: MessageType.JOIN,
            message: `You Have Joined The Room`,
            userId: userId,
            name: name,
            roomId: parsedData.roomId,
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
            message: "You Have Left The Room",
            userId: userId,
            name: name,
            roomId: parsedData.roomId,
          })
        );
      } else if (parsedData.type == MessageType.PREVIEW_SHAPE) {
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        if (!message) {
          ws.send("Empty message is not allowed");
          return;
        }
        let roomConnections = Rooms.get(parsedData.roomId);
        console.log("room connection is");
        console.log(roomConnections);
        if (!roomConnections) return;

        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.PREVIEW_SHAPE,
              message: parsedData.message,
              roomId: parsedData.roomId,
              userId: userId,
              name: name,
            })
          );
        });
      } else if (parsedData.type == MessageType.SHAPE) {
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        if (!message) {
          ws.send("Empty message is not allowed");
          return;
        }
        let roomConnections = Rooms.get(parsedData.roomId);
        console.log("room connection is");
        console.log(roomConnections);
        if (!roomConnections) return;

        //db call
        console.log("above db call");
        console.log(message);
        await prisma.shape.create({
          data: {
            userId: userId,
            roomId: roomId,
            message: JSON.stringify(message),
          },
        });

        //send message
        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: MessageType.SHAPE,
              message: parsedData.message,
              roomId: parsedData.roomId,
              userId: userId,
              name: name,
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
