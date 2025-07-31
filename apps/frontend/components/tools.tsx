import React from "react";
import Button from "./button";
import { Tool } from "@/canvas/types/types";
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
export default function Tools({
  setTool,
  currentTool,
}: {
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
  currentTool: Tool;
}) {
  const handleTool = (tool: Tool) => {
    console.log(`tool is being set up ${tool}`);
    setTool(tool);
  };
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 px-1 py-1 flex md:gap-2  rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ">
      <Button
        isActive={currentTool == "Pan" ? true : false}
        onClickhandler={() => handleTool("Pan")}
        varient={"secondary"}
        size={"md"}
      >
        <Hand color="#1b1b1f" size={18} strokeWidth={1.5} />{" "}
      </Button>
      <Button
        isActive={currentTool == "Select" ? true : false}
        onClickhandler={() => handleTool("Select")}
        varient={"secondary"}
        size={"md"}
      >
        {" "}
        <MousePointer
          fill={currentTool == "Select" ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == "Select" ? 1 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == "Rectangle" ? true : false}
        onClickhandler={() => handleTool("Rectangle")}
        size={"md"}
        varient={"secondary"}
      >
        {" "}
        <Square
          fill={currentTool == "Rectangle" ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == "Rectangle" ? 0 : 1.5}
        />{" "}
      </Button>
      <Button
        isActive={currentTool == "Diamond" ? true : false}
        onClickhandler={() => handleTool("Diamond")}
        varient={"secondary"}
        size={"md"}
      >
        <Diamond
          fill={currentTool == "Diamond" ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == "Diamond" ? 0 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == "Ellipse" ? true : false}
        onClickhandler={() => handleTool("Ellipse")}
        varient={"secondary"}
        size={"md"}
      >
        <Circle
          fill={currentTool == "Ellipse" ? "#030063" : "transparent"}
          color="#1b1b1f"
          size={18}
          strokeWidth={currentTool == "Ellipse" ? 0 : 1.5}
        />
      </Button>
      <Button
        isActive={currentTool == "Arrow" ? true : false}
        onClickhandler={() => handleTool("Arrow")}
        varient={"secondary"}
        size={"md"}
      >
        <MoveRight color="#1b1b1f" size={20} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == "Line" ? true : false}
        onClickhandler={() => handleTool("Line")}
        varient={"secondary"}
        size={"md"}
      >
        <Minus color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>

      <Button
        isActive={currentTool == "Pencil" ? true : false}
        onClickhandler={() => handleTool("Pencil")}
        varient={"secondary"}
        size={"md"}
      >
        <Pencil color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == "Eraser" ? true : false}
        onClickhandler={() => handleTool("Eraser")}
        varient={"secondary"}
        size={"md"}
      >
        <Eraser color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
      <Button
        isActive={currentTool == "Text" ? true : false}
        onClickhandler={() => handleTool("Text")}
        varient={"secondary"}
        size={"md"}
      >
        <TypeOutline color="#1b1b1f" size={18} strokeWidth={1.5} />
      </Button>
    </div>
  );
}
