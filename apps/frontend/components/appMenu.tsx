import React, { useEffect, useRef, useState } from "react";

import { CanvasEngine } from "@/canvas/CanvasEngine";
import {
  BackgroundColor,
  StrokeColor,
  StrokeType,
} from "@/canvas/utils/drawingConfig";

import ColorSelection from "./colorSelector";
import ColorPicker from "./colorPicker";
import PencilMenu from "./pencilSetting";

import StrokeWidthSelector from "./strokewidth";
import StrokeStyleSelector from "./strokeStyleSelector";
import { Tool } from "@/canvas/types/types";
import TextSelector from "./TextSelector";
import AppMenuContainer from "./appMenuContainer";

export default function AppMenu({
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
    <div className=" invisible md:visible rounded-lg fixed left-5 top-20 min-h-96 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <AppMenuContainer tool={tool} canvasEngine={canvasEngine} />
    </div>
  );
}
