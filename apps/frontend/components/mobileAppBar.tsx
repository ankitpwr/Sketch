import React, { useState } from "react";
import DropDown from "./dropDown";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { Action, ActionTool, Tool } from "@repo/types/canvasTypes";
import DropDownContainer from "./dropDownContainer";
import Button from "./button";
import { Menu, Palette, Share } from "lucide-react";
import AppMenu from "./appMenu";
import AppMenuContainer from "./appMenuContainer";

import useCanvasStore from "@/app/store/canvas-store";
import useUserStore from "@/app/store/user-store";
import Dialog from "./Dialog";

export default function MobileAppBar() {
  const { currentTool, canvasEngine } = useCanvasStore();
  const [dialogBox, setDialogBox] = useState(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [shapeSetting, setshapeSetting] = useState<boolean>(false);
  const { standalone } = useUserStore();
  const varient = standalone ? "primary" : "success";

  const handleShapeSetting = () => {
    setshapeSetting((pre) => !pre);
    setDropDown(false);
  };
  const handleDropDown = () => {
    setDropDown((pre) => !pre);
    setshapeSetting(false);
  };
  return (
    <div className="flex items-center bg-white dark:bg-[#232329] gap-2 min-w-[90%] justify-between rounded-lg fixed px-2 py-2 w-[90%] left-0 right-0 mx-auto bottom-2  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] visible md:invisible">
      <div className="flex">
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
      {currentTool != ActionTool.HAND &&
        currentTool != ActionTool.SELECT &&
        currentTool != ActionTool.ERASER && (
          <div className="flex">
            <Button
              onClickhandler={handleShapeSetting}
              varient={"dropdown"}
              size={"md"}
              isActive={false}
            >
              {" "}
              <Palette size={18} />{" "}
            </Button>
            {shapeSetting && (
              <div className=" rounded-lg  fixed w-full left-1 bottom-20 min-h-96 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <AppMenuContainer />{" "}
              </div>
            )}
          </div>
        )}

      <div>
        <Button
          onClickhandler={() => setDialogBox((pre) => !pre)}
          varient={varient}
          size="md"
          isActive={false}
        >
          {" "}
          <Share size={16} />
        </Button>

        {dialogBox && <Dialog setDialogBox={setDialogBox} />}
      </div>
    </div>
  );
}
