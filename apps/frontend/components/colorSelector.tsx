import React, { ReactElement } from "react";

export default function ColorSelection({
  color,
  onClick,
  isActive,
  isColorPicker,
  isCanvasColor = false,
}: {
  color: string;

  onClick?: () => void;
  isActive: boolean;
  isColorPicker?: boolean;
  isCanvasColor?: boolean;
}) {
  const isTransparent = color == "#00000000";
  // console.log("in color selection");
  // console.log(color);
  return (
    <div
      className={`flex justify-center items-center  rounded-md hover:scale-104  
        ${isColorPicker ? "scale-115 hover:scale-120" : ""}`}
    >
      <button
        onClick={onClick}
        className={`rounded w-6 h-6   overflow-hidden hover:cursor-pointer 
          ${isCanvasColor ? "border-1 border-[#d9d9d9]" : ""} 
          ${isTransparent ? "bg-transparent-pattern border-1 border-gray-300" : ""}
          ${isActive ? "ring-1 ring-offset-2 ring-[#4a47b1]" : ""}
           `}
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
}
