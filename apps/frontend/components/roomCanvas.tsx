"use client";
import React, { useEffect, useState } from "react";
import Canvas from "./canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

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
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Canvas standalone={false} socket={socket} roomId={roomId} />
    </div>
  );
}
