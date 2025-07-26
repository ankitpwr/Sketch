import React, { useState } from "react";
import ColorSelection from "./colorSelector";
import Input from "./input";

export default function ColorPicker({
  currentHexCode,
  refer,
  isStrokeColorPicker,
}: {
  currentHexCode: string;
  refer: React.RefObject<HTMLInputElement | null>;
  left?: number;
  isStrokeColorPicker: boolean;
}) {
  const [hexcode, setHexcode] = useState(currentHexCode);
  return (
    <div
      className={`fixed py-4 px-4 left-65 ${isStrokeColorPicker ? "top-30" : "top-50"} rounded bg-white   shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900 ">Hex code</h1>

        <input
          ref={refer}
          className={`pl-3 pr-1 py-1.5 border-1 border-[#f1f0ff] rounded-lg focus:border-[#4a47b1] focus:outline-none`}
          placeholder="color"
          type={"text"}
          value={hexcode}
          onChange={(e) => setHexcode(e.target.value)}
        />
      </div>
    </div>
  );
}
