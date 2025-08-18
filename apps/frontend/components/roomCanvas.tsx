"use client";
import React, { useEffect, useState } from "react";
import Canvas from "./canvas";
import { MessageType } from "@repo/types/wsTypes";
import useUserStore from "@/app/store/user-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoomCanvas({ newRoomId }: { newRoomId: string }) {
  const router = useRouter();
  const { userId, username, socket, standalone, roomId } = useUserStore();
  const { setSocket, setUserId, setUsername, setRoomId, setStandalone } =
    useUserStore();

  useEffect(() => {
    if (newRoomId) {
      setRoomId(newRoomId);
      setStandalone(false);
    }
  }, [setRoomId, setStandalone]);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BASE_URL}?token=${authToken}`
    );
    console.log(`the room id in roomCanvas.tsx is ${newRoomId}`);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: MessageType.JOIN,
          roomId: newRoomId,
          message: "Join room",
        })
      );
    };
    ws.onclose = (event) => {
      if (event.code == 4001) {
        toast.error("Please sign in to join the room.");
        localStorage.removeItem("token");
        router.push("/signin");
      } else if (event.code == 4002) {
        toast.error(
          "Redirecting you to the home page. Please check the Room ID and try again."
        );
        setSocket(null);
        setRoomId(null);
        setStandalone(true);
        router.push("/");
      }
    };
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type == MessageType.JOIN) {
        setUserId(messageData.userId);
        setUsername(messageData.username);
      }
    };

    return () => {
      ws.close();
    };
  }, [setSocket, setUserId, setUsername]);

  if (!socket || !userId) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Canvas />
    </div>
  );
}
