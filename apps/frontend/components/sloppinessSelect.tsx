import useCanvasStore from "@/app/store/canvas-store";
import useDrawStore from "@/app/store/draw-store";
import React from "react";
import Stroke from "./stroke";
import { Sloppiness } from "@repo/types/drawingConfig";
import { LargeSloppiness, MediumSloppiness, NormalSloppines } from "./svgIcons";

export default function SloppinessSelect() {
  const { canvasEngine } = useCanvasStore();
  const { sloppiness, setSloppiness } = useDrawStore();
  const handleSloppiness = (sloppiness: Sloppiness) => {
    canvasEngine!.ChangeSloppliness(sloppiness);
    setSloppiness(sloppiness);
  };

  const isActiveSloppiness = (roughness: Sloppiness) => {
    return roughness == sloppiness;
  };
  return (
    <div id="fill-style-selector" className="flex flex-col gap-2">
      <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf]">
        Sloppiness
      </h1>

      <div className="flex gap-2">
        <Stroke
          onClick={() => handleSloppiness(Sloppiness.Architect)}
          isActive={isActiveSloppiness(Sloppiness.Architect)}
        >
          <NormalSloppines size={20} />
        </Stroke>
        <Stroke
          onClick={() => handleSloppiness(Sloppiness.Artist)}
          isActive={isActiveSloppiness(Sloppiness.Artist)}
        >
          <MediumSloppiness size={20} />
        </Stroke>
        <Stroke
          onClick={() => handleSloppiness(Sloppiness.Cartoonist)}
          isActive={isActiveSloppiness(Sloppiness.Cartoonist)}
        >
          <LargeSloppiness size={20} />
        </Stroke>
      </div>
    </div>
  );
}
