import React, { useState } from "react";
import Stroke from "./stroke";
import {
  BoldLineIcon,
  ExtraBold,
  HighThinningIcon,
  MediumThinningIcon,
  NoTaperIcon,
  NoThinningIcon,
  SharpTaperIcon,
  SubtleTaperIcon,
  ThinLineIcon,
} from "./svgIcons";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import {
  StrokeSizePencil,
  StrokeWidth,
  Tapper,
  Thinning,
} from "@/canvas/utils/drawingConfig";

export default function PencilMenu({
  canvasEngine,
}: {
  canvasEngine: CanvasEngine;
}) {
  const [strokeWidth, setStokeWidth] = useState<StrokeSizePencil>(
    canvasEngine.CurrentPencilStyles.strokeWidth
  );
  const [taper, setTaper] = useState<Tapper>(
    canvasEngine.CurrentPencilStyles.tapper
  );
  const [thinning, setThinning] = useState<Thinning>(
    canvasEngine.CurrentPencilStyles.thinning
  );

  const handleStrokeWidth = (width: StrokeSizePencil) => {
    canvasEngine.CurrentPencilStyles.strokeWidth = width;
    setStokeWidth(width);
  };
  const isActiveWidth = (width: StrokeSizePencil) => {
    return width == canvasEngine.CurrentPencilStyles.strokeWidth;
  };

  const handleTaper = (newTape: Tapper) => {
    canvasEngine.CurrentPencilStyles.tapper = newTape;
    setTaper(newTape);
  };
  const isActiveTaper = (newTape: Tapper) => {
    return canvasEngine.CurrentPencilStyles.tapper == newTape;
  };

  const handleThinning = (newthinning: Thinning) => {
    canvasEngine.CurrentPencilStyles.thinning = newthinning;
    setThinning(newthinning);
  };
  const isActiveThinning = (newthinning: Thinning) => {
    return newthinning == canvasEngine.CurrentPencilStyles.thinning;
  };
  return (
    <div className="flex flex-col   gap-6">
      <div id="pencil-width" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Stroke width</h1>
        <div className="flex gap-2">
          <Stroke
            onClick={() => handleStrokeWidth(StrokeSizePencil.Thin)}
            isActive={isActiveWidth(StrokeSizePencil.Thin)}
          >
            <ThinLineIcon size={24} color={"black"} />
          </Stroke>
          <Stroke
            onClick={() => handleStrokeWidth(StrokeSizePencil.Bold)}
            isActive={isActiveWidth(StrokeSizePencil.Bold)}
          >
            <BoldLineIcon size={24} color={"black"} />
          </Stroke>
          <Stroke
            onClick={() => handleStrokeWidth(StrokeSizePencil.ExtraBold)}
            isActive={isActiveWidth(StrokeSizePencil.ExtraBold)}
          >
            <ExtraBold size={24} color={"black"} />
          </Stroke>
        </div>
        <div id="tapper"></div>
      </div>
      <div id="pencil-tape" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Tapper</h1>
        <div className="flex gap-2">
          <Stroke
            onClick={() => handleTaper(Tapper.None)}
            isActive={isActiveTaper(Tapper.None)}
          >
            <NoTaperIcon size={24} color={"black"} />
          </Stroke>
          <Stroke
            onClick={() => handleTaper(Tapper.Subtle)}
            isActive={isActiveTaper(Tapper.Subtle)}
          >
            <SubtleTaperIcon size={24} color={"black"} />
          </Stroke>

          <Stroke
            onClick={() => handleTaper(Tapper.Sharp)}
            isActive={isActiveTaper(Tapper.Sharp)}
          >
            <SharpTaperIcon size={24} color={"black"} />
          </Stroke>
        </div>
      </div>
      <div id="pencil-thinning" className="flex flex-col gap-2">
        <h1 className="text-sm text-gray-900">Thinning</h1>
        <div className="flex gap-2">
          <Stroke
            onClick={() => handleThinning(Thinning.None)}
            isActive={isActiveThinning(Thinning.None)}
          >
            <NoThinningIcon size={24} color={"black"} />
          </Stroke>
          <Stroke
            onClick={() => handleThinning(Thinning.Medium)}
            isActive={isActiveThinning(Thinning.Medium)}
          >
            <MediumThinningIcon size={24} color={"black"} />
          </Stroke>

          <Stroke
            onClick={() => handleThinning(Thinning.High)}
            isActive={isActiveThinning(Thinning.High)}
          >
            <HighThinningIcon size={24} color={"black"} />
          </Stroke>
        </div>
      </div>
    </div>
  );
}
