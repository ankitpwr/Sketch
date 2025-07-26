import React, { ReactElement } from "react";

export default function ColorSelection({
  color,
  onClick,
  isActive,
  isColorPicker,
}: {
  color: string;

  onClick?: () => void;
  isActive: boolean;
  isColorPicker?: boolean;
}) {
  const isTransparent = color == "#00000000";
  return (
    <div
      className={` flex justify-center items-center ${isActive ? "border-1 p-px rounded-md  border-[#4a47b1]" : ""} ${isColorPicker ? "scale-118" : ""}`}
    >
      <button
        onClick={onClick}
        className={`rounded w-6 h-6  overflow-hidden hover:cursor-pointer  ${isTransparent ? "bg-transparent-pattern border-1 border-gray-300" : ""} `}
        style={{ backgroundColor: color }}
      ></button>
    </div>
  );
}
