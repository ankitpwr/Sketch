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
import { Tool } from "@repo/types/canvasTypes";

import DropDownContainer from "./dropDownContainer";
import useCanvasStore from "@/app/store/canvas-store";

export default function DropDown() {
  const { currentTool, canvasEngine } = useCanvasStore();

  const [dropDown, setDropDown] = useState<boolean>(false);
  const handleMouseDown = () => {
    setDropDown(false);
  };
  useEffect(() => {
    canvasEngine!.canvas.addEventListener("mousedown", handleMouseDown);
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
        <Menu size={18} />{" "}
      </Button>
      {dropDown && <DropDownContainer />}
    </div>
  );
}
