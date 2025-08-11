import React, { useState } from "react";
import Stroke from "./stroke";
import { Code, Pencil } from "lucide-react";
import { Inter } from "next/font/google";
import {
  CodeIcon,
  ComicFontFamilyIcon,
  FontLargeIcon,
  FontMediumIcon,
  FontSmallIcon,
  NormalFontFamilyIcon,
  XLIcon,
} from "./svgIcons";
import { FontFamily, FontSize } from "@repo/types/drawingConfig";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import useCanvasStore from "@/app/store/canvas-store";

export default function TextSelector() {
  const { canvasEngine } = useCanvasStore();
  const [fontFamily, setFontFamily] = useState<FontFamily>(
    canvasEngine!.CurrentTextStyle.fontfamily
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    canvasEngine!.CurrentTextStyle.fontsize
  );
  const handleFontFamily = (newFontFamily: FontFamily) => {
    canvasEngine!.CurrentTextStyle.fontfamily = newFontFamily;
    setFontFamily(newFontFamily);
  };

  const handleFontSize = (newFontSize: FontSize) => {
    canvasEngine!.CurrentTextStyle.fontsize = newFontSize;
    setFontSize(newFontSize);
  };

  const isActiveFontSize = (fontSize: FontSize) => {
    return canvasEngine!.CurrentTextStyle.fontsize == fontSize;
  };

  const isActiveFontFamily = (fontFamily: FontFamily) => {
    return fontFamily == canvasEngine!.CurrentTextStyle.fontfamily;
  };

  return (
    <div className="flex flex-col gap-6">
      <div id="text-selector" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900 font-comic ">Font Family</h1>
        <div className="flex gap-2">
          <Stroke
            onClick={() => handleFontFamily(FontFamily.HandDrawn)}
            isActive={isActiveFontFamily(FontFamily.HandDrawn)}
          >
            <Pencil color="#1b1b1f" size={16} strokeWidth={1.5} />
          </Stroke>

          <Stroke
            onClick={() => handleFontFamily(FontFamily.Normal)}
            isActive={isActiveFontFamily(FontFamily.Normal)}
          >
            <NormalFontFamilyIcon size={20} color={"#1b1b1f"} />
          </Stroke>

          <Stroke
            onClick={() => handleFontFamily(FontFamily.Code)}
            isActive={isActiveFontFamily(FontFamily.Code)}
          >
            <CodeIcon size={20} color={"#1b1b1f"} />
          </Stroke>

          <Stroke
            onClick={() => handleFontFamily(FontFamily.Comic)}
            isActive={isActiveFontFamily(FontFamily.Comic)}
          >
            <ComicFontFamilyIcon size={20} color={"#1b1b1f"} />
          </Stroke>
        </div>
      </div>

      <div id="text-selector" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900 font-comic ">Font Family</h1>
        <div className="flex gap-2">
          <Stroke
            onClick={() => handleFontSize(FontSize.Small)}
            isActive={isActiveFontSize(FontSize.Small)}
          >
            <FontSmallIcon size={20} color={"#1b1b1f"} />
          </Stroke>

          <Stroke
            onClick={() => handleFontSize(FontSize.Medium)}
            isActive={isActiveFontSize(FontSize.Medium)}
          >
            <FontMediumIcon size={20} color={"#1b1b1f"} />
          </Stroke>

          <Stroke
            onClick={() => handleFontSize(FontSize.Large)}
            isActive={isActiveFontSize(FontSize.Large)}
          >
            <FontLargeIcon size={18} color={"#1b1b1f"} />
          </Stroke>

          <Stroke
            onClick={() => handleFontSize(FontSize.Xl)}
            isActive={isActiveFontSize(FontSize.Xl)}
          >
            <XLIcon size={20} color={"#1b1b1f"} />
          </Stroke>
        </div>
      </div>
    </div>
  );
}
