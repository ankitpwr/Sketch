import React, { useEffect, useRef, useState } from "react";
import ColorSelection from "./colorSelector";
import {
  BackgroundColor,
  BackgroundColorkey,
  BG_COLOR_KEYS,
  getThemeColors,
  STROKE_COLOR_KEYS,
  StrokeColor,
  StrokeColorKey,
  StrokeType,
} from "@repo/types/drawingConfig";
import ColorPicker from "./colorPicker";
import PencilMenu from "./pencilSetting";

import StrokeWidthSelector from "./strokewidth";
import StrokeStyleSelector from "./strokeStyleSelector";
import { ShapeType, Tool } from "@repo/types/canvasTypes";
import TextSelector from "./TextSelector";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import useCanvasStore from "@/app/store/canvas-store";
import { useTheme } from "next-themes";

export default function AppMenuContainer() {
  const { currentTool, canvasEngine } = useCanvasStore();
  const { resolvedTheme } = useTheme();

  const [strokeColor, setCurrentStrokeColor] = useState<StrokeColor | string>(
    canvasEngine!.CurrentShapeStyles.strokeStyle
  );
  const [backgroundColor, setBackgroundColor] = useState<
    BackgroundColor | string
  >(canvasEngine!.CurrentShapeStyles.background);
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
      if (!isHexColor(newcolor)) return;
      canvasEngine!.ChangeStrokeColor(newcolor);
      setCurrentStrokeColor(newcolor);
    } else if (colorKey) {
      const color = themeColors[colorKey] as StrokeColorKey;
      if (!isHexColor(color)) return;
      canvasEngine!.ChangeStrokeColor(color);
      setCurrentStrokeColor(color);
    }
  };

  const handleBackgroundColor = (
    colorKey: BackgroundColorkey,
    newcolor?: string
  ) => {
    if (newcolor) {
      if (!isHexColor(newcolor)) return;
      canvasEngine!.ChangeStrokeColor(newcolor);
    } else if (colorKey) {
      const color = themeColors[colorKey] as BackgroundColorkey;
      if (!isHexColor(color)) return;
      canvasEngine!.ChangeBackgroundColor(color);
      setBackgroundColor(color);
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
  const isActiveStroke = (strokeColor: StrokeColor | string) => {
    return canvasEngine!.CurrentShapeStyles.strokeStyle == strokeColor;
  };
  const isActiveBackground = (backgroundColor: BackgroundColor | string) => {
    return canvasEngine!.CurrentShapeStyles.background == backgroundColor;
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

  useEffect(() => {
    const storedStrokeColor = localStorage.getItem("stroke-color") as string;
    const storedBackgroundColor = localStorage.getItem(
      "background-color"
    ) as string;
    if (storedStrokeColor && storedBackgroundColor) {
      if (isHexColor(storedStrokeColor) && isHexColor(storedBackgroundColor)) {
        canvasEngine!.ChangeStrokeColor(storedStrokeColor);
        canvasEngine!.ChangeBackgroundColor(storedBackgroundColor);
      }
    }
  }, [resolvedTheme]);
  return (
    <div className="flex flex-col bg-white dark:bg-[#232329] gap-6 px-5 py-5 rounded-lg">
      <div id="stroke-color-section" className="flex flex-col gap-2">
        <h1 className="text-xs text-gray-900 dark:text-[#dadadf] ">Stroke</h1>
        <div className="flex gap-2 md:justify-start items-center">
          <div className="flex gap-1.5 md:justify-center items-center">
            {STROKE_COLOR_KEYS.map((key) => (
              <ColorSelection
                key={key}
                onClick={() => handleStrokeColor(key)}
                color={themeColors[key]}
                isActive={isActiveStroke(themeColors[key])}
              />
            ))}
          </div>
          <div className="w-[1.5px] h-6 rounded-md bg-gray-200 dark:bg-[#343a40]"></div>
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
        <h1 className="text-xs text-gray-900 dark:text-[#dadadf] ">
          Background
        </h1>
        <div className="flex gap-2 md:justify-center items-center">
          <div className="flex gap-1.5 md:justify-center items-center">
            {BG_COLOR_KEYS.map((key) => (
              <ColorSelection
                key={key}
                onClick={() => handleBackgroundColor(key)}
                color={themeColors[key]}
                isActive={isActiveBackground(themeColors[key])}
              />
            ))}
          </div>
          <div className="w-[1.5px] h-6 rounded-md bg-gray-200 dark:bg-[#343a40]"></div>
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
