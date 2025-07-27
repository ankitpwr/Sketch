import React, { ReactNode } from "react";

export default function Stroke({
  children,
  onClick,
  isActive,
}: {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg w-8 h-8   hover:cursor-pointer flex items-center justify-center overflow-hidden
     ${isActive ? "bg-[#e0dfff]" : "bg-[#f7f7fa]"}
    `}
    >
      {children}
    </div>
  );
}
