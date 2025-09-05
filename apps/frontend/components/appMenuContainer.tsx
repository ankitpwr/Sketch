import React, { useEffect, useRef, useState } from "react";
import ColorSelection from "./colorSelector";
import {
  BackgroundColorkey,
  BG_COLOR_KEYS,
  getThemeColors,
  STROKE_COLOR_KEYS,
  StrokeColorKey,
} from "@repo/types/drawingConfig";

import PencilMenu from "./pencilSetting";

import StrokeWidthSelector from "./strokewidth";
import StrokeStyleSelector from "./strokeStyleSelector";
import { ShapeType, Tool } from "@repo/types/canvasTypes";
import TextSelector from "./TextSelector";

import useCanvasStore from "@/app/store/canvas-store";
import { useTheme } from "next-themes";
import useDrawStore from "@/app/store/draw-store";

export default function AppMenuContainer() {
  const { currentTool, canvasEngine } = useCanvasStore();
  const { resolvedTheme } = useTheme();

  const {
    strokeColorKey,
    backgroundColorKey,
    setStrokeColorKey,
    setBackgroundColorKey,
  } = useDrawStore();

  const [strokeColorPicker, setStrokeColorPicker] = useState<boolean>(false);
  const [backgrColorPicker, setBackgroundColorPicker] =
    useState<boolean>(false);

  const strokeInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);

  function isHexColor(hex: string) {
    var hexaPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    return hexaPattern.test(hex) || hex == "#00000000";
  }

  if (resolvedTheme != "light" && resolvedTheme != "dark") return;
  const themeColors = getThemeColors(resolvedTheme);

  const handleStrokeColor = (colorKey: StrokeColorKey, newcolor?: string) => {
    if (newcolor) {
      //color picker logic
    } else if (colorKey) {
      canvasEngine!.ChangeStrokeColor(colorKey);
      setStrokeColorKey(colorKey);
    }
  };

  const handleBackgroundColor = (
    colorKey: BackgroundColorkey,
    newcolor?: string
  ) => {
    if (newcolor) {
      //color picker logic
    } else if (colorKey) {
      canvasEngine!.ChangeBackgroundColor(colorKey);
      setBackgroundColorKey(colorKey);
    }
  };

  const handleStrokeColorSelction = () => {
    setBackgroundColorPicker(false);
    setStrokeColorPicker(true);
  };
  const handleBackgroundColorSelction = () => {
    setStrokeColorPicker(false);
    setBackgroundColorPicker(true);
  };
  const isActiveStroke = (Key: StrokeColorKey) => {
    return strokeColorKey == Key;
  };
  const isActiveBackground = (key: BackgroundColorkey) => {
    return backgroundColorKey == key;
  };

  useEffect(() => {
    function handleMouseDown() {
      setStrokeColorPicker(false);
      setBackgroundColorPicker(false);

      if (strokeInputRef.current) {
        handleStrokeColor(STROKE_COLOR_KEYS[0], strokeInputRef.current.value);
      }
      if (backgroundInputRef.current) {
        handleBackgroundColor(
          BG_COLOR_KEYS[0],
          backgroundInputRef.current.value
        );
      }
    }
    canvasEngine!.canvas.addEventListener("mousedown", handleMouseDown);

    return () =>
      canvasEngine!.canvas.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {}, [resolvedTheme]);
  return (
    <div className="flex flex-col bg-white dark:bg-[#232329] gap-6 px-5 py-5 rounded-lg w-[65%] md:w-fit">
      <div id="stroke-color-section" className="flex flex-col gap-2">
        <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf] ">
          Stroke
        </h1>
        <div className="flex gap-2 md:justify-start items-center">
          <div className="flex gap-1.5 md:justify-center items-center">
            {STROKE_COLOR_KEYS.map((key) => (
              <ColorSelection
                key={key}
                onClick={() => handleStrokeColor(key)}
                color={themeColors[key]}
                isActive={isActiveStroke(key)}
                colorKey={key}
              />
            ))}
          </div>
          <div className="w-[1.5px] h-6 rounded-md bg-gray-200 dark:bg-[#343a40]"></div>
          <ColorSelection
            color={themeColors[strokeColorKey]}
            isActive={false}
            isColorPicker={true}
            onClick={handleStrokeColorSelction}
            colorKey={strokeColorKey}
          />
          {/* {strokeColorPicker && (
            <ColorPicker
              isStrokeColorPicker={true}
              currentHexCode={strokeColor}
              refer={strokeInputRef}
            />
          )} */}
        </div>
      </div>

      <div id="background-color-selection" className="flex flex-col gap-2">
        <h1 className="font-nunito text-xs text-gray-900 dark:text-[#dadadf] ">
          Background
        </h1>
        <div className="flex gap-2 md:justify-start items-center">
          <div className="flex gap-1.5 md:justify-center items-center">
            {BG_COLOR_KEYS.map((key) => (
              <ColorSelection
                key={key}
                onClick={() => handleBackgroundColor(key)}
                color={themeColors[key]}
                isActive={isActiveBackground(key)}
                colorKey={key}
              />
            ))}
          </div>
          <div className="w-[1.5px] h-6 rounded-md bg-gray-200 dark:bg-[#343a40]"></div>
          <ColorSelection
            color={themeColors[backgroundColorKey]}
            isActive={false}
            isColorPicker={true}
            onClick={handleBackgroundColorSelction}
            colorKey={backgroundColorKey}
          />
          {/* {backgrColorPicker && (
            <ColorPicker
              isStrokeColorPicker={false}
              currentHexCode={backgroundColor}
              refer={backgroundInputRef}
            />
          )} */}
        </div>
      </div>

      {currentTool != ShapeType.PENCIL && currentTool != ShapeType.TEXT && (
        <StrokeWidthSelector />
      )}

      {currentTool != ShapeType.PENCIL && currentTool != ShapeType.TEXT && (
        <StrokeStyleSelector />
      )}

      {currentTool == ShapeType.PENCIL && <PencilMenu />}

      {currentTool == ShapeType.TEXT && <TextSelector />}
    </div>
  );
}
