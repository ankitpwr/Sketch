"use client";
import React, { ReactNode } from "react";

const VarientStyle = {
  primary: `flex justify-center items-center text-center px-3 py-2 gap-2  rounded-lg text-white  bg-[#6965db]  hover:bg-[#5753d0]`,
  success: `flex justify-center items-center text-center px-3 py-2 gap-2  rounded-lg text-white  bg-[#0fb884] hover:bg-[#0d9b70]`,
  secondary:
    "p-2.5 rounded-md flex items-center justify-center hover:bg-[#f1f0ff] ",
  dropdown:
    "px-2 py-2 rounded-md flex items-center justify-center bg-[#ececf4] text-white",
  theme: `py-2 px-3 rounded-lg flex items-center justify-center `,
};

const Size = {
  sm: `w-24 h-10 gap-1 text-md`,
  md: ` rounded-lg`,
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
  const inactiveThemeStyle = "text-gray-500 dark:text-[#9f9cf1]";
  const activeThemeStyle =
    "bg-[#6965db] text-white dark:bg-[#a8a5ff] dark:text-[#121212]";
  return (
    <button
      onClick={onClickhandler}
      className={`cursor-pointer  ${VarientStyle[varient]} ${Size[size]} 
          ${varient === "theme" ? (isActive ? activeThemeStyle : inactiveThemeStyle) : ""}
          ${styles}`}
    >
      {children}
    </button>
  );
}
