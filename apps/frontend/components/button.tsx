"use client";
import React from "react";

export default function Button({
  title,
  onClickhandler,
}: {
  title: string;
  onClickhandler?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClickhandler}
      className="px-3 py-3 rounded-md bg-purple-400 text-white"
    >
      {title}
    </button>
  );
}
