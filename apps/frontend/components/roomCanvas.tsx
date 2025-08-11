"use client";
import React, { useEffect, useState } from "react";
import Canvas from "./canvas";
import { MessageType } from "@repo/types/wsTypes";
import useUserStore from "@/app/store/user-store";
import { useRouter } from "next/navigation";

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
    if (!authToken) {
      console.log("no auth Token");
      router.push("/signin");
    }
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BASE_URL}?token=${authToken}`
    );
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: MessageType.JOIN,
          roomId: newRoomId,
        })
      );
    };
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log("messagedata is ");
      console.log(messageData);
      if (messageData.type == MessageType.JOIN) {
        setUserId(messageData.userId);
        setUsername(messageData.username);
      }
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
