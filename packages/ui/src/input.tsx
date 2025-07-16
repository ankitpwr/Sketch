import React from "react";

export default function Input({
  placeholder,
  type,
}: {
  placeholder: string;
  type: string;
}) {
  return (
    <input
      className="px-4 py-3 border-3 border-gray-500 bg-blue-50"
      placeholder={placeholder}
      type={type}
    ></input>
  );
}
