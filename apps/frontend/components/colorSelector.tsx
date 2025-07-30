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
  return (
    <div
      className={` flex justify-center items-center hover:scale-110  ${isActive ? "border-1 p-px rounded-md  border-[#4a47b1]" : ""} ${isColorPicker ? "scale-118 hover:scale-125" : ""}`}
    >
      <button
        onClick={onClick}
        className={`rounded w-6 h-6   overflow-hidden hover:cursor-pointer ${isCanvasColor ? "border-1 border-[#d9d9d9]" : ""}  ${isTransparent ? "bg-transparent-pattern border-1 border-gray-300" : ""} `}
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
}
