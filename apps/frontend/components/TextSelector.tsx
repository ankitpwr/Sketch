import React, { useState } from "react";
import Stroke from "./stroke";
import { Code, Pencil } from "lucide-react";
import { Inter } from "next/font/google";
import {
  CodeIcon,
  ComicFontFamilyIcon,
  FontLargeIcon,
  NormalFontFamilyIcon,
} from "./svgIcons";
import { FontFamily } from "@/canvas/utils/drawingConfig";
import { CanvasEngine } from "@/canvas/CanvasEngine";

export default function TextSelector({
  canvasEngine,
}: {
  canvasEngine: CanvasEngine;
}) {
  const [fontFamily, setFontFamily] = useState<FontFamily>();
  const handleFontFamily = (newFontFamily: FontFamily) => {
    canvasEngine.CurrentTextStyle.fontfamily = newFontFamily;
    setFontFamily(newFontFamily);
  };

  const isActiveFontFamily = (fontFamily: FontFamily) => {
    return fontFamily == canvasEngine.CurrentTextStyle.fontfamily;
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
    </div>
  );
}
