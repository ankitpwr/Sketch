"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "./button";
import { Tool } from "@/canvas/types/types";
import Tools from "./tools";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const [tool, setTool] = useState<Tool>("Pan");
  const [size, setSize] = useState({ w: 0, h: 0 });

  const updateCanvasDimension = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);
      if (canvas.width != newWidth || canvas.height != newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        if (canvasEngine) canvasEngine.handleCanvasResize();
      }
    }
  }, [canvasEngine]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const engine = new CanvasEngine(canvas, ctx);
    setcanvasEngine(engine);
    updateCanvasDimension();
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasEngine || !canvasEngine.currentTool) return;
    canvasEngine.currentTool = tool;
    console.log("Current tool set to:", tool);
  }, [tool, canvasEngine]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      updateCanvasDimension();
    });
    observer.observe(canvasRef.current);

    return () => {
      observer.disconnect();
    };
  }, [updateCanvasDimension]);

  return (
    <div className="w-screen h-screen ">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>

      <Tools setTool={setTool} currentTool={tool} />
    </div>
  );
}
