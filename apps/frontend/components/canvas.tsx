"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "./button";
import { TextShape, Tool } from "@/canvas/types/types";
import Tools from "./tools";
import TextArea from "./textArea";
import AppMenu from "./appMenu";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const [tool, setTool] = useState<Tool>("Pan");
  const textRef = useRef(null);
  const [dpr, setdpr] = useState(1);

  const isShapeTool = () => {
    return (
      tool == "Rectangle" ||
      tool == "Diamond" ||
      tool == "Ellipse" ||
      tool == "Line" ||
      tool == "Arrow" ||
      tool == "Text" ||
      tool == "Pencil"
    );
  };

  const updateCanvasDimension = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);
      if (canvas.width != newWidth * dpr || canvas.height != newHeight * dpr) {
        canvas.width = newWidth * dpr;
        canvas.height = newHeight * dpr;
        const ctx = canvas.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (canvasEngine) canvasEngine.handleCanvasResize();
      }
    }
  }, [canvasEngine, dpr]);

  useEffect(() => {
    if (typeof window != undefined) {
      setdpr(window.devicePixelRatio || 1);
    }
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!textRef.current) return;
    const engine = new CanvasEngine(canvas, ctx, textRef.current, dpr);
    setcanvasEngine(engine);
    updateCanvasDimension();
  }, [canvasRef, textRef.current, dpr]);

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
      {isShapeTool() && canvasEngine && (
        <AppMenu tool={tool} canvasEngine={canvasEngine} />
      )}
    </div>
  );
}
