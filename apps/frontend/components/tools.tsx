import React from "react";
import Button from "./button";
import { ActionTool, ShapeType, Tool } from "@repo/types/canvasTypes";
import {
  Square,
  Hand,
  MousePointer,
  Diamond,
  Circle,
  MoveRight,
  Minus,
  Pencil,
  Eraser,
  TypeOutline,
} from "lucide-react";
import useCanvasStore from "@/app/store/canvas-store";
export default function Tools() {
  const { currentTool, setTool } = useCanvasStore();
  const handleTool = (tool: Tool) => {
    console.log(`tool is being set up ${tool}`);
    setTool(tool);
  };
  return (
    <div className="fixed bg-white top-5 left-1/2 -translate-x-1/2 px-1 py-1 flex md:gap-2  rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ">
      <Button
        isActive={currentTool == ActionTool.HAND ? true : false}
        onClickhandler={() => handleTool(ActionTool.HAND)}
        varient={"secondary"}
        size={"md"}
      >
        <Hand color="#1b1b1f" size={18} strokeWidth={1.5} />{" "}
      </Button>
      <Button
        isActive={currentTool == ActionTool.SELECT ? true : false}
        onClickhandler={() => handleTool(ActionTool.SELECT)}
        varient={"secondary"}
        size={"md"}
      >
        {" "}
        <MousePointer
          fill={currentTool == ActionTool.SELECT ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == ActionTool.SELECT ? 1 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == ShapeType.RECTANGLE ? true : false}
        onClickhandler={() => handleTool(ShapeType.RECTANGLE)}
        size={"md"}
        varient={"secondary"}
      >
        {" "}
        <Square
          fill={currentTool == ShapeType.RECTANGLE ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == ShapeType.RECTANGLE ? 0 : 1.5}
        />{" "}
      </Button>
      <Button
        isActive={currentTool == ShapeType.DIAMOND ? true : false}
        onClickhandler={() => handleTool(ShapeType.DIAMOND)}
        varient={"secondary"}
        size={"md"}
      >
        <Diamond
          fill={currentTool == ShapeType.DIAMOND ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == ShapeType.DIAMOND ? 0 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == ShapeType.ELLIPSE ? true : false}
        onClickhandler={() => handleTool(ShapeType.ELLIPSE)}
        varient={"secondary"}
        size={"md"}
      >
        <Circle
          fill={currentTool == ShapeType.ELLIPSE ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == ShapeType.ELLIPSE ? 0 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == ShapeType.ARROW ? true : false}
        onClickhandler={() => handleTool(ShapeType.ARROW)}
        varient={"secondary"}
        size={"md"}
      >
        <MoveRight color="#1b1b1f" size={20} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == ShapeType.LINE ? true : false}
        onClickhandler={() => handleTool(ShapeType.LINE)}
        varient={"secondary"}
        size={"md"}
      >
        <Minus color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>

      <Button
        isActive={currentTool == ShapeType.PENCIL ? true : false}
        onClickhandler={() => handleTool(ShapeType.PENCIL)}
        varient={"secondary"}
        size={"md"}
      >
        <Pencil color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == ActionTool.ERASER ? true : false}
        onClickhandler={() => handleTool(ActionTool.ERASER)}
        varient={"secondary"}
        size={"md"}
      >
        <Eraser color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == ShapeType.TEXT ? true : false}
        onClickhandler={() => handleTool(ShapeType.TEXT)}
        varient={"secondary"}
        size={"md"}
      >
        <TypeOutline color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
    </div>
  );
}
