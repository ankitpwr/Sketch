"use client";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import React, { useCallback, useEffect, useRef } from "react";

import { ShapeType } from "@repo/types/canvasTypes";
import Tools from "./tools";
import TextArea from "./textArea";
import AppMenu from "./appMenu";
import DropDown from "./dropDown";
import MobileAppBar from "./mobileAppBar";
import Share from "./Share";
import useCanvasStore from "@/app/store/canvas-store";
import useUserStore from "@/app/store/user-store";
import { AppSetting, setting } from "@repo/types/drawingConfig";
import { useTheme } from "next-themes";
import useDrawStore from "@/app/store/draw-store";

export default function Canvas() {
  const { userId, username, socket, standalone, roomId } = useUserStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTool, dpr, canvasEngine, setDpr, setCanvasEngine, setGrid } =
    useCanvasStore();
  const {
    canvasColorKey,
    setCanvasColorKey,
    setBackgroundColorKey,
    setStrokeColorKey,
  } = useDrawStore();
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
    const savedSetting = localStorage.getItem("sketch-setting");
    if (!savedSetting) {
      localStorage.setItem("sketch-setting", JSON.stringify(setting));
    } else {
      const parseSketchSetting = JSON.parse(savedSetting) as AppSetting;
      setGrid(parseSketchSetting.grid);
      setCanvasColorKey(parseSketchSetting.canvasColorKey);
      setBackgroundColorKey(parseSketchSetting.backgroundColorKey);
      setStrokeColorKey(parseSketchSetting.strokeColorKey);
    }

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

    setCanvasEngine(newCanvasEngine);
    updateCanvasDimension();
  }, [standalone, roomId, socket, userId, setDpr, setCanvasEngine]);

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

  useEffect(() => {
    if (resolvedTheme == "light" || resolvedTheme == "dark") {
      const savedSetting = localStorage.getItem("sketch-setting");
      canvasEngine?.setCanvasTheme(resolvedTheme);
      if (savedSetting) {
        const parseSketchSetting = JSON.parse(savedSetting) as AppSetting;
        canvasEngine?.ChangeCanvasColor(parseSketchSetting.canvasColorKey);
      }
    }
  }, [resolvedTheme, canvasEngine]);

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
