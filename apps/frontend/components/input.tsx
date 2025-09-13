"use client";
import React from "react";

export default function Input({
  placeholder,
  type,
  refer,
  defaultValue = "",
  readonly = false,
  styles = "",
}: {
  placeholder: string;
  type: string;
  refer?: React.Ref<HTMLInputElement> | null;
  defaultValue?: string;
  readonly?: boolean;
  styles?: string;
}) {
  return (
    <input
      ref={refer}
      className={`px-2 py-3 border-1 border-[#767680] focus:outline-none text-[#1b1b1f] bg-gray-100 dark:bg-[#2e2d39] dark:border-[#46464f] dark:text-white rounded-lg w-76 md:w-86 ${styles} font-nunito `}
      placeholder={placeholder}
      type={type}
      defaultValue={defaultValue}
      readOnly={readonly}
    ></input>
  );
}
