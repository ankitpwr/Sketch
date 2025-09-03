import React, { useEffect, useState } from "react";
import Button from "./button";
import {
  Github,
  Grid,
  GridIcon,
  Linkedin,
  LogIn,
  Trash,
  Users,
} from "lucide-react";
import ColorSelection from "./colorSelector";
import { Tool } from "@repo/types/canvasTypes";
import { CanvasEngine } from "@/canvas/CanvasEngine";
import {
  AppSetting,
  CANVAS_COLOR_KEYS,
  CanvasColorKey,
  getThemeColors,
  setting,
  THEME_PALETTE,
} from "@repo/types/drawingConfig";
import { XIcon } from "./svgIcons";
import useCanvasStore from "@/app/store/canvas-store";
import { useTheme } from "next-themes";
import ThemeToggle from "./themeToggle";
import { useRouter } from "next/navigation";
import useMenuStore from "@/app/store/menu-store";
import useDrawStore from "@/app/store/draw-store";
export default function DropDownContainer() {
  const { canvasEngine, grid, setGrid } = useCanvasStore();
  const { dialogBox, setDialogBox } = useMenuStore();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { setCanvasColorKey } = useDrawStore();

  if (resolvedTheme != "light" && resolvedTheme != "dark") return;
  const themeColors = getThemeColors(resolvedTheme);

  const handleCanvasColor = (colorKey: CanvasColorKey) => {
    canvasEngine!.ChangeCanvasColor(colorKey);
    setCanvasColorKey(colorKey);
  };
  const isActiveColor = (colorKey: CanvasColorKey) => {
    return canvasEngine!.CanvasColorKey == colorKey;
  };

  const handleClearCanvas = () => {
    canvasEngine!.clearCanvas();
  };

  const handleGrid = () => {
    canvasEngine?.ChangeGrid(!grid);
    setGrid(!grid);
  };

  console.log("grid is drop down is ");
  console.log(grid);
  return (
    <div
      id="drop-down-menu"
      className="flex flex-col bg-white gap-2.5 dark:bg-[#232329] rounded-lg fixed px-3 py-5 bottom-20 w-[80%] h-fit md:w-68 md:left-5 md:top-20 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
    >
      <Button
        onClickhandler={() => setDialogBox(!dialogBox)}
        varient={"sidebar"}
        size={"md"}
        isActive={false}
      >
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
      <Button
        onClickhandler={handleGrid}
        varient={"sidebar"}
        size={"md"}
        isActive={grid}
      >
        <Grid size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">Grid</h1>
      </Button>

      <div
        id="border-line"
        className="w-full h-[1px] rounded-md bg-gray-200 dark:bg-[#2e2d39]"
      ></div>
      <Button
        onClickhandler={() =>
          window.location.assign("https://github.com/ankitpwr/Sketch.git")
        }
        varient={"sidebar"}
        size={"md"}
        isActive={false}
      >
        <Github size={16} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">GitHub</h1>
      </Button>
      <Button
        onClickhandler={() => window.location.assign("https://x.com/ankit_pam")}
        varient={"sidebar"}
        size={"md"}
        isActive={false}
      >
        <XIcon size={16} color={"#1b1b1f"} />
        <h1 className="text-sm text-gray-900 dark:text-[#dadadf]  ">
          Twitter/X
        </h1>
      </Button>

      <Button
        onClickhandler={() =>
          window.location.assign(
            "https://www.linkedin.com/in/ankit-panwar-30a997342/"
          )
        }
        varient={"sidebar"}
        size={"md"}
        isActive={false}
      >
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
          {CANVAS_COLOR_KEYS.map((key) => (
            <ColorSelection
              key={key}
              onClick={() => handleCanvasColor(key)}
              color={themeColors[key]}
              isActive={isActiveColor(key)}
              isCanvasColor={true}
              colorKey={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
