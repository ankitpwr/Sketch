"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useEffect, useRef, useState } from "react";
import Button from "./button";
import { Tool } from "@/canvas/types";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const [tool, setTool] = useState<Tool>("Pan");
  const [size, setSize] = useState({ w: 0, h: 0 });

  const handleTool = (tool: Tool) => {
    console.log(`tool is being set up ${tool}`);
    setTool(tool);
  };
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
  }, [canvasRef]);

  return (
    <div className="w-screen h-screen">
      <canvas ref={canvasRef} width={size.w} height={size.h}></canvas>

      <div className="fixed top-5 left-1/2 flex gap-2">
        <Button title={"Pan"} onClickhandler={() => handleTool("Pan")} />
        <Button title={"Select"} onClickhandler={() => handleTool("Select")} />
        <Button
          title={"Rectangle"}
          onClickhandler={() => handleTool("Rectangle")}
        />
        <Button
          title={"Diamond"}
          onClickhandler={() => handleTool("Diamond")}
        />
        <Button
          title={"Ellipse"}
          onClickhandler={() => handleTool("Ellipse")}
        />
        <Button title={"Line"} onClickhandler={() => handleTool("Line")} />

        <Button title={"Pencil"} onClickhandler={() => handleTool("Pencil")} />
        <Button title={"Eraser"} onClickhandler={() => handleTool("Eraser")} />
        <Button title={"Text"} onClickhandler={() => handleTool("Text")} />
      </div>
    </div>
  );
}
