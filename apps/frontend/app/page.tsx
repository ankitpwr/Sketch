"use client";
import Canvas from "@/components/canvas";
import { useEffect, useRef } from "react";
import useUserStore from "./store/user-store";

export default function Home() {
  const { standalone, setStandalone } = useUserStore();
  useEffect(() => {
    setStandalone(true);
    console.log(`in home standalone is ${standalone}`);
  }, [setStandalone]);
  return (
    <div className="w-screen h-screen transition-all duration-300 ">
      <Canvas />
    </div>
  );
}
