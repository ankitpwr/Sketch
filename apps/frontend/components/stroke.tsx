import React, { ReactNode } from "react";

export default function Stroke({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg w-8 h-8  bg-purple-100 flex items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}
