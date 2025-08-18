import {
  BackgroundColorkey,
  STROKE_COLOR_KEYS,
  StrokeColorKey,
} from "@repo/types/drawingConfig";
import React, { ReactElement } from "react";

export default function ColorSelection({
  color,
  onClick,
  isActive,
  isColorPicker,
  isCanvasColor = false,
  colorKey,
}: {
  color: string;
  onClick?: () => void;
  isActive: boolean;
  isColorPicker?: boolean;
  isCanvasColor?: boolean;
  colorKey: StrokeColorKey | BackgroundColorkey;
}) {
  const isTransparent = color == "#00000000";
  if (colorKey == "Stroke_Violet" || colorKey == "BG_White") return;

  return (
    <div
      className={`flex justify-center items-center  rounded-md hover:scale-104 bg-transparent  
        ${isColorPicker ? "scale-115 hover:scale-120" : ""}`}
    >
      <button
        onClick={onClick}
        className={`rounded w-6 h-6   overflow-hidden hover:cursor-pointer 
          ${isCanvasColor ? "border-1 border-[#d9d9d9]" : ""} 
          ${isTransparent ? "bg-transparent-pattern border-1 border-gray-300" : ""}
          ${isActive ? "ring-1 ring-offset-2 ring-[#4a47b1] " : ""}
          ${isActive && !isCanvasColor ? "dark:ring-offset-[#232329]" : "dark:ring-offset-transparent"}
           `}
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
}
