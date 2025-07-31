import React, { useEffect, useState } from "react";
import Button from "./button";
import {
  Github,
  LaptopIcon,
  LaptopMinimal,
  Linkedin,
  LogIn,
  Menu,
  Moon,
  Sun,
  Trash,
  Users,
} from "lucide-react";
import { XIcon } from "./svgIcons";
import ColorSelection from "./colorSelector";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { Tool } from "@/canvas/types/types";
import { CanvasColor } from "@/canvas/utils/drawingConfig";
import DropDownContainer from "./dropDownContainer";

export default function DropDown({
  canvasEngine,
  tool,
}: {
  canvasEngine: CanvasEngine;
  tool: Tool;
}) {
  const [dropDown, setDropDown] = useState<boolean>(false);
  const handleMouseDown = () => {
    setDropDown(false);
  };
  useEffect(() => {
    canvasEngine.canvas.addEventListener("mousedown", handleMouseDown);
    return () => removeEventListener("mousedown", handleMouseDown);
  }, []);
  const handleDropDown = () => {
    setDropDown((pre) => !pre);
  };
  return (
    <div className="fixed left-5 top-5 invisible md:visible  ">
      <Button
        onClickhandler={handleDropDown}
        varient={"dropdown"}
        size={"md"}
        isActive={false}
      >
        {" "}
        <Menu color="black" size={18} />{" "}
      </Button>
      {dropDown && (
        <DropDownContainer tool={tool} canvasEngine={canvasEngine} />
      )}
    </div>
  );
}
