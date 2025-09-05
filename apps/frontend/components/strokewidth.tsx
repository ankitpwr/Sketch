import React, { useState } from "react";
import Stroke from "./stroke";
import { BoldLineIcon, ExtraBold, ThinLineIcon } from "./svgIcons";

import { CanvasEngine } from "@/canvas/CanvasEngine";
import { StrokeWidth } from "@repo/types/drawingConfig";
import useCanvasStore from "@/app/store/canvas-store";
import useDrawStore from "@/app/store/draw-store";

export default function StrokeWidthSelector() {
  const { canvasEngine } = useCanvasStore();
  const { strokeWidth, setStrokeWidth } = useDrawStore();
  const handleStrokeWidth = (width: StrokeWidth) => {
    canvasEngine!.ChangeStrokeWidth(width);
    setStrokeWidth(width);
  };
  const isActiveWidth = (width: StrokeWidth) => {
    return width == strokeWidth;
  };
  return (
    <div id="stroke-width-selection" className="flex flex-col gap-2">
      <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf]">
        Stroke width
      </h1>
      <div className="flex gap-2">
        <Stroke
          onClick={() => handleStrokeWidth(StrokeWidth.Thin)}
          isActive={isActiveWidth(StrokeWidth.Thin)}
        >
          <ThinLineIcon size={24} color={"black"} />
        </Stroke>
        <Stroke
          onClick={() => handleStrokeWidth(StrokeWidth.Bold)}
          isActive={isActiveWidth(StrokeWidth.Bold)}
        >
          <BoldLineIcon size={24} color={"black"} />
        </Stroke>
        <Stroke
          onClick={() => handleStrokeWidth(StrokeWidth.ExtraBold)}
          isActive={isActiveWidth(StrokeWidth.ExtraBold)}
        >
          <ExtraBold size={24} color={"black"} />
        </Stroke>
      </div>
    </div>
  );
}
