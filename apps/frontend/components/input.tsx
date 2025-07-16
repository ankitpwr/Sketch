"use client";
import React from "react";

export default function Input({
  placeholder,
  type,
  refer,
}: {
  placeholder: string;
  type: string;
  refer?: React.Ref<HTMLInputElement> | null;
}) {
  return (
    <input
      ref={refer}
      className="px-3 py-3 border-1 border-gray-400 rounded-md"
      placeholder={placeholder}
      type={type}
    ></input>
  );
}
