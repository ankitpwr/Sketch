import React, { useEffect, useRef, useState } from "react";
import ColorSelection from "./colorSelector";
import {
  BackgroundColor,
  StrokeColor,
  StrokeType,
} from "@/canvas/utils/drawingConfig";
import ColorPicker from "./colorPicker";
import PencilMenu from "./pencilSetting";

import StrokeWidthSelector from "./strokewidth";
import StrokeStyleSelector from "./strokeStyleSelector";
import { Tool } from "@/canvas/types/types";
import TextSelector from "./TextSelector";
import { CanvasEngine } from "@/canvas/CanvasEngine";

export default function AppMenuContainer({
  canvasEngine,
  tool,
}: {
  canvasEngine: CanvasEngine;
  tool: Tool;
}) {
  const [strokeColor, setCurrentStrokeColor] = useState<StrokeColor | string>(
    canvasEngine.CurrentShapeStyles.strokeStyle
  );
  const [backgroundColor, setBackgroundColor] = useState<
    BackgroundColor | string
  >(canvasEngine.CurrentShapeStyles.background);
  const [strokeColorPicker, setStrokeColorPicker] = useState<boolean>(false);
  const [backgrColorPicker, setBackgroundColorPicker] =
    useState<boolean>(false);

  const strokeInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);

  function isHexColor(hex: string) {
    var hexaPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    return hexaPattern.test(hex) || hex == "#00000000";
  }
  const handleStrokeColor = (color: StrokeColor | string) => {
    if (!isHexColor(color)) return;
    canvasEngine.CurrentShapeStyles.strokeStyle = color;
    canvasEngine.CurrentPencilStyles.StrokeStyle = color;
    canvasEngine.CurrentTextStyle.strokeStyle = color;
    setCurrentStrokeColor(color);
  };

  const handleBackgroundColor = (color: BackgroundColor | string) => {
    if (!isHexColor(color)) return;
    canvasEngine.CurrentShapeStyles.background = color;
    setBackgroundColor(color);
  };

  const handleStrokeColorSelction = () => {
    setBackgroundColorPicker(false);
    setStrokeColorPicker(true);
  };
  const handleBackgroundColorSelction = () => {
    setStrokeColorPicker(false);
    setBackgroundColorPicker(true);
  };
  const isActiveStroke = (strokeColor: StrokeColor) => {
    return canvasEngine.CurrentShapeStyles.strokeStyle == strokeColor;
  };
  const isActiveBackground = (backgroundColor: BackgroundColor) => {
    return canvasEngine.CurrentShapeStyles.background == backgroundColor;
  };

  useEffect(() => {
    function handleMouseDown() {
      console.log("handle color");
      setStrokeColorPicker(false);
      setBackgroundColorPicker(false);
      console.log(strokeInputRef);
      console.log(backgroundInputRef);
      if (strokeInputRef.current) {
        handleStrokeColor(strokeInputRef.current.value);
      }

      if (backgroundInputRef.current) {
        handleBackgroundColor(backgroundInputRef.current.value);
      }
    }
    canvasEngine.canvas.addEventListener("mousedown", handleMouseDown);

    return () =>
      canvasEngine.canvas.removeEventListener("mousedown", handleMouseDown);
  }, []);
  return (
    <div className="flex flex-col bg-white gap-6   px-5 py-5">
      <div id="stroke-color-section" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900  ">Stroke</h1>
        <div className="flex gap-2 md:justify-center items-center">
          <ColorSelection
            onClick={() => handleStrokeColor(StrokeColor.PrimaryBlack)}
            color={StrokeColor.PrimaryBlack}
            isActive={isActiveStroke(StrokeColor.PrimaryBlack)}
          />
          <ColorSelection
            onClick={() => handleStrokeColor(StrokeColor.PrimaryRed)}
            color={StrokeColor.PrimaryRed}
            isActive={isActiveStroke(StrokeColor.PrimaryRed)}
          />
          <ColorSelection
            onClick={() => handleStrokeColor(StrokeColor.PrimaryGreen)}
            color={StrokeColor.PrimaryGreen}
            isActive={isActiveStroke(StrokeColor.PrimaryGreen)}
          />
          <ColorSelection
            onClick={() => handleStrokeColor(StrokeColor.PrimaryBlue)}
            color={StrokeColor.PrimaryBlue}
            isActive={isActiveStroke(StrokeColor.PrimaryBlue)}
          />
          <ColorSelection
            onClick={() => handleStrokeColor(StrokeColor.PrimaryYellow)}
            color={StrokeColor.PrimaryYellow}
            isActive={isActiveStroke(StrokeColor.PrimaryYellow)}
          />
          <div className="w-[1.5px] h-5 rounded-md bg-gray-200"></div>

          <ColorSelection
            color={strokeColor}
            isActive={false}
            isColorPicker={true}
            onClick={handleStrokeColorSelction}
          />
          {strokeColorPicker && (
            <ColorPicker
              isStrokeColorPicker={true}
              currentHexCode={strokeColor}
              refer={strokeInputRef}
            />
          )}
        </div>
      </div>

      <div id="background-color-selection" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Background</h1>
        <div className="flex gap-2 md:justify-center items-center">
          <ColorSelection
            onClick={() => handleBackgroundColor(BackgroundColor.Transparent)}
            color={BackgroundColor.Transparent}
            isActive={isActiveBackground(BackgroundColor.Transparent)}
          />
          <ColorSelection
            onClick={() => handleBackgroundColor(BackgroundColor.BG_Red)}
            color={BackgroundColor.BG_Red}
            isActive={isActiveBackground(BackgroundColor.BG_Red)}
          />
          <ColorSelection
            onClick={() => handleBackgroundColor(BackgroundColor.BG_Green)}
            color={BackgroundColor.BG_Green}
            isActive={isActiveBackground(BackgroundColor.BG_Green)}
          />
          <ColorSelection
            onClick={() => handleBackgroundColor(BackgroundColor.BG_Blue)}
            color={BackgroundColor.BG_Blue}
            isActive={isActiveBackground(BackgroundColor.BG_Blue)}
          />
          <ColorSelection
            onClick={() => handleBackgroundColor(BackgroundColor.BG_Yellow)}
            color={BackgroundColor.BG_Yellow}
            isActive={isActiveBackground(BackgroundColor.BG_Yellow)}
          />
          <div className="w-[1.5px] h-5 rounded-md bg-gray-200"></div>
          <ColorSelection
            color={backgroundColor}
            isActive={false}
            isColorPicker={true}
            onClick={handleBackgroundColorSelction}
          />
          {backgrColorPicker && (
            <ColorPicker
              isStrokeColorPicker={false}
              currentHexCode={backgroundColor}
              refer={backgroundInputRef}
            />
          )}
        </div>
      </div>

      {tool != "Pencil" && tool != "Text" && (
        <StrokeWidthSelector canvasEngine={canvasEngine} />
      )}

      {tool != "Pencil" && tool != "Text" && (
        <StrokeStyleSelector canvasEngine={canvasEngine} />
      )}

      {tool == "Pencil" && <PencilMenu canvasEngine={canvasEngine} />}

      {tool == "Text" && <TextSelector canvasEngine={canvasEngine} />}
    </div>
  );
}
