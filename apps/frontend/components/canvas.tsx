"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef } from "react";
import Button from "./button";
import {
  ActionTool,
  ShapeType,
  TextShape,
  Tool,
} from "@repo/types/canvasTypes";
import Tools from "./tools";
import TextArea from "./textArea";
import AppMenu from "./appMenu";
import DropDown from "./dropDown";
import MobileAppBar from "./mobileAppBar";
import Share from "./Share";
import useCanvasStore from "@/app/store/canvas-store";
import useUserStore from "@/app/store/user-store";
import {
  CANVAS_COLOR_KEYS,
  CanvasColorKey,
  getThemeColors,
  THEME_PALETTE,
} from "@repo/types/drawingConfig";
import { useTheme } from "next-themes";

export default function Canvas() {
  const { userId, username, socket, standalone, roomId } = useUserStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTool, dpr, canvasEngine, setDpr, setTool, setCanvasEngine } =
    useCanvasStore();
  const { resolvedTheme } = useTheme();

  const textRef = useRef(null);

  const isShapeTool = () => {
    return (
      currentTool == ShapeType.RECTANGLE ||
      currentTool == ShapeType.DIAMOND ||
      currentTool == ShapeType.ELLIPSE ||
      currentTool == ShapeType.LINE ||
      currentTool == ShapeType.ARROW ||
      currentTool == ShapeType.TEXT ||
      currentTool == ShapeType.PENCIL
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
      setDpr(window.devicePixelRatio || 1);
    }
    if (!canvasRef.current || !textRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newCanvasEngine = new CanvasEngine(
      canvas,
      ctx,
      textRef.current,
      dpr,
      standalone,
      socket,
      roomId,
      userId
    );
    const storedCanvasKey = localStorage.getItem(
      "canvas-color-key"
    ) as CanvasColorKey;
    const themeColors = getThemeColors(resolvedTheme);
    let initialColors = themeColors.White;
    if (storedCanvasKey && storedCanvasKey in THEME_PALETTE.light) {
      initialColors = themeColors[storedCanvasKey];
    } else {
      localStorage.setItem("canvas-color-key", CANVAS_COLOR_KEYS[0]);
    }
    newCanvasEngine.ChangeCanvasColor(initialColors, storedCanvasKey);
    setCanvasEngine(newCanvasEngine);
    updateCanvasDimension();
  }, [standalone, roomId, socket, userId, setDpr, setCanvasEngine]);

  useEffect(() => {
    if (!canvasEngine || !canvasEngine.currentTool) return;
    canvasEngine.currentTool = currentTool;
  }, [currentTool, canvasEngine]);

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
      {canvasEngine ? (
        <>
          <Tools />
          {isShapeTool() && <AppMenu />}
          <DropDown />
          <MobileAppBar />
          <Share />
        </>
      ) : (
        <div>Loading ...:</div>
      )}
    </div>
  );
}
