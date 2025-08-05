import Canvas from "@/components/canvas";
import RoomCanvas from "@/components/roomCanvas";
import React, { useEffect, useState } from "react";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const roomId = (await params).roomId;
  return <RoomCanvas roomId={roomId} />;
}
