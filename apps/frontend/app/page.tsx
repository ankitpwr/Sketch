import Canvas from "@/components/canvas";
import { useEffect, useRef } from "react";

export default function Home() {
  return (
    <div className="w-screen h-screen ">
      <Canvas standalone={true} socket={null} />
    </div>
  );
}
