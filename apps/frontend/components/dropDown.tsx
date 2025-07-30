import React, { useState } from "react";
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

export default function DropDown({
  canvasEngine,
  tool,
}: {
  canvasEngine: CanvasEngine;
  tool: Tool;
}) {
  const [canvasColor, setCanvasColor] = useState<CanvasColor>(
    canvasEngine.CanvasColor
  );
  const [dropDown, setDropDown] = useState<boolean>(false);
  const handleDropDown = () => {
    setDropDown((pre) => !pre);
  };
  const handleCanvasColor = (color: CanvasColor) => {
    canvasEngine.ChangeCanvasColor(color);
    setCanvasColor(color);
  };
  const isActiveColor = (color: CanvasColor) => {
    return canvasEngine.CanvasColor == color;
  };
  return (
    <div className="fixed left-5 top-5">
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
        <div
          id="drop-down-menu"
          className="flex flex-col bg-white   gap-2.5 rounded-lg fixed px-3 py-5 left-5 top-20 min-h-96 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        >
          <Button varient={"primary"} size={"md"} isActive={false}>
            <Users size={18} />
            <h1 className="text-sm text-gray-900  ">Live Collaboration</h1>
          </Button>

          <Button varient={"primary"} size={"md"} isActive={false}>
            <Trash size={18} />
            <h1 className="text-sm text-gray-900  ">Reset the canvas</h1>
          </Button>

          <div
            id="border-line"
            className="w-full h-[1px] rounded-md bg-gray-200"
          ></div>
          <Button varient={"primary"} size={"md"} isActive={false}>
            <Github size={18} />
            <h1 className="text-sm text-gray-900  ">GitHub</h1>
          </Button>
          <Button varient={"primary"} size={"md"} isActive={false}>
            <XIcon size={18} color={"#1b1b1f"} />
            <h1 className="text-sm text-gray-900  ">Twitter/X</h1>
          </Button>

          <Button varient={"primary"} size={"md"} isActive={false}>
            <Linkedin size={18} strokeWidth={1.5} />
            <h1 className="text-sm text-gray-900  ">Linkedin</h1>
          </Button>

          <Button varient={"primary"} size={"md"} isActive={false}>
            <LogIn size={18} />
            <h1 className="text-sm text-gray-900  ">Sign up</h1>
          </Button>

          <div
            id="border-line"
            className="w-full h-[1px] rounded-md bg-gray-200"
          ></div>
          <div
            id="background-color-selection  "
            className="flex flex-col gap-1 pl-3"
          >
            <h1 className="text-sm text-gray-900">Theme</h1>
            <div className="flex gap-1 items-center border-1 border-[#f1f0ff] w-fit rounded-lg">
              <Button varient={"theme"} size={"md"} isActive={false}>
                {" "}
                <Sun size={16} />
              </Button>
              <Button varient={"theme"} size={"md"} isActive={false}>
                {" "}
                <Moon size={16} />
              </Button>
              <Button varient={"theme"} size={"md"} isActive={false}>
                {" "}
                <LaptopMinimal size={16} />
              </Button>
            </div>
          </div>

          <div
            id="border-line"
            className="w-full h-[1px] rounded-md bg-gray-200"
          ></div>
          <div
            id="background-color-selection  "
            className="flex flex-col gap-1 pl-3"
          >
            <h1 className="text-sm text-gray-900">Canvas background</h1>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 justify-center items-center">
                <ColorSelection
                  onClick={() => handleCanvasColor(CanvasColor.white)}
                  color={CanvasColor.white}
                  isActive={isActiveColor(CanvasColor.white)}
                  isCanvasColor={true}
                />
              </div>

              <div className="flex gap-2 justify-center items-center">
                <ColorSelection
                  onClick={() => handleCanvasColor(CanvasColor.Light_Blue)}
                  color={CanvasColor.Light_Blue}
                  isActive={isActiveColor(CanvasColor.Light_Blue)}
                  isCanvasColor={true}
                />
              </div>

              <div className="flex gap-2 justify-center items-center">
                <ColorSelection
                  onClick={() => handleCanvasColor(CanvasColor.Light_Red)}
                  color={CanvasColor.Light_Red}
                  isActive={isActiveColor(CanvasColor.Light_Red)}
                  isCanvasColor={true}
                />
              </div>

              <div className="flex gap-2 justify-center items-center">
                <ColorSelection
                  onClick={() => handleCanvasColor(CanvasColor.Light_Yellow)}
                  color={CanvasColor.Light_Yellow}
                  isActive={isActiveColor(CanvasColor.Light_Yellow)}
                  isCanvasColor={true}
                />
              </div>
              <div className="flex gap-2 justify-center items-center">
                <ColorSelection
                  onClick={() => handleCanvasColor(CanvasColor.Light_Green)}
                  color={CanvasColor.Light_Green}
                  isActive={isActiveColor(CanvasColor.Light_Green)}
                  isCanvasColor={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
