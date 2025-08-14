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
      className={`px-3 py-3 border-1 text-[#1b1b1f] border-[#c5c5d0] dark:border-[#46464f] bg-white  dark:bg-[#e7e5fb] rounded-lg w-76 md:w-86 ${styles} `}
      placeholder={placeholder}
      type={type}
      defaultValue={defaultValue}
      readOnly={readonly}
    ></input>
  );
}
