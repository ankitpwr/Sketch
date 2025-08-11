"use client";
import Canvas from "@/components/canvas";
import { useEffect, useRef } from "react";
import useUserStore from "./store/user-store";

export default function Home() {
  const { standalone, setStandalone } = useUserStore();
  useEffect(() => {
    setStandalone(true);
  }, [setStandalone]);
  return (
    <div className="w-screen h-screen ">
      <Canvas />
    </div>
  );
}
