"use client";
import React, { useEffect, useState } from "react";
import Canvas from "./canvas";
import { MessageType } from "@repo/types/wsTypes";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BASE_URL}?token=${localStorage.getItem("token")}`
    );
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "JOIN",
          roomId: roomId,
        })
      );
    };
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type == MessageType.JOIN) {
        console.log(messageData);
        setUserId(messageData.userId);
      }
    };
  }, []);

  if (!socket || !userId) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Canvas
        standalone={false}
        socket={socket}
        roomId={roomId}
        userId={userId}
      />
    </div>
  );
}
