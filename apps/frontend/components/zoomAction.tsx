import React from "react";
import Button from "./button";
import { Minus, Plus } from "lucide-react";
import useCanvasStore from "@/app/store/canvas-store";

export default function ZoomAction() {
  const { canvasEngine, zoomValue } = useCanvasStore();
  const handleZoomOut = () => {
    canvasEngine?.ChangeScale(-0.1);
  };

  const handleZoomIn = () => {
    canvasEngine?.ChangeScale(0.1);
  };
  return (
    <div className="fixed flex  left-4 bottom-8 bg-[#ececf4] dark:bg-[#232329] rounded-lg justify-center items-center gap-2 ">
      <Button
        onClickhandler={handleZoomOut}
        varient="secondary"
        size="xs"
        isActive={false}
      >
        <Minus />
      </Button>
      <p className="font-nunito text-sm">{Math.floor(zoomValue)}&#x25;</p>
      <Button
        onClickhandler={handleZoomIn}
        varient="secondary"
        size="xs"
        isActive={false}
      >
        <Plus />
      </Button>
    </div>
  );
}
