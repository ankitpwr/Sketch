import { WebSocketServer, WebSocket } from "ws";
import { WebsocketMessage, CustomWebSocket } from "@repo/types/wsTypes";

const UserConnection = new Map<
  WebSocket,
  { userId: string; username: string }
>();
const Rooms = new Map<string, WebSocket[]>();

const wss = new WebSocketServer({ port: 8080 });

function veifyToken(token: string) {
  return { userId: "asdfasf", username: "erwer" };
}
wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;
  if (!url) {
    console.log("URl_not_present");
    ws.close(1008, "Invalid URL");
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const { userId, username } = veifyToken(token);
  if (!userId) {
    console.log("jwt_token was Invalid");
    ws.close(1008, "Invalid User");
  }
  //adding ws to map along with userId
  UserConnection.set(ws, { userId: userId, username: username });

  ws.on("message", async (data) => {
    try {
      // can use .tostring();
      const parsedData: WebsocketMessage = JSON.parse(
        data as unknown as string
      );
      if (!parsedData) return;
      if (!parsedData.roomId || !parsedData.userId) return;

      if (parsedData.type == "JOIN") {
        //checking if room is already present or not
        let roomConnections = Rooms.get(parsedData.roomId);

        if (!roomConnections) {
          roomConnections = [];
          Rooms.set(parsedData.roomId, roomConnections);
        }
        roomConnections.push(ws);
        ws.send(
          JSON.stringify({
            type: "JOIN",
            message: `You Have Joined The Room`,
            userId: userId,
            userName: username,
            roomId: parsedData.roomId,
          })
        );
      } else if (parsedData.type == "LEAVE") {
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) return;
        roomConnections = roomConnections.filter((socket) => socket != ws);
        if (roomConnections.length == 0) Rooms.delete(parsedData.roomId);
        else Rooms.set(parsedData.roomId, roomConnections);
        ws.send(
          JSON.stringify({
            type: "LEAVE",
            message: "You Have Left The Room",
            userId: userId,
            userName: username,
            roomId: parsedData.roomId,
          })
        );
      } else if (parsedData.type == "MESSAGE") {
        let roomConnections = Rooms.get(parsedData.roomId);
        if (!roomConnections) return;
        //db call
        roomConnections?.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: "Message",
              message: parsedData.message,
              roomId: parsedData.roomId,
              userId: userId,
              userName: username,
            })
          );
        });
      }
    } catch (error) {
      console.log(`something Wrong`);
    }
  });

  ws.on("close", () => {
    UserConnection.delete(ws);
    Rooms.forEach((socket, roomId) => {
      socket = socket.filter((s) => s != ws);
      if (socket.length == 0) Rooms.delete(roomId);
      else Rooms.set(roomId, socket); //do i need to put this line?
    });
  });
});
