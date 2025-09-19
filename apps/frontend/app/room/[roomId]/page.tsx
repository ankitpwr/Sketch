import useCanvasStore from "@/app/store/canvas-store";
import useUserStore from "@/app/store/user-store";
import Canvas from "@/components/canvas";
import RoomCanvas from "@/components/roomCanvas";
import React, { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ roomId: string }>;
}
export default async function RoomPage({ params }: PageProps) {
  const { roomId } = await params;
  console.log(`in page.tsx roomid is ${roomId}`);
  // mobile  zooming  not working
  return <RoomCanvas newRoomId={roomId} />;
}
