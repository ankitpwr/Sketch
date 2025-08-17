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
      className={`flex items-center justify-center rounded-lg w-8 h-8 hover:cursor-pointer overflow-hidden
        dark:bg-[#2e2d39]
     ${isActive ? "bg-[#e0dfff] dark:bg-[#403e6a] " : "bg-[#f7f7fa]"}
    `}
    >
      {children}
    </div>
  );
}
