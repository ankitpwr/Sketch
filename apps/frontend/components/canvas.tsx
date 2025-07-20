"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useEffect, useRef, useState } from "react";
import Button from "./button";
import { Tool } from "@/canvas/types/types";
import Tools from "./tools";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const [tool, setTool] = useState<Tool>("Pan");
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    setSize({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }, []);

  useEffect(() => {
    if (!canvasEngine || !canvasEngine.currentTool) return;
    canvasEngine.currentTool = tool;
    console.log("Current tool set to:", tool);
  }, [tool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const engine = new CanvasEngine(canvas, ctx);
    setcanvasEngine(engine);
  }, [canvasRef, size]);

  return (
    <div className="w-screen h-screen ">
      <canvas ref={canvasRef} width={size.w} height={size.h}></canvas>

      <Tools setTool={setTool} currentTool={tool} />
    </div>
  );
}
