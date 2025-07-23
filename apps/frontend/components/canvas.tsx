"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "./button";
import { TextShape, Tool } from "@/canvas/types/types";
import Tools from "./tools";
import TextArea from "./textArea";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const [tool, setTool] = useState<Tool>("Pan");
  const textRef = useRef(null);

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
    if (!textRef.current) return;
    const engine = new CanvasEngine(canvas, ctx, textRef.current);
    setcanvasEngine(engine);
    updateCanvasDimension();
  }, [canvasRef, textRef.current]);

  useEffect(() => {
    if (!canvasEngine || !canvasEngine.currentTool) return;
    canvasEngine.currentTool = tool;
  }, [tool, canvasEngine]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      updateCanvasDimension();
    });
    //starts monitoring the canvas element
    observer.observe(canvasRef.current);

    return () => {
      observer.disconnect();
    };
  }, [updateCanvasDimension]);

  return (
    <div className="w-screen h-screen relative ">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <TextArea refer={textRef} />
      <Tools setTool={setTool} currentTool={tool} />
    </div>
  );
}
