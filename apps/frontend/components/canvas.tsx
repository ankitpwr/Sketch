"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "./button";
import { TextShape, Tool } from "@repo/types/canvasTypes";
import Tools from "./tools";
import TextArea from "./textArea";
import AppMenu from "./appMenu";
import DropDown from "./dropDown";
import MobileAppBar from "./mobileAppBar";
import Share from "./Share";

export default function Canvas({
  standalone,
  socket,
  roomId = "",
  userId = "",
}: {
  standalone: boolean;
  socket: WebSocket | null;
  roomId?: string;
  userId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [canvasEngine, setcanvasEngine] = useState<CanvasEngine>();
  const engineRef = useRef<CanvasEngine | null>(null);
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
        if (engineRef.current) engineRef.current.handleCanvasResize();
      }
    }
  }, [engineRef.current, dpr]);

  useEffect(() => {
    if (typeof window != undefined) {
      setdpr(window.devicePixelRatio || 1);
    }
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!textRef.current) return;
    engineRef.current = new CanvasEngine(
      canvas,
      ctx,
      textRef.current,
      dpr,
      standalone,
      socket,
      roomId,
      userId
    );
    // setcanvasEngine(engine);
    updateCanvasDimension();
  }, [canvasRef, textRef.current, dpr]);

  useEffect(() => {
    if (!engineRef.current || !engineRef.current.currentTool) return;
    engineRef.current.currentTool = tool;
  }, [tool, engineRef.current]);

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
      {isShapeTool() && engineRef.current && (
        <AppMenu tool={tool} canvasEngine={engineRef.current} />
      )}
      {engineRef.current && (
        <DropDown tool={tool} canvasEngine={engineRef.current} />
      )}
      {engineRef.current && (
        <MobileAppBar tool={tool} canvasEngine={engineRef.current} />
      )}

      <Share />
    </div>
  );
}
