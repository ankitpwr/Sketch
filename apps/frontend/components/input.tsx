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
      className={`px-3 py-3 border-1 border-gray-400 rounded-md ${styles} `}
      placeholder={placeholder}
      type={type}
      defaultValue={defaultValue}
      readOnly={readonly}
    ></input>
  );
}
