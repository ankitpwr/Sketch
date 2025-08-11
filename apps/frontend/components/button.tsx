"use client";
import React, { ReactNode } from "react";

const VarientStyle = {
  primary: `flex justify-center items-center text-center px-3 py-2 gap-2  rounded-md text-white  bg-[#6965db]  hover:bg-[#5753d0]`,
  secondary:
    "p-2.5 rounded-md flex items-center justify-center hover:bg-[#f1f0ff] ",
  dropdown:
    "px-2 py-2 rounded-md flex items-center justify-center bg-[#ececf4] text-white",
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
  styles = "",
}: {
  title?: string;
  children?: ReactNode;
  onClickhandler?: React.MouseEventHandler<HTMLButtonElement>;
  varient: keyof typeof VarientStyle;
  size: keyof typeof Size;
  isActive: boolean;
  styles?: string;
}) {
  return (
    <button
      onClick={onClickhandler}
      className={`cursor-pointer ${VarientStyle[varient]} ${Size[size]}    ${isActive && "bg-[#e0dfff]"} ${styles}  `}
    >
      {children}
    </button>
  );
}
