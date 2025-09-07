import React from "react";
import Stroke from "./stroke";
import { Edges } from "@repo/types/drawingConfig";
import useDrawStore from "@/app/store/draw-store";
import { RoundEdges, SharpEdges } from "./svgIcons";
import useCanvasStore from "@/app/store/canvas-store";

export default function EdgeSelector() {
  const { canvasEngine } = useCanvasStore();
  const { edges, setEdges } = useDrawStore();
  const handleEdge = (edge: Edges) => {
    canvasEngine!.ChangeEdge(edge);
    console.log(`in edge selector ${edge}`);
    setEdges(edge);
  };

  const isActiveEdge = (edge: Edges) => {
    return edge == edges;
  };
  return (
    <div id="fill-style-selector" className="flex flex-col gap-2">
      <h1 className="text-xs font-nunito text-gray-900 dark:text-[#dadadf]">
        Edges
      </h1>

      <div className="flex gap-2">
        <Stroke
          onClick={() => handleEdge(Edges.Rounded)}
          isActive={isActiveEdge(Edges.Rounded)}
        >
          <RoundEdges size={20} />
        </Stroke>
        <Stroke
          onClick={() => handleEdge(Edges.Sharp)}
          isActive={isActiveEdge(Edges.Sharp)}
        >
          <SharpEdges size={20} />
        </Stroke>
      </div>
    </div>
  );
}
