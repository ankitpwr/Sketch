import React, { useState } from "react";
import ColorPicker from "./colorPicker";
import {
  BoldLineIcon,
  Dashed,
  Dotted,
  ExtraBold,
  ThinLineIcon,
} from "./svgIcons";
import Stroke from "./stroke";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { StrokeColor } from "@/canvas/utils/drawingConfig";

export default function AppMenu({
  canvasEngine,
}: {
  canvasEngine: CanvasEngine;
}) {
  const [currentColor, setCurrentColor] = useState<StrokeColor>(
    canvasEngine.CurrentShapeStyles.strokeStyle
  );
  const handleStrokeColor = (color: StrokeColor) => {
    canvasEngine.CurrentShapeStyles.strokeStyle = color;
    setCurrentColor(color);
    console.log(canvasEngine.CurrentShapeStyles.strokeStyle);
  };
  const isActive = (strokeColor: StrokeColor) => {
    return canvasEngine.CurrentShapeStyles.strokeStyle == strokeColor;
  };
  return (
    <div className="flex flex-col gap-6 rounded-lg fixed px-3 py-5 left-5 top-20 min-h-96 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Stroke</h1>
        <div className="flex gap-1">
          <ColorPicker
            onClick={() => handleStrokeColor(StrokeColor.PrimaryBlack)}
            color={StrokeColor.PrimaryBlack}
            isActive={isActive(StrokeColor.PrimaryBlack)}
          />
          <ColorPicker
            onClick={() => handleStrokeColor(StrokeColor.PrimaryRed)}
            color={StrokeColor.PrimaryRed}
            isActive={isActive(StrokeColor.PrimaryRed)}
          />
          <ColorPicker
            onClick={() => handleStrokeColor(StrokeColor.PrimaryGreen)}
            color={StrokeColor.PrimaryGreen}
            isActive={isActive(StrokeColor.PrimaryGreen)}
          />
          <ColorPicker
            onClick={() => handleStrokeColor(StrokeColor.PrimaryBlue)}
            color={StrokeColor.PrimaryBlue}
            isActive={isActive(StrokeColor.PrimaryBlue)}
          />
          <ColorPicker
            onClick={() => handleStrokeColor(StrokeColor.PrimaryYellow)}
            color={StrokeColor.PrimaryYellow}
            isActive={isActive(StrokeColor.PrimaryYellow)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Background</h1>
        <div className="flex gap-1">
          {/* <ColorPicker color={"transparent"} />
          <ColorPicker color={"#e03131"} />
          <ColorPicker color={"#1971c2"} />
          <ColorPicker color={"#2f9e44"} />
          <ColorPicker color={"#f08c00"} /> */}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Stroke width</h1>
        <div className="flex gap-2">
          <Stroke>
            <ThinLineIcon size={24} color={"black"} />
          </Stroke>
          <Stroke>
            <BoldLineIcon size={24} color={"black"} />
          </Stroke>
          <Stroke>
            <ExtraBold size={24} color={"black"} />
          </Stroke>
        </div>
        <div></div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Stroke style</h1>
        <div className="flex gap-2">
          <Stroke>
            <ThinLineIcon size={24} color={"black"} />
          </Stroke>
          <Stroke>
            <Dashed size={24} color={"black"} />
          </Stroke>
          <Stroke>
            <Dotted size={24} color={"black"} />
          </Stroke>
        </div>
        <div></div>
      </div>
    </div>
  );
}
