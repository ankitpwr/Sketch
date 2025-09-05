import React, { useState } from "react";
import Stroke from "./stroke";
import { Dashed, Dotted, ThinLineIcon } from "./svgIcons";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { StrokeType } from "@repo/types/drawingConfig";
import useCanvasStore from "@/app/store/canvas-store";
import useDrawStore from "@/app/store/draw-store";

export default function StrokeStyleSelector() {
  const { canvasEngine } = useCanvasStore();
  const { strokeStyle, setStrokeStyle } = useDrawStore();
  const handleStrokeStyle = (style: StrokeType) => {
    canvasEngine!.ChangeStrokeStyle(style);
    setStrokeStyle(style);
  };
  const isActiveWidthStyle = (style: StrokeType) => {
    return style == strokeStyle;
  };
  return (
    <div id="stroke-style-selection" className="flex flex-col gap-2">
      <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf]">
        Stroke style
      </h1>
      <div className="flex gap-2">
        <Stroke
          onClick={() => handleStrokeStyle(StrokeType.Solid)}
          isActive={isActiveWidthStyle(StrokeType.Solid)}
        >
          <ThinLineIcon size={24} color={"black"} />
        </Stroke>
        <Stroke
          onClick={() => handleStrokeStyle(StrokeType.Dashed)}
          isActive={isActiveWidthStyle(StrokeType.Dashed)}
        >
          <Dashed size={24} color={"black"} />
        </Stroke>
        <Stroke
          onClick={() => handleStrokeStyle(StrokeType.Dotted)}
          isActive={isActiveWidthStyle(StrokeType.Dotted)}
        >
          <Dotted size={24} color={"black"} />
        </Stroke>
      </div>
    </div>
  );
}
