"use client";
import React, { ReactNode } from "react";

const VarientStyle = {
  primary: "flex gap-3 items-center  rounded-md px-3 py-2 w-56",
  secondary: "p-2.5 rounded-md flex items-center justify-center ",
  dropdown:
    "px-2 py-2 rounded-md flex items-center justify-center bg-[#ececf4] text-white hover:bg-#6741d9",
  theme: "p-2 rounded-md flex items-center justify-center ",
};

const Size = {
  sm: `w-24 h-8 gap-1 text-md`,
  md: `rounded-lg`,
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
      className={`${VarientStyle[varient]} ${Size[size]}  hover:bg-[#f1f0ff] cursor-pointer ${isActive && "bg-[#e0dfff]"}`}
    >
      {children}
    </button>
  );
}
