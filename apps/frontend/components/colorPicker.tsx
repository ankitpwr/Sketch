import React, { ReactElement } from "react";

export default function ColorPicker({
  color,
  children,
  onClick,
  isActive,
}: {
  color: string;
  children?: ReactElement;
  onClick?: () => void;
  isActive: boolean;
}) {
  const isTransparent = color == "transparent";
  return (
    <button
      onClick={onClick}
      className={`rounded w-6 h-6  flex items-center justify-center overflow-hidden hover:cursor-pointer ${isActive ? "border-2 border-purple-300 scale-120" : ""} ${isTransparent ? "bg-transparent-pattern border-1 border-gray-300" : ""} `}
      style={{ backgroundColor: color }}
    >
      {children}
    </button>
  );
}
