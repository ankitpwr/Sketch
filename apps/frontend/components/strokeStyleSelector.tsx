import React, { useState } from "react";
import Stroke from "./stroke";
import { Dashed, Dotted, ThinLineIcon } from "./svgIcons";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { StrokeType } from "@repo/types/drawingConfig";
import useCanvasStore from "@/app/store/canvas-store";

export default function StrokeStyleSelector() {
  const { canvasEngine } = useCanvasStore();
  const [strokeStyle, setStokeStyle] = useState<StrokeType>(
    canvasEngine!.CurrentShapeStyles.strokeType
  );
  const handleStrokeStyle = (style: StrokeType) => {
    canvasEngine!.CurrentShapeStyles.strokeType = style;
    setStokeStyle(style);
  };
  const isActiveWidthStyle = (style: StrokeType) => {
    return style == canvasEngine!.CurrentShapeStyles.strokeType;
  };
  return (
    <div id="stroke-style-selection" className="flex flex-col gap-2">
      <h1 className="text-sm text-gray-900">Stroke style</h1>
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
