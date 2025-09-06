import React from "react";
import Stroke from "./stroke";
import { CrossHachure, Hachure, SolidSquare, ZigZag } from "./svgIcons";
import useCanvasStore from "@/app/store/canvas-store";
import useDrawStore from "@/app/store/draw-store";
import { FillStyle } from "@repo/types/drawingConfig";

export default function FillStyleSetting() {
  const { canvasEngine } = useCanvasStore();
  const { fillStyle, setFillStyle } = useDrawStore();
  const handleFillStyle = (fillStyle: FillStyle) => {
    canvasEngine!.ChangeFillStyle(fillStyle);
    setFillStyle(fillStyle);
  };

  const isActiveFillStyle = (fill: FillStyle) => {
    return fillStyle == fill;
  };
  return (
    <div id="fill-style-selector" className="flex flex-col gap-2">
      <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf]">
        Fill Style
      </h1>

      <div className="flex gap-2">
        <Stroke
          onClick={() => handleFillStyle(FillStyle.Solid)}
          isActive={isActiveFillStyle(FillStyle.Solid)}
        >
          <SolidSquare size={20} />
        </Stroke>
        <Stroke
          onClick={() => handleFillStyle(FillStyle.Hachure)}
          isActive={isActiveFillStyle(FillStyle.Hachure)}
        >
          <Hachure size={20} />
        </Stroke>
        <Stroke
          onClick={() => handleFillStyle(FillStyle.CrossHatch)}
          isActive={isActiveFillStyle(FillStyle.CrossHatch)}
        >
          <CrossHachure size={20} />
        </Stroke>

        <Stroke
          onClick={() => handleFillStyle(FillStyle.ZigZagLine)}
          isActive={isActiveFillStyle(FillStyle.ZigZagLine)}
        >
          <ZigZag size={22} />
        </Stroke>
      </div>
    </div>
  );
}
