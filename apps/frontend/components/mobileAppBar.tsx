import React, { useState } from "react";
import DropDown from "./dropDown";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { Action, ActionTool, Tool } from "@repo/types/canvasTypes";
import DropDownContainer from "./dropDownContainer";
import Button from "./button";
import { Menu, Palette } from "lucide-react";
import AppMenu from "./appMenu";
import AppMenuContainer from "./appMenuContainer";

export default function MobileAppBar({
  canvasEngine,
  tool,
}: {
  canvasEngine: CanvasEngine;
  tool: Tool;
}) {
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [shapeSetting, setshapeSetting] = useState<boolean>(false);

  const handleShapeSetting = () => {
    setshapeSetting((pre) => !pre);
    setDropDown(false);
  };
  const handleDropDown = () => {
    setDropDown((pre) => !pre);
    setshapeSetting(false);
  };
  return (
    <div className="flex items-center bg-white gap-2 min-w-[90%] justify-between rounded-lg fixed px-2 py-2 left-1/2 -translate-x-1/2 bottom-2  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] visible md:invisible">
      <div className="flex">
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
      {tool != ActionTool.HAND &&
        tool != ActionTool.SELECT &&
        tool != ActionTool.ERASER && (
          <div className="flex">
            <Button
              onClickhandler={handleShapeSetting}
              varient={"dropdown"}
              size={"md"}
              isActive={false}
            >
              {" "}
              <Palette color="black" size={18} />{" "}
            </Button>
            {shapeSetting && (
              <div className=" rounded-lg  fixed w-full left-1 bottom-20 min-h-96 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <AppMenuContainer
                  tool={tool}
                  canvasEngine={canvasEngine}
                />{" "}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
