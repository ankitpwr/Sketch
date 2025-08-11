import useCanvasStore from "@/app/store/canvas-store";
import useUserStore from "@/app/store/user-store";
import Canvas from "@/components/canvas";
import RoomCanvas from "@/components/roomCanvas";
import React, { useEffect, useState } from "react";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const newRoomId = (await params).roomId;

  return <RoomCanvas newRoomId={newRoomId} />;
}
