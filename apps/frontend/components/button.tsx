"use client";
import React, { ReactNode } from "react";

const VarientStyle = {
  primary: "px-3 py-3 rounded-md bg-purple-400 text-white",
  secondary: "p-2.5 rounded-md",
};

const Size = {
  sm: `w-24 h-8 rounded-md   gap-1 text-md`,
  md: ` rounded-md  gap-2 text-lg `,
};
export default function Button({
  varient,
  size,
  children,
  isActive,
  onClickhandler,
}: {
  title?: string;
  children?: ReactNode;
  onClickhandler?: React.MouseEventHandler<HTMLButtonElement>;
  varient: keyof typeof VarientStyle;
  size: keyof typeof Size;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClickhandler}
      className={`${VarientStyle[varient]} ${Size[size]} flex items-center justify-center hover:bg-purple-200 cursor-pointer ${isActive && "bg-purple-200"}`}
    >
      {children}
    </button>
  );
}
