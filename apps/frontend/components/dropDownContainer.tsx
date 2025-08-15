import React, { useEffect, useState } from "react";
import Button from "./button";
import { Github, Linkedin, LogIn, Trash, Users } from "lucide-react";
import ColorSelection from "./colorSelector";
import { Tool } from "@repo/types/canvasTypes";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import { CanvasColor } from "@repo/types/drawingConfig";
import { XIcon } from "./svgIcons";
import useCanvasStore from "@/app/store/canvas-store";
import { useTheme } from "next-themes";
import ThemeToggle from "./themeToggle";
import { useRouter } from "next/navigation";
export default function DropDownContainer() {
  const { currentTool, canvasEngine } = useCanvasStore();
  const router = useRouter();
  const [canvasColor, setCanvasColor] = useState<CanvasColor>(
    canvasEngine!.CanvasColor
  );
  const handleCanvasColor = (color: CanvasColor) => {
    canvasEngine!.ChangeCanvasColor(color);
    setCanvasColor(color);
  };
  const isActiveColor = (color: CanvasColor) => {
    return canvasEngine!.CanvasColor == color;
  };

  const handleClearCanvas = () => {
    canvasEngine!.clearCanvas();
  };

  return (
    <div
      id="drop-down-menu"
      className="flex flex-col bg-white  gap-2.5 dark:bg-[#232329] rounded-lg fixed px-3 py-5 bottom-20 w-full h-fit md:w-66 md:left-5 md:top-20 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
    >
      <Button varient={"sidebar"} size={"md"} isActive={false}>
        <Users size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">
          Live collaboration
        </h1>
      </Button>

      <Button
        onClickhandler={handleClearCanvas}
        varient={"sidebar"}
        size={"md"}
        isActive={false}
      >
        <Trash size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">
          Reset the canvas
        </h1>
      </Button>

      <div
        id="border-line"
        className="w-full h-[1px] rounded-md bg-gray-200 dark:bg-[#2e2d39]"
      ></div>
      <Button varient={"sidebar"} size={"md"} isActive={false}>
        <Github size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">GitHub</h1>
      </Button>
      <Button varient={"sidebar"} size={"md"} isActive={false}>
        <XIcon size={16} color={"#1b1b1f"} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">
          Twitter/X
        </h1>
      </Button>

      <Button varient={"sidebar"} size={"md"} isActive={false}>
        <Linkedin size={16} strokeWidth={1.5} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">
          Linkedin
        </h1>
      </Button>

      <Button
        varient={"sidebar"}
        size={"md"}
        isActive={false}
        onClickhandler={() => router.push("/signup")}
      >
        <LogIn size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">Sign up</h1>
      </Button>

      <div
        id="border-line"
        className="w-full h-[1px] rounded-md bg-gray-200 dark:bg-[#2e2d39] "
      ></div>
      <div
        id="background-color-selection  "
        className="flex flex-col gap-1 pl-3"
      >
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf] ">Theme</h1>
        <ThemeToggle />
      </div>

      <div
        id="border-line"
        className="w-full h-[1px] rounded-md bg-gray-200 dark:bg-[#2e2d39] "
      ></div>
      <div
        id="background-color-selection  "
        className="flex flex-col gap-2 pl-3"
      >
        <h1 className="text-xs text-gray-900 dark:text-[#dadadf] ">
          Canvas background
        </h1>
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
  );
}
