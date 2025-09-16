import { CanvasEngine } from "@/canvas/CanvasEngine";
import { ActionTool, Tool } from "@repo/types/canvasTypes";
import { setting } from "@repo/types/drawingConfig";
import { create, StateCreator } from "zustand";

interface CanvasState {
  currentTool: Tool;
  canvasEngine: CanvasEngine | null;
  dpr: number;
  grid: boolean;
  zoomValue: number;
}
interface CanvasAction {
  setTool: (currentTool: Tool) => void;
  setCanvasEngine: (canvasEngine: CanvasEngine | null) => void;
  setDpr: (dpr: number) => void;
  setGrid: (grid: boolean) => void;
  setZoomValue: (zoomValue: number) => void;
}

type CanvasStoreType = CanvasState & CanvasAction;

const CanvasStore: StateCreator<CanvasStoreType> = (set) => ({
  currentTool: ActionTool.HAND,
  canvasEngine: null,
  dpr: 1,
  grid: setting.grid,
  zoomValue: 1,

  setTool: (currentTool: Tool) => set({ currentTool: currentTool }),
  setCanvasEngine: (canvasEngine: CanvasEngine | null) =>
    set({ canvasEngine: canvasEngine }),
  setDpr: (dpr: number) => set({ dpr: dpr }),
  setGrid: (grid: boolean) => {
    setting.grid = grid;
    set({ grid: grid });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setZoomValue: (zoomValue: number) => set({ zoomValue: zoomValue }),
});

const useCanvasStore = create<CanvasState & CanvasAction>(CanvasStore);
export default useCanvasStore;
